import create from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { parseQueryParams } from "utils/queryParams";

export const useUserRoleStore = create<any>(
  devtools(
    immer((set) => ({
      userRoles: [],
      userRole: undefined,
      isLoading: false,
      userRolesMedia: [],

      postUserRole: async (values: any, navigate: any) => {
        const response = await postAPI("/user-role/", values);
        if (response) {
          navigate("/userRole");
        }
        set((state: any) => {
          state.userRoles = response.data;
        });
      },

      updateUserRole: async (userRoleId: number, values: any, navigate: any) => {
        const response = await putAPI(`user-role/${userRoleId}`, values);
        if (response) {
          navigate("/userRole");
        }
        set((state: any) => {
          state.userRoles = response.data;
        });
      },

      getUserRole: async (userRoleId: any) => {
        set((state: any) => {
          state.isLoading = true;
        });
        const response = await getAPI(`user-role/${userRoleId}`);
        set((state: any) => {
          if (response) {
            state.userRole = response.data;
            state.isLoading = false;
          }
        });
      },
      getUserRoles: async ({ query = {} }) => {
        set((state: any) => {
          state.isLoading = true;
        });
        const response = await getAPI(`user-role/${parseQueryParams(query)}`);
        set((state: any) => {
          if (response) {
            state.userRoles = response.data;
            state.isLoading = false;
          }
        });
      },
    })),
  ),
);
