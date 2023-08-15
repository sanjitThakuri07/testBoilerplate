import create from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import { parseQueryParams } from "src/utils/queryParams";

export const useInspectionNameStore = create<any>(
  devtools(
    immer((set) => ({
      inspectionNames: [],
      inspectionName: undefined,
      isLoading: false,
      inspectionNamesMedia: [],

      postInspectionName: async (values: any, navigate: any) => {
        const response = await postAPI("/inspection-name/", values);
        if (response) {
          navigate("/inspectionName");
        }
        set((state: any) => {
          state.inspectionNames = response.data;
        });
      },

      updateInspectionName: async (inspectionNameId: number, values: any, navigate: any) => {
        const response = await putAPI(`inspection-name/${inspectionNameId}`, values);
        if (response) {
          navigate("/inspectionName");
        }
        set((state: any) => {
          state.inspectionNames = response.data;
        });
      },

      getInspectionName: async (inspectionNameId: any) => {
        set((state: any) => {
          state.isLoading = true;
        });
        const response = await getAPI(`inspection-name/${inspectionNameId}`);
        set((state: any) => {
          if (response) {
            state.inspectionName = response.data;
            state.isLoading = false;
          }
        });
      },
      getInspectionNames: async ({ query = {} }) => {
        set((state: any) => {
          state.isLoading = true;
        });
        const response = await getAPI(`inspection-name/${parseQueryParams(query)}`);
        set((state: any) => {
          if (response) {
            state.inspectionNames = response.data;
            state.isLoading = false;
          }
        });
      },
    })),
  ),
);
