import { NavigateFunction } from "react-router-dom";
import { getAPI, postAPI, postAPIExternal, putAPI } from "src/lib/axios";

// Define the type for the useNavigate hook
type UseNavigateType = (url: any) => NavigateFunction;

interface CommonFetchInterface {
  setterFunction?: Function;
  values?: any;
  url?: string;
  enqueueSnackbar?: any;
  queryParam?: any;
}

interface postInterface extends CommonFetchInterface {
  setterLoading?: Function;
  navigateTo?: Function;
  domain: string;
  id?: number;
}

interface externalPostInterface extends CommonFetchInterface {
  setterLoading?: Function;
  navigateTo?: Function;
  id?: number;
}

interface autheticatePostInterface extends CommonFetchInterface {
  setterLoading?: Function;
  navigateTo?: Function;
  id?: number;
  setAPIID?: Function;
  final_data_external?: any;
  setIsFormLoading?: Function;
  initial?: any;
  setter?: Function;
}

type FetchIndividualProps = {
  id: number;
  setInitialValues: Function;
  url?: string;
  enqueueSnackbar?: any;
};

export const fetchApI = async ({
  setterFunction,
  values,
  url,
  enqueueSnackbar,
  queryParam,
}: CommonFetchInterface) => {
  try {
    const { status, data } = await getAPI(`${queryParam ? `${url}?${queryParam}` : url}`);
    if (status === 200) {
      if (data?.length && url?.includes("external-response/field-list")) {
        const newData = data?.map((item: any) => ({
          display_name: "",
          module: item,
          status: 1,
        }));
        setterFunction?.(newData);
        return;
      } else if (data?.length) {
        setterFunction?.(data);
      }
    }
  } catch (error: any) {
    enqueueSnackbar(error?.response?.data?.message || "Something went wrong!", {
      variant: "error",
    });
    // setLoading(false);
  }
};

export const fetchInitialValues = async ({
  id,
  setInitialValues,
  enqueueSnackbar,
  url,
}: FetchIndividualProps) => {
  try {
    if (id) {
      const { status, data } = await getAPI(`external-api/${id}`);
      if (status === 200) {
        const table_values = {
          api: data?.api,
          api_token: data?.api_token,
          api_id: data?.id,
          display_name: data?.name,
          status: data?.status,
          tableValues: [
            {
              field: data?.field,
              name: data?.name,
              // id:data?.id,
              status: data?.status,
            },
          ],
        };
        // const module= data?.module_id
        // const dat = {module:module, tableValues:table_values}
        setInitialValues(table_values);
      }
    }
  } catch (error: any) {
    enqueueSnackbar(error?.response?.data?.message || "Something went wrong!", {
      variant: "error",
    });
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
}: postInterface) => {
  try {
    setterLoading?.(true);
    const { status, data } = await postAPI(`${queryParam ? `${url}?${queryParam}` : url}`, values);
    if (status === 200) {
      enqueueSnackbar(`${domain} data created succesfully`, { variant: "success" });
      if (data?.data?.api_token) {
        setterFunction?.(data?.data?.id);
        setterLoading?.(false);
        if (navigateTo) {
          data?.globalResponseSet && navigateTo?.(data?.globalResponseSet);
        }
        return true;
      } else {
        setterFunction?.(data?.data?.id);
        setterLoading?.(false);
        if (navigateTo) {
          navigateTo();
        }
        return true;
      }
    }
  } catch (error: any) {
    const {
      response: { data: detail },
    } = error;

    enqueueSnackbar(
      domain + " - " + (detail?.detail?.message ? detail?.detail?.message : error?.message) ||
        "Error on creating " + domain + " details",
      {
        variant: "error",
      },
    );

    setterLoading?.(false);
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
}: postInterface) => {
  try {
    setterLoading?.(true);
    const { status, data } = await putAPI(`${url}/${id}`, values);
    if (status === 200) {
      enqueueSnackbar(`${domain} data updated successfully`, { variant: "success" });
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
    const {
      response: { data: detail },
    } = error;

    enqueueSnackbar(
      domain + " - " + (detail?.detail?.message ? detail?.detail?.message : error?.message) ||
        "Error on creating " + domain + " details",
      {
        variant: "error",
      },
    );
    setterLoading?.(false);

    return false;
  }
};

// external

export const authenticate_data = async ({
  setterFunction,
  setterLoading,
  values,
  url,
  enqueueSnackbar,
  queryParam,
  navigateTo,
  setAPIID,
  final_data_external,
  initial,
  setter,
  id,
}: autheticatePostInterface) => {
  console.log(final_data_external);
  try {
    setterLoading?.(true);
    const { status, data } = await postAPIExternal(
      `${queryParam ? `${url}?${queryParam}` : url}`,
      values,
      final_data_external,
    );
    if (status === 200) {
      enqueueSnackbar(`Data authenticated successfully`, { variant: "success" });
      if (data?.data) {
        setterFunction?.(
          data?.data?.map((name: any) => {
            return {
              field: name,
              name: "",
              status: "Active",
            };
          }),
        );
        if (!id) {
          let res = await postApiData({
            setterFunction: setAPIID,
            values: final_data_external,
            url: "/external-api/",
            enqueueSnackbar: enqueueSnackbar,
            domain: "GlobalResponseSet",
            setterLoading: setterLoading,
          });
        }
        setter?.({ ...initial });

        setterLoading?.(false);
        return false;
      } else if (data?.items) {
        setterFunction?.(data?.items);
        setterLoading?.(false);
        return false;
      } else {
        setterFunction?.(data);
        setterLoading?.(false);
        if (!id) {
          let res = await postApiData({
            setterFunction: setAPIID,
            values: final_data_external,
            url: "/external-api/",
            enqueueSnackbar: enqueueSnackbar,
            domain: "GlobalResponseSet",
            setterLoading: setterLoading,
          });
        }
        setter?.({ ...initial });

        setterLoading?.(false);
        return false;
      }
    }
    setterLoading?.(false);
  } catch (error: any) {
    setterLoading?.(false);
    enqueueSnackbar("Error on authenticating data ", {
      variant: "error",
    });
    setterLoading?.(false);
  }
  setterLoading?.(false);
};
