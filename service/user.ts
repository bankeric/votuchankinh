import { User, CreateUserDto, UpdateUserDto, UserFilters, UserListResponse } from "@/interfaces/user";
import axiosInstance from "@/lib/axios";

class UserService {
    private readonly BASE_URL = '/api/v1/users';

    async getUsers(
        offset: number = 0, 
        limit: number = 50, 
        filters?: UserFilters
    ): Promise<UserListResponse> {
        const params = new URLSearchParams({
            offset: offset.toString(),
            limit: limit.toString(),
        });

        if (filters?.search) {
            params.append('search', filters.search);
        }
        if (filters?.role) {
            params.append('role', filters.role);
        }
        if (filters?.sortBy) {
            params.append('sortBy', filters.sortBy);
        }
        if (filters?.sortOrder) {
            params.append('sortOrder', filters.sortOrder);
        }

        const { data } = await axiosInstance.get<UserListResponse>(`${this.BASE_URL}?${params.toString()}`);
        return data;
    }

    async getUser(id: string): Promise<User> {
        const { data } = await axiosInstance.get<{ user: User }>(`${this.BASE_URL}/${id}`);
        return data.user;
    }

    async createUser(userData: CreateUserDto): Promise<User> {
        const { data } = await axiosInstance.post<{ user: User }>(`${this.BASE_URL}`, userData);
        return data.user;
    }

    async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
        const { data } = await axiosInstance.put<{ user: User, message: string }>(`${this.BASE_URL}/${id}`, userData);
        return data.user;
    }

    async updateUserRole(id: string, role: User["role"]): Promise<User> {
        const { data } = await axiosInstance.put<{ user: User, message: string }>(`${this.BASE_URL}/${id}`, { role });
        return data.user;
    }

    async deleteUser(id: string): Promise<void> {
        await axiosInstance.delete(`${this.BASE_URL}/${id}`);
    }

    async getUserStats(): Promise<{
        total: number;
        admin: number;
        contributor: number;
        student: number;
        viewer: number;
        online: number;
    }> {
        const { data } = await axiosInstance.get<{
            total: number;
            admin: number;
            contributor: number;
            student: number;
            viewer: number;
            online: number;
        }>(`${this.BASE_URL}/stats`);
        return data;
    }
}

export const userService = new UserService();