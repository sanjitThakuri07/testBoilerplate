import create from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { deleteAPI, getAPI, postAPI, putAPI } from "src/lib/axios";
import { parseQueryParams } from "utils/queryParams";
import { current } from "immer";

export const useBookingTemplateAccessStore = create<any>(
  devtools(
    immer((set) => ({
      bookingTemplateAccesss: [],
      bookingTemplateAccess: undefined,
      isLoading: false,
      bookingTemplateAccesssMedia: [],

      postBookingTemplateAccess: async ({ values, userRoles }: any) => {
        set((state: any) => {
          state.isLoading = true;
        });
        try {
          const response = await postAPI("/booking_access/", values);
          const responseResult = response?.data?.data?.map((da: any) =>
            da.inspection_groups || da.report_groups
              ? {
                  ...da,
                  inspection_groups: da.inspection_groups
                    ? userRoles?.items?.find(
                        (userRole: any) => userRole.id === da.inspection_groups,
                      )
                    : null,
                  report_groups: da.report_groups
                    ? userRoles?.items?.find((userRole: any) => userRole.id === da.report_groups)
                    : null,
                }
              : { ...da },
          );

          if (response) {
            set((state: any) => {
              const currentState = current(state);
              state.bookingTemplateAccess = {
                ...state.bookingTemplateAccess,
                items: [...currentState.bookingTemplateAccess.items, { ...responseResult?.[0] }],
              };

              state.isLoading = false;
            });
            return true;
          }
        } catch (err) {
          console.log(err);
          set((state: any) => {
            state.isLoading = false;
          });
        }
      },

      updateBookingTemplateAccess: async ({
        templateAccessId,
        values,
        userRoles,
        organizationUsers,
      }: any) => {
        set((state: any) => {
          state.isLoading = true;
        });
        try {
          const response = await putAPI(`booking_access/${templateAccessId}`, values);
          const responseResult = { ...response?.data?.data };

          if (responseResult?.inspection_groups) {
            responseResult.inspection_groups = userRoles?.items?.find(
              (userRole: any) => userRole.id === responseResult?.inspection_groups,
            );
          }
          if (responseResult?.report_groups) {
            responseResult.report_groups = userRoles?.items?.find(
              (userRole: any) => userRole.id === responseResult?.report_groups,
            );
          }
          if (responseResult?.inspection_users.length) {
            responseResult.inspection_users = organizationUsers?.items?.filter((user: any) =>
              responseResult?.inspection_users?.some((userId: any) => userId === user?.user_id),
            );
          }
          if (responseResult?.report_users.length) {
            responseResult.report_users = organizationUsers?.items?.filter((user: any) =>
              responseResult?.report_users?.some((userId: any) => userId === user?.user_id),
            );
          }

          if (response) {
            set((state: any) => {
              const currentState = current(state);
              const oldData = currentState.bookingTemplateAccess.items.find(
                (item: any) => item.id === templateAccessId,
              );
              const indexOfOldData = currentState.bookingTemplateAccess.items.indexOf(oldData);
              const newData = {
                ...oldData,
                ...responseResult,
              };
              const excludedData = [
                ...currentState.bookingTemplateAccess.items.filter((item: any) => item !== oldData),
              ];

              state.bookingTemplateAccess = {
                ...state.bookingTemplateAccess,
                items: [
                  ...excludedData.slice(0, indexOfOldData),
                  newData,
                  ...excludedData.slice(indexOfOldData),
                ],
              };
              state.isLoading = false;
            });
            return true;
          }
        } catch (err) {
          console.log(err);
          set((state: any) => {
            state.isLoading = false;
          });
        }
      },

      getBookingTemplateAccess: async (templateAccessId: any) => {
        set((state: any) => {
          state.isLoading = true;
        });
        const response = await getAPI(`booking_access/${templateAccessId}`);
        set((state: any) => {
          if (response) {
            state.bookingTemplateAccess = response.data;
            state.isLoading = false;
          }
        });
      },

      getBookingTemplateAccesss: async ({ query = {} }) => {
        set((state: any) => {
          state.isLoading = true;
        });
        const response = await getAPI(`booking_access/${parseQueryParams(query)}`);
        set((state: any) => {
          if (response) {
            state.bookingTemplateAccess = response.data;
            state.isLoading = false;
          }
        });
      },
      deleteBookingTemplateAccess: async (templateAccessIds: any, enqueueSnackbar?: any) => {
        try {
          const response = await deleteAPI("booking_access/", {
            config_ids: templateAccessIds,
          });

          set((state: any) => {
            if (response) {
              const currentState = current(state);
              state.bookingTemplateAccess = {
                ...state.bookingTemplateAccess,
                items: currentState.bookingTemplateAccess.items.filter(
                  (item: any) => !templateAccessIds.includes(item.id),
                ),
              };
            }
          });
        } catch (err) {
          console.log(err);
        }
      },
    })),
  ),
);
