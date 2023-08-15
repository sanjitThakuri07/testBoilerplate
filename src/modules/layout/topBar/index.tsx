/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Button, Grid, Skeleton } from "@mui/material";
// import Button from 'src/components/buttons'
import React from "react";
import { useNavigate } from "react-router-dom";
// import { useLayoutStore } from 'src/zustand/globalStates/layout'
import ActiveUserCardComponent from "src/modules/layout/topBar/components/activeUserCard";
import NotificatonMenuComponent from "src/modules/layout/topBar/components/notifications";

import { loggedUserDataStore } from "src/store/zustand/globalStates/loggedUserData";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import { usePermissionStore } from "src/store/zustand/permission";
import BASLogo from "src/assets/icons/logo.png";
import Logo from "src/assets/images/logo.svg";

interface ReactNodeProps {
  collapsed: boolean;
  hasLogo?: boolean;
  publicPage?: boolean;
}

const TopBar: React.FC<any> = ({
  // collapsed,
  hasLogo = false,
  publicPage = false,
}: ReactNodeProps) => {
  //   const layoutStore = useLayoutStore(state => state)
  //   const handleToggleMenu = (): void => {
  //     layoutStore.setMenuCollapse(!layoutStore.menucollapsed)
  //   }
  const { logo } = loggedUserDataStore();
  const navigate = useNavigate();
  const { userType } = userDataStore();
  const logoPic = logo ? `${process.env.VITE_HOST_URL}/${logo}` : BASLogo;
  const { permissions } = usePermissionStore();

  if (publicPage)
    return (
      <Grid
        container
        className="top-bar-container"
        justifyContent={hasLogo ? "space-between" : "flex-end"}
        spacing={0}
        sx={{ zIndex: "1005" }}
      >
        {hasLogo && (
          <Grid item alignItems="center" display="flex" xs={2} pl={1}>
            <img src={Logo} alt="logo" />
          </Grid>
        )}
      </Grid>
    );

  const homepageRedirect = () => {
    if (userType === "Organization") {
      navigate("/organization/no-data");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      {userType !== undefined && (
        <Grid
          container
          className="top-bar-container"
          justifyContent={hasLogo ? "space-between" : "flex-end"}
          sx={{ zIndex: "1005" }}
          spacing={0}
        >
          {hasLogo && userType !== undefined && (
            <Grid
              sx={{ zIndex: "1005" }}
              item
              alignItems="center"
              justifyContent={"start"}
              display="flex"
              xs={2}
              gap="20px"
            >
              {/* <img
                src={`${process.env.VITE_HOST_URL}/${logo}`}
                alt="logo"
                style={{
                  height: '70px',
                  width: '70px',
                  objectFit: 'cover',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={homepageRedirect}
              /> */}

              {permissions?.length > 0 ? (
                <img
                  src={logoPic}
                  alt="avatar"
                  width={50}
                  height={50}
                  // height={60}
                  style={{
                    // borderRadius: '50%',
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={homepageRedirect}
                />
              ) : (
                <Skeleton variant="circular" width={50} height={50} />
              )}
              <Button
                variant="contained"
                className="go_back_button"
                onClick={() => {
                  navigate(-1);
                }}
              >
                Go Back
              </Button>
            </Grid>
          )}

          <Grid item xs="auto" alignItems="center" display="flex" sx={{ zIndex: "1005" }}>
            <Grid container spacing={0} justifyContent="flex-end">
              {/* <Grid item>
                <GlobalSearch />
              </Grid> */}
              {/* <Grid item>
                <SettingMenuComponent />
              </Grid> */}
              <Grid item>
                <NotificatonMenuComponent />
              </Grid>
              <Grid item>
                <ActiveUserCardComponent />
              </Grid>
            </Grid>
          </Grid>

          {/* <Button onClick={handleToggleMenu}>Toggle</Button> */}
        </Grid>
      )}
    </>
  );
};

export default TopBar;
