import { getAPI } from "src/lib/axios";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const userInfos = create(
  devtools(
    immer((set) => ({
      sidebarImage: null,
      isLoading: true,

      getUserInfos: async () => {
        set((state: any) => {
          state.isLoading = true;
        });
        const { status, data } = await getAPI("organization-global-settings/details");
        if (status === 200) {
          set((state: any) => {
            state.isLoading = false;
            state.sidebarImage = data;
          });
        }
      },
    })),
  ),
);
