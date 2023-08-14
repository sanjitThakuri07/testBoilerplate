import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthStoreType } from "src/interfaces/authProps";

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => ({
      authenticated: undefined,
      setAuthenticated: (isAuthenticated) => set(() => ({ authenticated: isAuthenticated })),
      clearAuthenticated: () => set(() => ({ authenticated: undefined })),
    }),
    { name: "auth" },
  ),
);
