import create from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getAPI, putAPI } from "src/lib/axios";

export const useReportRequestStore = create(
  devtools(
    immer((set) => ({
      //   templates: [],
      isLayoutLoading: false,
      isProfileLabelLoading: false,

      updateTemplateLayout: async (layoutPayload: any, layoutId: any, enqueueSnackbar: any) => {
        set((state: any) => {
          state.isLayoutLoading = true;
        });
        const response = await putAPI(`template-report/${layoutId}`, layoutPayload);
        set((state: any) => {
          state.isLayoutLoading = false;
          enqueueSnackbar("Data saved successfully", {
            variant: "success",
          });
          // state.successOpen = true;
          // state.successMessage = response.data.message;
        });
      },
    })),
  ),
);
