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
import { ACTION_TYPE } from "../../actionType";

const useLocationStore = create((set) => ({
  tableDatas: {
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    archivedCount: 0,
  },
  locations: [],
  individualLocation: {},
  loading: false,

  // multiple response data
  fetchLocations: async ({ query, changeFormat, getAll }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      url: url?.location + "/",
      setterFunction: (data: any) => {
        set({
          locations: getAll ? data?.items || [] : data || [],
          tableDatas: getAll ? { ...data, archivedCount: data?.info?.archived_count || 0 } : {},
          loading: false,
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  fetchIndividualLocation: async ({ id }: any) => {
    set({ loading: true });
    const apiResponse = await fetchIndividualApi({
      url: url?.location,
      id: id,
      setterFunction: (data: any) => {
        set({ individualLocation: data, loading: false });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  updateLocationStore: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      id,
      url: url?.location,
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          const filteredData = state?.locations?.filter((data: any) => data?.id !== id);

          return {
            locations: [{ ...data?.data }, ...filteredData],
            individualLocation: data?.data,
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  postLocation: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await postApiData({
      values: values,
      url: "/" + url?.location + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          return {
            individualLocation: {},
            locations: [...(data?.data || []), ...state.locations],
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  removeLocation: async ({ values, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      url: url?.location + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        set((state: any) => {
          const filteredData = state?.locations?.filter(
            (data: any) => !values?.config_ids?.includes(data?.id),
          );

          return {
            locations: filteredData,
            individualLocation: {},
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  tableActionHandler: async ({ values, enqueueSnackbar, type, URL = url?.location }: any) => {
    set({ loading: true });
    let apiResponse = false;

    switch (type) {
      case ACTION_TYPE.DELETE:
        apiResponse = await deleteAPiData({
          values: values,
          url: url?.location + "/",
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
                locations: items,
              };
            });
          },
        });
        break;
      case ACTION_TYPE.RESTORE:
        apiResponse = await postApiData({
          values: values,
          url: `/${url?.location}/${url?.restore}`,
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
                locations: updateData,
                individualRegion: {},
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
          url: `/${url?.location}/${url?.duplicate}/${values?.id}`,
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
                locations: updateData,
                individualLocation: {},
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

export default useLocationStore;
