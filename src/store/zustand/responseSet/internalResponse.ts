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
import { ActionType, ACTION_TYPE } from "src/store/zustand/actionType/index";

const useInternalStore = create((set) => ({
  tableDatas: {
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    archivedCount: 0,
  },
  internals: [],
  individualInternal: {},
  loading: false,

  // multiple response data
  fetchInternals: async ({ query, changeFormat, getAll = false, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      url: url?.internal + "/",
      setterFunction: (data: any) => {
        set({
          internals: getAll ? data?.items || [] : data || [],
          tableDatas: getAll ? { ...data, archivedCount: data?.info?.archived_count || 0 } : {},
          loading: false,
        });
      },
      getAll,
      queryParam: query,
      enqueueSnackbar,
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  fetchIndividualInternal: async ({ id }: any) => {
    set({ loading: true });
    const apiResponse = await fetchIndividualApi({
      url: url?.internal,
      id: id,
      setterFunction: (data: any) => {
        set({ individualInternal: data, loading: false });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  updateInternalStore: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      id,
      url: url?.internal,
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          const filteredData = state?.internals?.filter((data: any) => data?.id !== id);

          return {
            internals: [{ ...data?.data }, ...filteredData],
            individualInternal: data?.data,
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  postInternal: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await postApiData({
      values: values,
      url: "/" + url?.internal + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          return {
            individualInternal: {},
            internals: [...(data?.data || []), ...state.internals],
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  removeInternal: async ({ values, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      url: url?.internal + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        set((state: any) => {
          const filteredData = state?.internals?.filter(
            (data: any) => !values?.config_ids?.includes(data?.id),
          );

          return {
            internals: filteredData,
            individualInternal: {},
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  tableActionHandler: async ({ values, enqueueSnackbar, type, URL = url?.internal }: any) => {
    set({ loading: true });
    let apiResponse = false;

    switch (type) {
      case ACTION_TYPE.DELETE:
        apiResponse = await deleteAPiData({
          values: values,
          url: url?.internal + "/",
          // setterLoading: setLoading,
          enqueueSnackbar: enqueueSnackbar,
          getAll: true,
          setterFunction: (data: any) => {
            set((state: any) => {
              let tableDatas = state.tableDatas || {};
              let items = tableDatas?.items?.filter((data: any) => !values?.includes(data?.id));
              return {
                loading: false,
                tableDatas: {
                  ...(tableDatas || {}),
                  archivedCount: tableDatas?.archivedCount + values?.length || 0,
                  items,
                },
                internals: items,
              };
            });
          },
        });
        break;
      case ACTION_TYPE.RESTORE:
        apiResponse = await postApiData({
          values: values,
          url: `/${url?.internal}/${url?.restore}`,
          // setterLoading: setLoading,
          enqueueSnackbar: enqueueSnackbar,
          setterFunction: (data: any) => {
            set((state: any) => {
              console.log({ data });
              const updateData = state?.tableDatas?.items?.filter(
                (data: any) => !values?.includes(data?.id),
              );
              const updatedTableData = {
                ...(state.tableDatas || {}),
                items: updateData,
                archivedCount: state.tableDatas?.archivedCount - values?.length || 0,
              };

              return {
                internals: updateData,
                individualInternal: {},
                tableDatas: updatedTableData,
                loading: false,
              };
            });
          },
        });
        break;
      case ACTION_TYPE.DUPLICATE:
        apiResponse = await postApiData({
          values: values,
          url: `/${url?.internal}/${url?.duplicate}/${values?.id}`,
          // setterLoading: setLoading,
          enqueueSnackbar: enqueueSnackbar,
          setterFunction: (data: any) => {
            set((state: any) => {
              console.log({ data });
              const updateData = [...(data?.data || []), ...(state?.tableDatas?.items || [])];
              const updatedTableData = {
                ...(state.tableDatas || {}),
                items: updateData,
                archivedCount: state.tableDatas?.archivedCount - values?.length || 0,
              };

              return {
                internals: updateData,
                individualInternal: {},
                tableDatas: updatedTableData,
                loading: false,
              };
            });
          },
        });
        break;
      default:
        break;
    }

    !apiResponse && set({ loading: false });
    return apiResponse;
  },
}));

export default useInternalStore;
