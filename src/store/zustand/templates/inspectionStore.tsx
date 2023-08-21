import create from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getAPI, postAPI, putAPI } from "src/lib/axios";
import {
  postApiData,
  fetchIndividualApi,
  putApiData,
  patchApiData,
} from "src/modules/apiRequest/apiRequest";
import { url } from "src/utils/url";
import { useTemplateFieldsStore } from "./templateFieldsStore";

export const useInspectionStore = create(
  devtools(
    immer((set) => {
      return {
        inspections: [],
        inspection: undefined,
        isLoading: false,
        inspectionsMedia: [],
        manageInspectionData: {},
        setStatusAs: null,

        postInspection: async (values: any, navigate: any) => {
          set({ isLoading: true });
          const response = await postAPI("/templates-data/", values);
          if (response) {
            set((state: any) => {
              state.inspections = [];
              state.isLoading = false;
            });
            navigate?.("/inspection");
          }
        },

        updateInspection: async ({ inspectionId, values, navigate, goTo }: any) => {
          set({ isLoading: true });
          const response = await putAPI(`templates-data/${inspectionId}`, values);
          if (response) {
            set((state: any) => {
              state.inspections = [];
              state.isLoading = false;
            });
            if (!goTo) {
              navigate?.("/inspections");
              return;
            }
            goTo?.(response.data);
          }
        },

        resetInspection: async (inspectionId: number, values: any, navigate: any) => {
          set((state: any) => {
            state.inspection = undefined;
          });
        },

        getInspection: async (inspectionId: any) => {
          set((state: any) => {
            state.isLoading = true;
          });
          const response = await getAPI(`templates-data/${inspectionId}`);
          set((state: any) => {
            if (response) {
              state.inspection = response.data;
              state.isLoading = false;
            }
          });
        },

        postInspectionMedia: async (values: any) => {
          const formData = new FormData();
          formData.append("id", values.id);
          formData.append("files", values.files);
          const response = await postAPI("/templates-data/upload-media/", formData);

          set((state: any) => {
            state.inspectionsMedia = response.data?.media;
          });
        },

        postInspectionInspection: async (values: any, navigate: any) => {
          const response = await postAPI("/inspections-data/", values);
          if (response) {
            navigate?.("/inspections");
          }
          // set((state: any) => {
          //   state.inspectionsMedia = response.data?.media;
          // });
        },

        notifyUser: async ({ values, enqueueSnackbar }: any) => {
          return await postApiData({
            values: values,
            url: "/templates/notify/",
            // setterLoading: setLoading,
            // enqueueSnackbar: enqueueSnackbar,
            setterFunction: (data: any) => {
              // set((state: any) => {
              //   return {
              //     multipleResponseData: [{ ...data?.data }, ...state.multipleResponseData],
              //     loading: false,
              //   };
              // });
            },
            domain: "Notify User",
          });
        },

        manageInspection: async ({ id, query }: any) => {
          set({ setStatusAs: null });
          set({ isLoading: true });
          const apiResponse = await fetchIndividualApi({
            url: url?.manageInspection,
            id: id,
            setterFunction: (data: any) => {
              set({ manageInspectionData: data, isLoading: false });
            },
          });
          !apiResponse && set({ isLoading: false });
          return apiResponse;
        },

        setAsCompleted: async ({ query, id, values }: any) => {
          set({ isLoading: true });
          const apiResponse = await patchApiData({
            url: url?.setAsCompleted,
            id: id + "/",
            values: values,
            getAll: true,
            setterFunction: (data: any) => {
              if (data) {
                set({ setStatusAs: data, isLoading: false });
              }
            },
          });
          set({ isLoading: false });
          !apiResponse && set({ isLoading: false });
          return apiResponse;
        },
      };
    }),
  ),
);
