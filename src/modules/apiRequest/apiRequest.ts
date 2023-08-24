import { NavigateFunction } from "react-router-dom";
import { deleteAPI, getAPI, getExternalAPI, patchAPI, postAPI, putAPI } from "src/lib/axios";
import { queryMaker } from "src/utils/keyFunction";
// Define the type for the useNavigate hook
type UseNavigateType = (url: any) => NavigateFunction;

interface CommonFetchInterface {
  setterFunction?: Function;
  values?: any;
  url?: string;
  enqueueSnackbar?: any;
  queryParam?: any;
  requireLabel?: any;
  setterLoading?: any;
  getAll?: boolean;
  replace?: boolean;
  toastMessage?: string;
  token?: string;
}

interface postInterface extends CommonFetchInterface {
  setterLoading?: Function;
  navigateTo?: Function;
  domain?: string;
  id?: any;
  message?: string;
  routeKey?: string;
  customApiUrl?: string;
  getError?: Function;
}

type FetchIndividualProps = {
  id: number;
  setterFunction?: Function;
  url?: string;
  enqueueSnackbar?: any;
  setterLoading?: Function;
  domain?: string;
  queryParam?: string;
};

export const setErrorNotification = (error: any, enqueueSnackbar: any, getError?: Function) => {
  const {
    response: {
      data: { detail },
    },
  } = error || { response: { data: { detail: "" } } };
  getError?.(detail);
  enqueueSnackbar?.(
    (detail?.message && detail?.message) || "Something went wrong!!. Please try again later",
    {
      variant: "error",
    },
  );
};

export const fetchApI = async ({
  setterFunction,
  values,
  url,
  enqueueSnackbar,
  queryParam,
  requireLabel = false,
  setterLoading = () => {},
  getAll = false,
  replace = false,
  toastMessage,
  token,
}: CommonFetchInterface) => {
  try {
    const isQueryObject = queryParam instanceof Object ? true : false;
    if (!url) return;

    const { status, data } = await getAPI(
      `${queryParam ? `${url}?${isQueryObject ? queryMaker(queryParam) : queryParam}` : url}`,
      "",
      replace,
      enqueueSnackbar,
      token,
    );

    setterLoading?.(true);
    if (status === 200) {
      if (!getAll) {
        if (data?.length) {
          setterFunction?.(data);
          setterLoading?.(false);
        } else if (data?.items) {
          if (url?.includes("organization-service")) {
            const newData = data?.items?.map((item: any) => ({
              id: item?.id,
              value: item?.name,
              label: item?.name,
            }));
            setterFunction?.(newData);
            return;
          }

          setterFunction?.(data?.items);

          if (requireLabel) {
            const newData = data?.items?.map((item: any) => ({
              id: item?.id,
              value: item?.name,
              label: item?.name,
            }));
            setterFunction?.(newData);
          }
        }
      } else {
        setterFunction?.(data);
      }
      setterLoading?.(false);
      if (data?.message) {
        enqueueSnackbar?.(data?.message || "Data Successfully fetched", { variant: "success" });
      } else if (toastMessage) {
        enqueueSnackbar?.(toastMessage, { variant: "success" });
      }
      return true;
    }
  } catch (error: any) {
    if (enqueueSnackbar) {
      setErrorNotification(error, enqueueSnackbar);
    }
    setterLoading?.(false);
    return false;
  }
};
export const fetchExternalApI = async ({
  setterFunction,
  values,
  url,
  enqueueSnackbar,
  queryParam,
  requireLabel = false,
  setterLoading,
  getAll = false,
  host,
  api_token,
  replace = false,
}: any) => {
  try {
    const { status, data } = await getExternalAPI({
      host: host,
      url: url,
      api_token: api_token,
      replace,
    });
    setterLoading?.(true);
    if (status === 200) {
      setterFunction?.(data);
      setterLoading?.(false);

      setterLoading?.(false);
      if (data?.message) {
        enqueueSnackbar?.(data?.message, { variant: "success" });
      }
      return true;
    }
  } catch (error: any) {
    if (enqueueSnackbar) {
      setErrorNotification(error, enqueueSnackbar);
    }
    setterLoading?.(false);
    return false;
  }
};

export const fetchIndividualApi = async ({
  id,
  setterFunction,
  enqueueSnackbar,
  url,
  setterLoading,
  domain,
  queryParam,
  customApiUrl,
  token,
}: any) => {
  try {
    if (id) {
      setterLoading?.(true);
      const isQueryObject = queryParam instanceof Object ? true : false;
      const { status, data } = await getAPI(
        `${
          queryParam
            ? customApiUrl
              ? `${url}&?${isQueryObject ? queryMaker(queryParam) : queryParam}`
              : `${url}/${id}?${isQueryObject ? queryMaker(queryParam) : queryParam}`
            : customApiUrl
            ? `${url}`
            : `${url}/${id}`
        }`,
        undefined,
        undefined,
        enqueueSnackbar,
        token,
      );
      if (status === 200) {
        setterFunction?.(data);
        enqueueSnackbar?.(`Data successfully fetched`, { variant: "success" });
        return true;
      }
      setterLoading?.(false);
      return true;
    }
  } catch (error: any) {
    setterLoading?.(false);
    if (enqueueSnackbar) {
      setErrorNotification(error, enqueueSnackbar);
    }
    return false;
  }
};

// post api

export const postApiData = async ({
  setterFunction,
  setterLoading,
  values,
  url,
  enqueueSnackbar,
  queryParam,
  navigateTo,
  domain,
  message,
  routeKey = "contractor",
  getError,
}: postInterface) => {
  try {
    setterLoading?.(true);
    const { status, data } = await postAPI(`${queryParam ? `${url}?${queryParam}` : url}`, values);
    if (status === 200) {
      enqueueSnackbar?.(data?.message ? data?.message : "Data Created Successfully", {
        variant: "success",
      });
      if (data?.length) {
        setterFunction?.(data);
        setterLoading?.(false);
        return false;
      } else if (data?.items) {
        setterFunction?.(data?.items);
        setterLoading?.(false);
        return false;
      } else {
        setterFunction?.(data);
        setterLoading?.(false);
        if (navigateTo) {
          data?.[`${routeKey}`] && navigateTo?.(data?.[`${routeKey}`]);
        }
        return true;
      }
    }
  } catch (error: any) {
    // if (enqueueSnackbar) {
    // }
    setErrorNotification(error, enqueueSnackbar, getError);
    setterLoading?.(false);
    return false;
  }
};

// put api
export const putApiData = async ({
  setterFunction,
  setterLoading,
  values,
  url,
  enqueueSnackbar,
  queryParam,
  navigateTo,
  domain,
  id,
  message,
  getAll,
}: postInterface) => {
  try {
    setterLoading?.(true);
    const { status, data } = !id
      ? await putAPI(`${url}`, values)
      : await putAPI(`${url}/${id}`, values);

    if (status >= 200) {
      if (data?.message) {
        enqueueSnackbar?.(`${data?.message}`, { variant: "success" });
      } else {
        enqueueSnackbar?.(`Data updated successfully`, {
          variant: "success",
        });
      }
      if (getAll) {
        setterFunction?.(data);
      } else if (data?.length) {
        setterFunction?.(data);
        setterLoading?.(false);
      } else if (data?.items) {
        if (url?.includes("organization-service")) {
          const newData = data?.items?.map((item: any) => ({
            id: item?.id,
            value: item?.name,
            label: item?.name,
          }));
          setterFunction?.(newData);
          setterLoading?.(false);
        } else {
          setterFunction?.(data?.items);
        }
      } else {
        setterFunction?.(data);
        setterLoading?.(false);
      }

      if (navigateTo) {
        navigateTo();
      }

      return true;
    }
  } catch (error: any) {
    setErrorNotification(error, enqueueSnackbar);
    setterLoading?.(false);
    return false;
  }
};

export const patchApiData = async ({
  setterFunction,
  setterLoading,
  values,
  url,
  enqueueSnackbar,
  queryParam,
  navigateTo,
  domain,
  id,
  customApiUrl,
  getAll = false,
}: postInterface) => {
  try {
    setterLoading?.(true);
    const isQueryObject = queryParam instanceof Object ? true : false;
    const { status, data } = await patchAPI(
      `${
        queryParam
          ? customApiUrl
            ? `${url}/${id}?&?${isQueryObject ? queryMaker(queryParam) : queryParam}`
            : `${url}/${id}?${isQueryObject ? queryMaker(queryParam) : queryParam}`
          : customApiUrl
          ? `${url}/${id}`
          : `${url}/${id}`
      }`,
      values,
    );

    // const { status, data } = await patchAPI(`${url}/${id}`, values);
    if (status === 200) {
      enqueueSnackbar?.(data?.message ? data?.message : `Data updated successfully`, {
        variant: "success",
      });
      if (getAll) {
        setterFunction?.(data);
        return true;
      }
      if (data?.length) {
        setterFunction?.(data);
        setterLoading?.(false);
      } else if (data?.items) {
        if (url?.includes("organization-service")) {
          const newData = data?.items?.map((item: any) => ({
            id: item?.id,
            value: item?.name,
            label: item?.name,
          }));
          setterFunction?.(newData);
          setterLoading?.(false);
        } else {
          setterFunction?.(data?.items);
        }
      } else {
        setterFunction?.(data);
        setterLoading?.(false);
      }

      if (navigateTo) {
        navigateTo();
      }

      return true;
    }
  } catch (error: any) {
    setErrorNotification(error, enqueueSnackbar);
    setterLoading?.(false);
    return false;
  }
};

export const deleteAPiData = async ({
  setterFunction,
  setterLoading,
  values,
  url,
  enqueueSnackbar,
  queryParam,
  navigateTo,
  domain,
  id,
  getAll,
}: postInterface) => {
  console.log({ url });
  try {
    setterLoading?.(true);
    const { status, data } = await deleteAPI(`${url}`, { config_ids: values });
    if (status === 200) {
      enqueueSnackbar?.(data?.message ? data?.message : `Data archived successfully`, {
        variant: "success",
      });
      if (getAll) {
        setterFunction?.({ ...data, status });
      } else if (data?.length) {
        setterFunction?.(data);
        setterLoading?.(false);
      } else if (data?.items) {
        if (url?.includes("organization-service")) {
          const newData = data?.items?.map((item: any) => ({
            id: item?.id,
            value: item?.name,
            label: item?.name,
          }));
          setterFunction?.(newData);
          setterLoading?.(false);
        } else {
          setterFunction?.(data?.items);
        }
      } else {
        setterFunction?.(data);
        setterLoading?.(false);
      }

      if (navigateTo) {
        navigateTo();
      }

      return true;
    }
  } catch (error: any) {
    setErrorNotification(error, enqueueSnackbar);
    setterLoading?.(false);
    return false;
  }
};

export const fetchTableData = async ({
  setData,
  setTotalCount,
  api,
  enqueueSnackbar,
  urlUtils,
  returnWholeData = false,
  queryParam,
  query,
}: any) => {
  const apiRequestResponse = await fetchApI({
    setterFunction: (data: any) => {
      setTotalCount(data.total);
      if (!returnWholeData) {
        setData?.((prev: any) => {
          return {
            ...prev,
            ...data,
            items: data.items,
            headers: data.headers,
            page: data.page,
            pages: data.pages,
            size: data.size,
            total: data.total,
            archivedCount: data?.info?.archived_count,
          };
        });
      } else {
        setData?.(data);
      }
    },
    getAll: true,
    url: `${api}/`,
    queryParam: queryMaker({ ...urlUtils, ...(query || {}) }),
    // queryParam: `${queryParam ? `${queryParam}&` : ''}q=${urlUtils?.q}&archived=${
    //   urlUtils?.archived
    // }&page=${urlUtils.page}&size=${urlUtils.size}&${urlUtils?.filterQuery}`,
    enqueueSnackbar: enqueueSnackbar,
  });
  if (!apiRequestResponse) {
    setData?.({
      items: [],
      headers: [],
      page: 1,
      pages: 1,
      size: 5,
      total: 0,
      archivedCount: 0,
    });
  }

  return apiRequestResponse;
};

export const restoreAPIData = async ({
  setterFunction,
  setterLoading,
  values,
  url,
  enqueueSnackbar,
  queryParam,
  navigateTo,
  domain,
  message,
}: postInterface) => {
  try {
    setterLoading?.(true);
    const { status, data } = await postAPI(`${queryParam ? `${url}?${queryParam}` : url}`, values);
    if (status === 200) {
      enqueueSnackbar?.(data?.message ? data?.message : "Data Created Successfully", {
        variant: "success",
      });
      if (data?.length) {
        setterFunction?.(data);
        setterLoading?.(false);
        return false;
      } else if (data?.items) {
        setterFunction?.(data?.items);
        setterLoading?.(false);
        return false;
      } else {
        setterFunction?.(data);
        setterLoading?.(false);
        if (navigateTo) {
          data?.contractor && navigateTo?.(data?.contractor);
          navigateTo();
        }
        return true;
      }
    }
  } catch (error: any) {
    if (enqueueSnackbar) {
      setErrorNotification(error, enqueueSnackbar);
    }
    setterLoading?.(false);
  }
};

// download sample
export const downloadSample = async (e: any, URL: any, enqueueSnackbar: any, fileName: any) => {
  e.preventDefault();
  const { status, data } = await getAPI(`${URL}`);
  if (status === 200) {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
  } else {
    enqueueSnackbar("Something went wrong", { variant: "error" });
  }
};
