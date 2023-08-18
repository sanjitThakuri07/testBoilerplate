/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Grid } from "@mui/material";
// import Button from 'src/components/buttons'
import React from "react";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import { useAuthStore } from "src/store/zustand/globalStates/auth";
import { useLayoutStore } from "src/store/zustand/globalStates/layout";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import InspectionIcon from "src/assets/navIcons/inspections.svg";
import { useSnackbar } from "notistack";
import { getAPI } from "src/lib/axios";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckIcon from "src/assets/icons/tick_icon.svg";
import { RoutesNameUrl } from "src/routers/routingsUrl";

import { useLocation, useNavigate } from "react-router-dom";

import NotificationIcon from "src/assets/icons/bell-ringing-03.svg";
import AuditLogIcon from "src/assets/icons/layers-three-01.svg";
import LogOutIcon from "src/assets/icons/log-out-04.svg";
import AccountIcon from "src/assets/icons/user-check-02.svg";
import EditIcon from "src/assets/icons/edit-03.svg";
// import UserIcon from '../src/assets/icons/userIcon.png';

import useAppStore from "src/store/zustand/app";
import { usePermissionStore } from "src/store/zustand/permission";
import UserIcon from "src/assets/icons/userIcon.png";
// import "../settings/settings.scss";
import { loggedUserDataStore } from "src/store/zustand/globalStates/loggedUserData";
const GetActiveIcon = (currentRoute: string, url: string) =>
  currentRoute === url ? (
    <ListItemIcon>
      <img src={CheckIcon} alt="check" />
    </ListItemIcon>
  ) : (
    <></>
  );

const ActiveUserCardComponent: React.FC<any> = () => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const selectTab = searchParams.get("select");

  const chooseTab = RoutesNameUrl[`${selectTab}`];

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef?.current?.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const navigate = useNavigate();
  const { profilePicture } = userDataStore();

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current && !open) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const authStore = useAuthStore((state) => state);
  const layoutStore = useLayoutStore((state) => state);
  const userData = userDataStore((state) => state);
  const { setPermissions } = usePermissionStore();
  const { clearOrgData } = loggedUserDataStore();

  const { enqueueSnackbar } = useSnackbar();

  const { logoutUser, user }: any = useAppStore();

  const logoutAPICall = () => {
    getAPI("user/auth/logout")
      .then((res) => {
        enqueueSnackbar("Logout Successfully", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Logout Failed", { variant: "error" });
      });
  };

  const handleLogout = async () => {
    // logoutAPICall();
    if (await logoutUser({ enqueueSnackbar })) {
      // console.log({ userData });
      sessionStorage.setItem("return-path", "reset");
      authStore.setAuthenticated(false);
      layoutStore.clearLayoutValues();
      userData.clearUserData();
      clearOrgData();
      setPermissions();
      localStorage.clear();
    }
  };

  return (
    <Grid
      container
      spacing={0}
      alignItems={"center"}
      justifyContent={"center"}
      className="active-user-container h-100 "
    >
      <Grid item alignItems={"center"} justifyContent={"center"}>
        <Grid container>
          <Grid item>
            <Stack direction="row" spacing={2}>
              <div>
                <div
                  ref={anchorRef}
                  id="composition-button"
                  aria-controls={open ? "composition-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                  style={{ display: "flex" }}
                >
                  {profilePicture ? (
                    <img
                      src={`${process.env.VITE_HOST_URL}/${profilePicture}`}
                      alt="avatar"
                      width={42}
                      height={42}
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <img
                      src={UserIcon}
                      alt="avatar"
                      width={30}
                      height={30}
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </div>
              </div>
            </Stack>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-end"
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: placement === "bottom-end" ? "left top" : "left bottom",
                    boxShadow:
                      "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
                  }}
                >
                  <Paper
                    sx={{
                      width: 280,
                      maxWidth: "100%",
                      borderRadius: "8px",
                      marginTop: "28px",
                      border: "1px solid #EAECF0",
                    }}
                  >
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                        sx={{
                          padding: "4px",
                        }}
                      >
                        <MenuItem
                          onClick={(e) => {
                            handleClose(e);
                            navigate(`/settings?select=${RoutesNameUrl?.profile?.url}`);
                          }}
                          className="top__bar-settings-menu-item"
                        >
                          <ListItemIcon>
                            <img src={EditIcon} alt="edit" />
                          </ListItemIcon>
                          <ListItemText>Edit Profile</ListItemText>
                          {GetActiveIcon(chooseTab?.url, RoutesNameUrl?.profile?.url)}
                        </MenuItem>
                        <MenuItem
                          className="top__bar-settings-menu-item"
                          onClick={(e) => {
                            handleClose(e);
                            navigate(`/settings?select=${RoutesNameUrl?.account?.url}`);
                          }}
                        >
                          <ListItemIcon>
                            <img src={AccountIcon} alt="edit" />
                          </ListItemIcon>
                          <ListItemText>Account Security</ListItemText>
                          {GetActiveIcon(chooseTab?.url, RoutesNameUrl?.account?.url)}
                        </MenuItem>
                        <MenuItem
                          className="top__bar-settings-menu-item"
                          onClick={(e) => {
                            handleClose(e);
                            navigate(`/settings?select=${RoutesNameUrl?.audit?.url}`);
                          }}
                        >
                          <ListItemIcon>
                            <img src={AuditLogIcon} alt="Audit Log Icon" />
                          </ListItemIcon>
                          <ListItemText>Audit Logs</ListItemText>
                          {GetActiveIcon(chooseTab?.url, RoutesNameUrl?.audit?.url)}
                        </MenuItem>
                        <MenuItem
                          className="top__bar-settings-menu-item"
                          onClick={(e) => {
                            handleClose(e);
                            navigate(`/settings?select=${RoutesNameUrl?.notification?.url}`);
                          }}
                        >
                          <ListItemIcon>
                            <img src={NotificationIcon} alt="Audit Log Icon" />
                          </ListItemIcon>
                          <ListItemText>Notification Settings</ListItemText>
                          {GetActiveIcon(chooseTab?.url, RoutesNameUrl?.notification?.url)}
                        </MenuItem>
                        <MenuItem
                          className="top__bar-settings-menu-item"
                          onClick={(e) => {
                            handleClose(e);
                            navigate(`${RoutesNameUrl?.formBuilder?.url}`);
                          }}
                        >
                          <ListItemIcon>
                            <img src={InspectionIcon} alt="Audit Log Icon" />
                          </ListItemIcon>
                          <ListItemText>Form Builder</ListItemText>
                          {GetActiveIcon(chooseTab?.url, RoutesNameUrl?.notification?.url)}
                        </MenuItem>
                        <MenuItem className="top__bar-settings-menu-item" onClick={handleLogout}>
                          <ListItemIcon>
                            <img src={LogOutIcon} alt="Audit Log Icon" />
                          </ListItemIcon>
                          <ListItemText>Log out</ListItemText>
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Grid>
          <Grid item>
            <Grid container direction={"column"} justifyContent={"space-around"} className="h-100">
              <Grid item className="user-title">
                {userData?.userName || user?.full_name}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ActiveUserCardComponent;
