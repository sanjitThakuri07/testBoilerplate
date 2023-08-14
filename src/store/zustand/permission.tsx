import create from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getAPI, postAPI, putAPI } from "src/lib/axios";

interface permissionTypes {
  permissions: any;
  permission: any;
  isLoading: Boolean;
  postPermission: Function;
  updatePermission: Function;
  getPermission: Function;
  getPermissions: Function;
  setPermissions: Function;
}

// "add_Calendar"
// 16
// :
// "view_Calendar"
// 17
// :
// "delete_Calendar"
// 18
// :
// "edit_Calendar"

const fakeCustomerPermissions = [
  {
    Calendar: {
      add: "add_Calendar",
      view: "view_Calendar",
      delete: "delete_Calendar",
      edit: "edit_Calendar",
      export: "export_Calendar",
    },
  },
];

export const usePermissionStore = create(
  devtools(
    immer<permissionTypes>((set) => ({
      permissions: [],
      permission: undefined,
      isLoading: false,

      setPermissions: async (values: any, navigate: any) => {
        set((state: any) => {
          state.permissions = [];
        });
      },

      postPermission: async (values: any, navigate: any) => {
        const response = await postAPI("/permissions/", values);
        if (response) {
          navigate("/permission");
        }
        set((state: any) => {
          state.permissions = response.data;
        });
      },

      updatePermission: async (permissionId: number, values: any, navigate: any) => {
        const response = await putAPI(`permissions/${permissionId}`, values);
        if (response) {
          navigate("/permission");
        }
        set((state: any) => {
          state.permissions = response.data;
        });
      },

      getPermission: async (permissionId: any) => {
        set((state: any) => {
          state.isLoading = true;
        });
        const response = await getAPI(`permissions/${permissionId}`);
        set((state: any) => {
          if (response) {
            state.permission = response.data;
            state.isLoading = false;
          }
        });
      },

      getPermissions: async () => {
        set((state: any) => {
          state.isLoading = true;
        });
        const response = await getAPI(`user-permission/self`);
        set((state: any) => {
          if (response) {
            state.permissions = response.data;
            state.isLoading = false;
          }
        });
      },
    })),
  ),
);
