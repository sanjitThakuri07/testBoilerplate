import create from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { parseQueryParams } from "src/utils/queryParams";

export const useOrganizationUserStore = create<any>(
  devtools(
    immer((set) => ({
      organizationUsers: [],
      organizationUser: undefined,
      isLoading: false,
      organizationUsersMedia: [],

      postOrganizationUser: async (values: any, navigate: any) => {
        const response = await postAPI("/organization-user/", values);
        if (response) {
          navigate("/organizationUser");
        }
        set((state: any) => {
          state.organizationUsers = response.data;
        });
      },

      updateOrganizationUser: async (organizationUserId: number, values: any, navigate: any) => {
        const response = await putAPI(`organization-user/${organizationUserId}`, values);
        if (response) {
          navigate("/organizationUser");
        }
        set((state: any) => {
          state.organizationUsers = response.data;
        });
      },

      getOrganizationUser: async (organizationUserId: any) => {
        set((state: any) => {
          state.isLoading = true;
        });
        const response = await getAPI(`organization-user/${organizationUserId}`);
        set((state: any) => {
          if (response) {
            state.organizationUser = response.data;
            state.isLoading = false;
          }
        });
      },
      getOrganizationUsers: async ({ query = {} }) => {
        set((state: any) => {
          state.isLoading = true;
        });
        const response = await getAPI(`organization-user/${parseQueryParams(query)}`);
        set((state: any) => {
          if (response) {
            state.organizationUsers = response.data;
            state.isLoading = false;
          }
        });
      },
    })),
  ),
);
