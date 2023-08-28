import { NavigateFunction } from "react-router-dom";
import { getAPI, postAPI, putAPI } from "src/lib/axios";

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
  domain?: string;
  id?: number;
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
      if (data?.length && url?.includes("internal-response/field-list")) {
        const newData = data?.map((item: any) => ({
          display_name: "",
          module: item,
          status: 1,
        }));
        setterFunction?.(newData);
        return;
      } else if (data?.length && url?.includes("module/internal-response/")) {
        const filteredData = data.filter(
          (item: any) =>
            ![
              "FindingRecommendations",
              "FindingRecommendationSubCategory",
              "FindingRecommendationMainCategory",
              "Findings",
            ].includes(item.tag),
        );

        setterFunction?.(filteredData);
      } else if (data?.length) {
        setterFunction?.(data);
      }
    }
  } catch (error: any) {
    enqueueSnackbar(error?.response?.data?.message || "Something went wrong!", {
      variant: "error",
    });
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
      const { status, data } = await getAPI(`internal-response/${id}`);
      if (status === 200) {
        const table_values = {
          display_name: data?.name,
          name: data?.name,
          id: data?.id,
          module: data?.module_id,
          module_id: data?.module,
          variable_name: data?.field,
          status: data?.status,
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
      if (data?.length) {
        setterFunction?.(data);
        setterLoading?.(false);
        if (navigateTo) {
          navigateTo();
        }
        return false;
      } else {
        setterFunction?.(data);
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
      enqueueSnackbar(`${domain} data created succesfully`, { variant: "success" });
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
