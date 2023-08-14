import { fetchApI, fetchIndividualApi } from "src/modules/apiRequest/apiRequest";
import { url } from "src/utils/url";
import create from "zustand";

const useBillingPlanStore = create((set) => ({
  billingPlans: [],

  loading: false,

  fetchBillingPlans: async ({ query, changeFormat }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      url: url?.billingPlan + "/",
      setterFunction: (data: any) => {
        if (changeFormat) {
          set({ billingPlans: data, loading: false });
        } else {
          set({ billingPlans: data || [], loading: false });
        }
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  fetchIndividualBillingPlan: async ({ id }: any) => {
    set({ loading: true });
    const apiResponse = await fetchIndividualApi({
      url: url?.billingPlan,
      id: id,
      setterFunction: (data: any) => {
        set({ individualBookingId: data, loading: false });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  // deleteBillingPlan: async ({ values, enqueueSnackbar }: any) => {
  //   set({ loading: true });
  //   const apiResponse = await putApiData({
  //     values: values,
  //     url: url?.region + '/',
  //     // setterLoading: setLoading,
  //     enqueueSnackbar: enqueueSnackbar,
  //     setterFunction: (data: any) => {
  //       set((state: any) => {
  //         const filteredData = state?.regions?.filter(
  //           (data: any) => !values?.config_ids?.includes(data?.id),
  //         );

  //         return {
  //           regions: filteredData,
  //           individualRegion: {},
  //           loading: false,
  //         };
  //       });
  //     },
  //   });
  //   !apiResponse && set({ loading: false });
  //   return apiResponse;
  // },
}));

export default useBillingPlanStore;
