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

const useTerriotryStore = create((set) => ({
  tableDatas: {
    items: [],
    headers: [],
    page: 1,
    pages: 1,
    size: 1,
    total: 0,
    archivedCount: 0,
  },
  terriotrys: [],
  individualTerriotry: {},
  loading: false,

  // multiple response data
  fetchTerriotrys: async ({ query, changeFormat, getAll, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await fetchApI({
      url: url?.terriotry + "/",
      queryParam: query,
      getAll,
      enqueueSnackbar,
      setterFunction: (data: any) => {
        set({
          terriotrys: getAll ? data?.items || [] : data || [],
          tableDatas: getAll ? { ...data, archivedCount: data?.info?.archived_count || 0 } : {},
          loading: false,
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  fetchIndividualTerriotry: async ({ id }: any) => {
    set({ loading: true });
    const apiResponse = await fetchIndividualApi({
      url: url?.terriotry,
      id: id,
      setterFunction: (data: any) => {
        set({ individualTerriotry: data, loading: false });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  updateTerriotryStore: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      id,
      url: url?.terriotry,
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          const filteredData = state?.terriotrys?.filter((data: any) => data?.id !== id);

          return {
            terriotrys: [{ ...data?.data }, ...filteredData],
            individualTerriotry: data?.data,
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  postTerriotry: async ({ values, id, updateState, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await postApiData({
      values: values,
      url: "/" + url?.terriotry + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        updateState?.(data);
        set((state: any) => {
          return {
            individualTerriotry: {},
            terriotrys: [...(data?.data || []), ...state.terriotrys],
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  removeTerriotry: async ({ values, enqueueSnackbar }: any) => {
    set({ loading: true });
    const apiResponse = await putApiData({
      values: values,
      url: url?.terriotry + "/",
      // setterLoading: setLoading,
      enqueueSnackbar: enqueueSnackbar,
      setterFunction: (data: any) => {
        set((state: any) => {
          const filteredData = state?.terriotrys?.filter(
            (data: any) => !values?.config_ids?.includes(data?.id),
          );

          return {
            terriotrys: filteredData,
            individualTerriotry: {},
            loading: false,
          };
        });
      },
    });
    !apiResponse && set({ loading: false });
    return apiResponse;
  },

  tableActionHandler: async ({ values, enqueueSnackbar, type, URL = url?.region }: any) => {
    set({ loading: true });
    let apiResponse = false;

    switch (type) {
      case ACTION_TYPE.DELETE:
        apiResponse = await deleteAPiData({
          values: values,
          url: url?.terriotry + "/",
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
                terriotrys: items,
              };
            });
          },
        });
        break;
      case ACTION_TYPE.RESTORE:
        apiResponse = await postApiData({
          values: values,
          url: `/${url?.region}/${url?.restore}`,
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
                terriotrys: updateData,
                individualTerriotry: {},
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
          url: `/${url?.terriotry}/${url?.duplicate}/${values?.id}`,
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
                terriotrys: updateData,
                individualTerriotry: {},
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

export default useTerriotryStore;
