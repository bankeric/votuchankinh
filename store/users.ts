import { create } from "zustand";
import { User, CreateUserDto, UpdateUserDto, UserFilters, UserListResponse } from "@/interfaces/user";
import { userService } from "@/service/user";
import { appToast } from "@/lib/toastify";

interface UserState {
  // State
  users: User[];
  loading: boolean;
  error: string | null;
  filters: UserFilters;
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
  stats: {
    total: number;
    admin: number;
    contributor: number;
    student: number;
    viewer: number;
    online: number;
  };
  pendingRoleChanges: Record<string, User["role"]>;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<UserFilters>) => void;
  setPagination: (pagination: Partial<UserState["pagination"]>) => void;
  setStats: (stats: UserState["stats"]) => void;
  
  // API Actions
  fetchUsers: (filters?: UserFilters, offset?: number, limit?: number) => Promise<void>;
  fetchUserStats: () => Promise<void>;
  createUser: (userData: CreateUserDto) => Promise<void>;
  updateUser: (id: string, userData: UpdateUserDto) => Promise<void>;
  updateUserRole: (id: string, role: User["role"]) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // Local Actions
  setPendingRoleChange: (userId: string, role: User["role"]) => void;
  clearPendingRoleChange: (userId: string) => void;
  clearAllPendingRoleChanges: () => void;
  
  // Utility Actions
  getUserById: (id: string) => User | undefined;
  getFilteredUsers: () => User[];
  getRoleCounts: () => {
    total: number;
    admin: number;
    contributor: number;
    student: number;
    viewer: number;
  };
}

export const useUserStore = create<UserState>((set, get) => ({
  // Initial State
  users: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    role: undefined,
    status: undefined,
    sortBy: "lastActive",
    sortOrder: "desc",
  },
  pagination: {
    offset: 0,
    limit: 50,
    total: 0,
  },
  stats: {
    total: 0,
    admin: 0,
    contributor: 0,
    student: 0,
    viewer: 0,
    online: 0,
  },
  pendingRoleChanges: {},

  // State Setters
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters },
    pagination: { ...state.pagination, offset: 0 } // Reset pagination when filters change
  })),
  setPagination: (pagination) => set((state) => ({ 
    pagination: { ...state.pagination, ...pagination } 
  })),
  setStats: (stats) => set({ stats }),

  // API Actions
  fetchUsers: async (filters, offset = 0, limit = 50) => {
    const { setLoading, setError, setPagination } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      const currentFilters = filters || get().filters;
      const response: UserListResponse = await userService.getUsers(offset, limit, currentFilters);
      
      set({
        users: response.users,
        pagination: {
          offset: response.offset,
          limit: response.limit,
          total: response.count,
        },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch users");
      appToast("Failed to fetch users", { type: "error" });
    } finally {
      setLoading(false);
    }
  },

  fetchUserStats: async () => {
    const { setError } = get();
    
    try {
      const stats = await userService.getUserStats();
      set({ stats });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch user stats");
    }
  },

  createUser: async (userData) => {
    const { setLoading, setError, fetchUsers, fetchUserStats } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      await userService.createUser(userData);
      
      appToast("User created successfully", { type: "success" });
      
      // Refresh the user list and stats
      await fetchUsers();
      await fetchUserStats();
    } catch (error) {
      console.error("Error creating user:", error);
      setError(error instanceof Error ? error.message : "Failed to create user");
      appToast("Failed to create user", { type: "error" });
    } finally {
      setLoading(false);
    }
  },

  updateUser: async (id, userData) => {
    const { setLoading, setError, fetchUsers } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      await userService.updateUser(id, userData);
      
      appToast("User updated successfully", { type: "success" });
      
      // Refresh the user list
      await fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      setError(error instanceof Error ? error.message : "Failed to update user");
      appToast("Failed to update user", { type: "error" });
    } finally {
      setLoading(false);
    }
  },

  updateUserRole: async (id, role) => {
    const { setLoading, setError, fetchUsers, fetchUserStats, clearPendingRoleChange } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      await userService.updateUserRole(id, role);
      
      appToast("User role updated successfully", { type: "success" });
      
      // Clear pending change and refresh data
      clearPendingRoleChange(id);
      await fetchUsers();
      await fetchUserStats();
    } catch (error) {
      console.error("Error updating user role:", error);
      setError(error instanceof Error ? error.message : "Failed to update user role");
      appToast("Failed to update user role", { type: "error" });
    } finally {
      setLoading(false);
    }
  },

  deleteUser: async (id) => {
    const { setLoading, setError, fetchUsers, fetchUserStats } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      await userService.deleteUser(id);
      
      appToast("User deleted successfully", { type: "success" });
      
      // Refresh the user list and stats
      await fetchUsers();
      await fetchUserStats();
    } catch (error) {
      console.error("Error deleting user:", error);
      setError(error instanceof Error ? error.message : "Failed to delete user");
      appToast("Failed to delete user", { type: "error" });
    } finally {
      setLoading(false);
    }
  },

  // Local Actions
  setPendingRoleChange: (userId, role) => set((state) => ({
    pendingRoleChanges: { ...state.pendingRoleChanges, [userId]: role }
  })),

  clearPendingRoleChange: (userId) => set((state) => {
    const updated = { ...state.pendingRoleChanges };
    delete updated[userId];
    return { pendingRoleChanges: updated };
  }),

  clearAllPendingRoleChanges: () => set({ pendingRoleChanges: {} }),

  // Utility Actions
  getUserById: (id) => {
    const { users } = get();
    return users.find(user => user.uuid === id);
  },

  getFilteredUsers: () => {
    const { users, filters } = get();
    
    return users.filter((user) => {
      const matchesSearch = !filters.search || 
        user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesRole = !filters.role || user.role === filters.role;
      
      return matchesSearch && matchesRole;
    });
  },

  getRoleCounts: () => {
    const { users } = get();
    const counts = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total: users.length,
      admin: counts.admin || 0,
      contributor: counts.contributor || 0,
      student: counts.student || 0,
      viewer: counts.viewer || 0,
    };
  },
}));
