import create from "zustand";
import {
  fetchApI,
  postApiData,
  putApiData,
  fetchExternalApI,
  deleteAPiData,
  fetchIndividualApi,
} from "src/modules/apiRequest/apiRequest";
import { url } from "src/utils/url";
import { queryMaker } from "src/utils/keyFunction";

const useNotificationConfigStore = create((set) => ({
  backendFields: [],
  individualNotification: {},
  notifications: [],
  loading: false,

  // multiple response data
  fetchBackendFields: async ({ query, tag, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      enqueueSnackbar,
      url: url?.getFieldList,
      setterFunction: (data: any) => {
        set({ backendFields: data || [], loading: false });
      },
      toastMessage: "Data successfully fetched",
      queryParam: queryMaker(query),
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },
}));

export default useNotificationConfigStore;
