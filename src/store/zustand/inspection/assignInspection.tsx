import create from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { parseQueryParams } from "utils/queryParams";

export const useAssignInspectionStore = create<any>(
  devtools(
    immer((set) => ({
      assignInspections: [],
      assignInspection: undefined,
      isLoading: false,
      assignInspectionsMedia: [],

      postAssignInspection: async ({ values, query = {}, enqueueSnackbar }: any) => {
        try {
          set((state: any) => {
            state.isLoading = true;
          });
          const response = await postAPI(
            `/templates/assign-inspection${parseQueryParams(query)}`,
            values,
          );
          if (response) {
            set((state: any) => {
              state.assignInspections = response.data;
              state.isLoading = false;
            });
            enqueueSnackbar(response?.data?.message, { variant: "success" });
            return true;
          }
        } catch (err) {
          set((state: any) => {
            state.isLoading = false;
          });
        }
      },

      updateAssignInspection: async (assignInspectionId: number, values: any, navigate: any) => {
        const response = await putAPI(`templates/assign-inspection/${assignInspectionId}`, values);
        if (response) {
          navigate("/assignInspection");
        }
        set((state: any) => {
          state.assignInspections = response.data;
        });
      },

      getAssignInspection: async (assignInspectionId: any) => {
        set((state: any) => {
          state.isLoading = true;
        });
        const response = await getAPI(`templates/assign-inspection/${assignInspectionId}`);
        set((state: any) => {
          if (response) {
            state.assignInspection = response.data;
            state.isLoading = false;
          }
        });
      },
      getAssignInspections: async ({ query = {} }) => {
        set((state: any) => {
          state.isLoading = true;
        });
        const response = await getAPI(`templates/assign-inspection/${parseQueryParams(query)}`);
        set((state: any) => {
          if (response) {
            state.assignInspections = response.data;
            state.isLoading = false;
          }
        });
      },
    })),
  ),
);
