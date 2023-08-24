import { useAuthStore } from "src/store/zustand/globalStates/auth";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import jwtDecode from "jwt-decode";
import { url } from "src/utils/url";
import { v4 as uuidv4 } from "uuid";
import create from "zustand";

import { fetchApI, postApiData, putApiData } from "src/modules/apiRequest/apiRequest";

const useAppStore = create((set) => {
  const { setAuthenticated } = useAuthStore.getState();
  // const layoutStore = useLayoutStore((state) => state);
  const { setUserData } = userDataStore.getState();
  // const { setPermissions } = usePermissionStore();

  return {
    user: {},
    individual_user: {},
    refresh_token: "",
    access_token: "",
    loading: false,
    systemParameters: {},
    userSecurity: {},
    error: {},
    sidebarData: [],

    setError: (data: any) => {
      set({ loading: false, error: data });
    },

    // multiple response data
    fetchUser: async ({ query, key = "user" }: any) => {
      set({ loading: true });
      const apiResponse = await fetchApI({
        url: "multiple-response/",
        setterFunction: (data: any) => {
          set({ key: data, loading: false });
        },
      });
      !apiResponse && set({ loading: false });
      return apiResponse;
    },

    updateUser: async ({ values, id, updateState, enqueueSnackbar, otherDatas }: any) => {
      set({ loading: true });
      return await putApiData({
        values: values,
        id,
        url: url?.profile,
        getAll: true,
        // setterLoading: setLoading,
        enqueueSnackbar: enqueueSnackbar,
        setterFunction: (data: any) => {
          updateState?.(data);
          console.log({ data });
          set((state: any) => {
            return {
              loading: false,
              user: {
                ...(otherDatas || {}),
                billing_plan: values?.billing_plan,
                ...(values?.profile || {}),
                ...(values?.profile_format || {}),
              },
            };
          });
        },
      });
    },

    createUser: async ({ values, id, updateState, enqueueSnackbar }: any) => {
      set({ loading: true });
      const apiResponse = await postApiData({
        values: values,
        url: "/multiple-response/",
        // setterLoading: setLoading,
        enqueueSnackbar: enqueueSnackbar,
        setterFunction: (data: any) => {
          updateState?.(data);
          set((state: any) => {
            return {
              user: { ...data?.data },
              loading: false,
            };
          });
        },
        domain: "Multiple Response",
      });
      !apiResponse && set({ loading: false });
      return apiResponse;
    },

    sendResetPassword: async ({ values, enqueueSnackbar }: any) => {
      set({ loading: true });
      const apiResponse = await postApiData({
        values: values,
        url: url.FORGOT_PASSWORD,
        enqueueSnackbar: enqueueSnackbar,
        setterFunction: (data: any) => {},
        domain: "Password Reset",
      });
      !apiResponse && set({ loading: false });
      return apiResponse;
    },

    fetchSystemParameters: async ({ query }: any) => {
      set({ loading: true });
      const apiResponse = await fetchApI({
        url: url?.systemParameters + "/",
        setterFunction: (data: any) => {
          set({ systemParameters: data, loading: false });
        },
        getAll: true,
      });
      !apiResponse && set({ loading: false });
      return apiResponse;
    },

    fetchSystemSecurity: async ({ query }: any) => {
      set({ loading: true });
      const apiResponse = await fetchApI({
        url: url?.userSecurity + "/",
        setterFunction: (data: any) => {
          set({ userSecurity: data, loading: false });
        },
        getAll: true,
      });
      !apiResponse && set({ loading: false });
      return apiResponse;
    },

    postSystemParameters: async ({ values, id, updateState, enqueueSnackbar }: any) => {
      set({ loading: true });
      const apiResponse = await postApiData({
        values: values,
        url: "/" + url?.systemParameters + "/",
        // setterLoading: setLoading,
        enqueueSnackbar: enqueueSnackbar,
        setterFunction: (data: any) => {
          set((state: any) => {
            return {
              systemParameters: values,
              loading: false,
            };
          });
        },
      });
      !apiResponse && set({ loading: false });
      return apiResponse;
    },

    loginInUser: async ({
      query,
      enqueueSnackbar,
      values,
      navigate,
      URL = url?.AUTH_LOGIN || "",
      type = "login",
    }: any) => {
      set({ loading: true });
      const apiResponse = await postApiData({
        values: values,
        url: URL,
        enqueueSnackbar: enqueueSnackbar,
        setterFunction: (data: any) => {
          console.log("here");
          let { access_token, refresh_token, user_id } = data;
          set({ loading: false, access_token, refresh_token, error: {} });
          let {
            role,
            user_name,
            client_id,
            two_factor_authentication,
            profile_picture,
            id: uid,
          }: any = jwtDecode(access_token);
          setUserData({
            userType: role,
            userName: user_name,
            clientId: client_id,
            token: access_token,
            refresh_token: refresh_token,
            profilePicture: profile_picture,
          });
          if (type === "login") {
            if (two_factor_authentication === true && type) {
              localStorage.setItem("access", access_token);
              navigate("/otp");
            } else {
              setAuthenticated(true);
              navigate("/");
              localStorage.setItem("access", access_token);
              localStorage.setItem("refresh", refresh_token);
              localStorage.setItem("user_id", user_id);
              localStorage.setItem("uid", uid);
              const sid = uuidv4?.toString().substring(0, 10);
              localStorage.setItem("speechID", sid);
            }
          }

          // if (remember && remember[0] === 'on') {
          //   setTimeout(() => {
          //     localStorage.removeItem('access');
          //     localStorage.removeItem('refresh');
          //     localStorage.removeItem('user_id');
          //   }, 30 * 24 * 60 * 60 * 1000);
          // } else {
          // }
          // window.location.reload();
        },
        getError: (err: any) => {
          err && set({ loading: false, error: err });
        },
        domain: "",
      });

      !apiResponse && set({ loading: false });
      return apiResponse;
    },

    refreshTokenApi: async ({
      query,
      enqueueSnackbar,
      navigate,
      URL = url?.AUTH_LOGIN || "",
      type = "login",
    }: any) => {
      set({ loading: true });
      const apiResponse = await fetchApI({
        url: URL,
        enqueueSnackbar: enqueueSnackbar,
        getAll: true,
        setterFunction: (data: any) => {
          let { access_token, refresh_token, user_id } = data;
          set({ loading: false, access_token, refresh_token });
          let {
            role,
            user_name,
            client_id,
            two_factor_authentication,
            profile_picture,
            id: uid,
          }: any = jwtDecode(access_token);
          setUserData({
            userType: role,
            userName: user_name,
            clientId: client_id,
            token: access_token,
            refresh_token: refresh_token,
            profilePicture: profile_picture,
          });

          setAuthenticated(true);
          // navigate('/');
          localStorage.setItem("access", access_token);
          localStorage.setItem("refresh", refresh_token);
          localStorage.setItem("user_id", user_id);
          localStorage.setItem("uid", uid);
        },
      });
      !apiResponse && set({ loading: false });
      return apiResponse;
    },

    logoutUser: async ({ query, enqueueSnackbar }: any) => {
      set({ loading: true });
      const apiResponse = await fetchApI({
        url: url?.logout,
        getAll: true,
        setterFunction: (data: any) => {
          set({ user: {}, token: undefined, loading: false });
        },
        enqueueSnackbar,
      });
      !apiResponse && set({ loading: false });
      return apiResponse;
    },

    fetchProfile: async ({ enqueueSnackbar }: any) => {
      set({ loading: true });
      const apiResponse = await fetchApI({
        url: url?.profile,
        getAll: true,
        setterFunction: (data: any) => {
          set({ user: data, loading: false });
        },
        enqueueSnackbar,
      });
      !apiResponse && set({ loading: false });
      return apiResponse;
    },

    setSidebarData: async ({ values, enqueSnackbar }: any) => {
      set({ loading: false, sidebarData: values });
    },

    getSidebarData: async ({ enqueSnackbar }: any) => {
      set({ loading: true });
      const apiResponse = await fetchApI({
        url: url?.profile,
        getAll: true,
        setterFunction: (data: any) => {
          set({ user: data, loading: false });
        },
        enqueSnackbar,
      });
      !apiResponse && set({ loading: false });
      return apiResponse;
    },

    updateSidebarData: async ({ values, enqueSnackbar }: any) => {
      set({ loading: true });
      const apiResponse = await fetchApI({
        url: url?.profile,
        getAll: true,
        setterFunction: (data: any) => {
          set({ user: data, loading: false });
        },
        enqueSnackbar,
      });
      !apiResponse && set({ loading: false });
      return apiResponse;
    },
  };
});

export default useAppStore;
