import React, { useState } from "react";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import SaveIcon from "/src/assets/icons/save_icon.svg";
import { useAuthStore } from "src/store/zustand/globalStates/auth";
import { useLayoutStore } from "src/store/zustand/globalStates/layout";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { getAPI } from "src/lib/axios";
import { usePermissionStore } from "src/store/zustand/permission";
import { url } from "src/utils/url";
import useAppStore from "src/store/zustand/app";
const ExpiryPopup = () => {
  const [openModal, setOpenModal] = useState(true);
  const authStore = useAuthStore((state) => state);
  const layoutStore = useLayoutStore((state) => state);
  const userData = userDataStore((state) => state);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const { setPermissions } = usePermissionStore();

  const { userType, setUserData, token, refresh_token, clientId, timezone } = userDataStore() || {};

  const {
    loginInUser,
    refreshTokenApi,
    logoutUser,
    refresh_token: RefreshToken,
    access_token,
  }: any = useAppStore();

  const handleConfirm = async () => {
    // getAPI(`user/auth/refresh_token/${userData.refresh_token}`)
    //   .then((res: { data: any; status: any }) => {
    //     if (res.status === 200) {
    //       let { access_token, refresh_token, user_id, userName, profilePicture } = res?.data;
    //       localStorage.setItem('access', access_token);
    //       localStorage.setItem('refresh', refresh_token);
    //       localStorage.setItem('user_id', user_id);
    //       setAuthenticated(true);
    //       let { role, user_name, client_id }: any = jwtDecode(access_token);
    //       userData.setUserData({
    //         userType: role,
    //         userName: user_name,
    //         clientId: client_id,
    //         token: access_token,
    //         refresh_token: refresh_token,
    //       });

    //       // setUserData({
    //       //   token: access_token,
    //       //   refresh_token: refresh_token,
    //       //   userType,
    //       //   clientId,
    //       //   timezone,
    //       //   userName,
    //       //   profilePicture,
    //       // });

    //       //   actions.resetForm();
    //     } else {
    //       console.log(res);
    //     }
    //   })
    //   .catch((err) => {
    //     if (err.response.status === 401) {
    //       handleReject();
    //     }
    //   });
    await refreshTokenApi({ type: "refresh", URL: url?.refreshTokenUrl(userData.refresh_token) });
  };

  const handleReject = async () => {
    await refreshTokenApi({ type: "refresh", URL: url?.refreshTokenUrl(userData.refresh_token) });
    const apiResponse = await logoutUser({});
    if (apiResponse) {
      authStore.setAuthenticated(false);
      layoutStore.clearLayoutValues();
      userData.clearUserData();
      localStorage.clear();
      setPermissions();
    }
  };
  return (
    <div>
      {" "}
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={handleReject}
        confirmationIcon={SaveIcon}
        handelConfirmation={handleConfirm}
        confirmationHeading={"Session Expire Warning"}
        confirmationDesc={
          "Your session is about to expire due to inactivity. Do you need to extend this session?"
        }
        status={"Normal"}
        IsSingleBtn={false}
      />
    </div>
  );
};

export default ExpiryPopup;
