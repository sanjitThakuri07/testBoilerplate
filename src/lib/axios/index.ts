import useAppStore from "src/store/zustand/app ";
import axiosInstance from "./interceptor";

const baseURL = process.env.VITE_BASE_URL;
export const HOST_URL = process.env.VITE_HOST_URL;

const LocalData = localStorage.getItem("userdata");

// convert string to json
const jsonClientId = JSON.parse(LocalData || "{}");

// get clientId from json
const clientId = jsonClientId?.state?.clientId;

export interface ApiProps {
  headers: any;
}

export const APICONFIG = (token = "") => {
  const { access_token, refresh_token }: any = useAppStore.getState();
  return {
    headers: {
      Authorization: token
        ? `Bearer ${token}`
        : access_token
        ? `Bearer ${access_token}`
        : `Bearer ${localStorage.getItem("access")}` ?? null,
      Tenant: clientId,
      "Access-Control-Allow-Origin": "*",
    },
  };
};

let apiConfig: ApiProps = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access")}` ?? null,
    Tenant: clientId,
    "Access-Control-Allow-Origin": "*",
  },
};

export const postAPI = async (url: string, data: any): Promise<any> => {
  const { headers } = APICONFIG();
  return await axiosInstance({
    headers,
    method: "post",
    url: `${baseURL}${url}`,
    data,
  }).then((response) => {
    return {
      status: response.status,
      data: response.data,
    };
  });
};

export const postAPISpeech = async (url: string, data: any): Promise<any> => {
  const { headers } = APICONFIG();
  return await axiosInstance({
    headers,
    method: "post",
    url: `${process.env.VITE_HOST_URL}${url}`,
    data,
  }).then((response) => {
    return { data: response.data, status: response.status };
  });
};

export const putAPI = async (url: string, data: any): Promise<any> => {
  const { headers } = APICONFIG();
  return await axiosInstance({
    headers,
    method: "put",
    url: `${baseURL}/${url}`,
    data,
  }).then((response) => {
    return {
      status: response.status,
      data: response.data,
    };
  });
  // .catch(error => {
  //   return {
  //     status: error.status,
  //     data: error.response
  //   };
  // });
};

export const patchAPI = async (url: string, data: any): Promise<any> => {
  const { headers } = APICONFIG();
  return await axiosInstance({
    headers,
    method: "patch",
    url: `${baseURL}/${url}`,
    data,
  }).then((response) => {
    return {
      status: response.status,
      data: response.data,
    };
  });
  // .catch(error => {
  //   return {
  //     status: error.status,
  //     data: error.response
  //   };
  // });
};

export const getAPI = async (
  url: any,
  signal?: any,
  replace?: boolean,
  enqueueSnackbar?: any,
  token?: string,
): Promise<any> => {
  const { headers } = APICONFIG(token);
  let config: any = {
    headers: {
      Authorization: `Bearer ${token || localStorage.getItem("access")}` ?? null,
      Tenant: clientId,
      "Access-Control-Allow-Origin": "*",
    },
  };

  return await axiosInstance({
    headers: headers,
    method: "get",
    url: !replace ? `${baseURL}/${url}` : `${HOST_URL}${url}`,
  }).then((response) => {
    return {
      status: response.status,
      data: response.data,
    };
  });
  // .catch((error) => {
  //   enqueueSnackbar(error?.message, {
  //     variant: 'error',
  //   });
  // });
};

export const getExternalAPI = async ({ url, api_token, replace }: any): Promise<any> => {
  const { headers } = APICONFIG(api_token);
  const config = {
    headers: {
      Authorization: `Bearer ${api_token}` ?? null,
      Tenant: clientId,
      "Access-Control-Allow-Origin": "*",
    },
  };
  return await axiosInstance({
    headers,
    method: "get",
    url: !replace ? `${baseURL}/${url}` : `${url}`,
  }).then((response) => {
    return {
      status: response.status,
      data: response.data,
    };
  });
};

export const deleteAPI = async (url: string, data?: any): Promise<any> => {
  const { headers } = APICONFIG();
  return await axiosInstance({
    headers: data?.config_ids
      ? { ...headers, [`X-Custom-Token`]: data?.config_ids || [] }
      : headers,
    method: "delete",
    url: `${baseURL}/${url}`,
    data,
  }).then((response) => {
    return {
      status: response.status,
      data: response.data,
    };
  });
  // .catch(error => {
  //   return {
  //     status: error.status,
  //     data: error.response
  //   };
  // });
};

export const postAPIExternal = async (
  url: string,
  data: any,
  final_data_external: any,
): Promise<any> => {
  let config;
  if (final_data_external?.api_token) {
    config = {
      headers: {
        Authorization: `Bearer ${final_data_external?.api_token}` ?? null,
        Tenant: clientId,
        "Access-Control-Allow-Origin": "*",
      },
    };
  } else {
    const { headers } = APICONFIG();
    config = { headers };
  }
  return await axiosInstance({
    ...config,
    method: "get",
    url: `${url}`,
    data,
  }).then((response) => {
    return {
      status: response.status,
      data: response.data,
    };
  });
};

export const getAPIPublic = async (url: string, token?: string): Promise<any> => {
  let public_config = {
    headers: {
      Authorization: `Bearer ${token}` ?? null,
      "Access-Control-Allow-Origin": "*",
    },
  };

  return await axiosInstance({
    ...public_config,
    method: "get",
    url: `${process.env.VITE_HOST_URL}${url}`,
  }).then((response) => {
    return {
      status: response.status,
      data: response.data,
    };
  });
};
