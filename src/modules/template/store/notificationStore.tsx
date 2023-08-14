import create from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { getAPI, patchAPI, postAPI, putAPI } from "src/lib/axios";
import { postApiData } from "src/modules/apiRequest/apiRequest";
import { responseChoice } from "../itemTypes/itemTypes";

export const useNotificationStore = create(
  devtools(
    immer((set) => ({
      notifications: [],
      notification: undefined,
      inspection: undefined,
      isLoading: false,

      postNotification: async (values: any, navigate: any, enqueueSnackbar: any) => {
        // const response = await postAPI('/notifications/', values);
        // if (response) {
        //   navigate('/notification');
        //   return true;
        // }
        // set((state: any) => {
        //   state.notifications = response.data;
        // });
        set({ isLoading: true });
        const apiResponse = await postApiData({
          values: values,
          url: "/notification-message/",
          enqueueSnackbar: enqueueSnackbar,
          setterFunction: (data: any) => {
            set((state: any) => {
              return {
                notifications: data.data,
                isLoading: false,
              };
            });
          },
          domain: "Form Builder",
        });
        !apiResponse && set({ isLoading: false });
        apiResponse && navigate?.("/notification");
        return apiResponse;
      },

      updateNotification: async (
        templdateId: number,
        values: any,
        navigate: any,
        enqueueSnackbar: any,
      ) => {
        const response = await putAPI(`notification-message/${templdateId}`, values);
        if (response) {
          navigate("/notification");
          enqueueSnackbar?.(
            response?.data?.message ? response?.data?.message : "Data Created Successfully",
            {
              variant: "success",
            },
          );
          return true;
        }
        set((state: any) => {
          state.notifications = response.data;
        });
      },

      getNotification: async (notificationId: any) => {
        set((state: any) => {
          state.isLoading = true;
        });
        const response = await getAPI(`notification-message/${notificationId}`);
        set((state: any) => {
          if (response) {
            state.notification = response.data;
            state.isLoading = false;
          }
        });
      },
      getNotifications: async () => {
        set((state: any) => {
          state.isLoading = true;
        });
        const response = await getAPI(`notification-message/?q=&archived=false`);
        set((state: any) => {
          if (response) {
            state.notifications = response.data;
            state.isLoading = false;
          }
        });
      },
    })),
  ),
);
