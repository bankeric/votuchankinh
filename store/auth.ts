import { Language, Model } from "@/interfaces/chat";
import { User } from "@/interfaces/user";
import { removeAuthToken } from "@/lib/axios";
import { appToast } from "@/lib/toastify";
import { authService, LoginDto } from "@/service/auth";
import { AxiosError } from "axios";
import router from "next/router";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  login: (formData: LoginDto) => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => {
  return {
    user: null,
    login: async (formData: LoginDto) => {
      await authService.login(formData);
    },
    getCurrentUser: async () => {
      try {
        const user = await authService.getCurrentUser();
        set({ user });
      } catch (error) {
        console.error("Error getting current user:", error);
        // if 404, redirect to login
        if (error instanceof AxiosError && error.response?.status === 404) {
          removeAuthToken();
          router.push("/login");
          appToast("Please login to continue", {
            type: "error",
          });
        }
      }
    },
  };
});
