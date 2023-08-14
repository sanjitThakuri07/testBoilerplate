import React from "react";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useAuthStore } from "src/store/zustand/globalStates/auth";
import { useLayoutStore } from "src/store/zustand/globalStates/layout";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import { useNavigate, useLocation } from "react-router-dom";
import { getAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { RoutesNameUrl } from "src/routers/routingsUrl";
// icons
import EditIcon from "src/assets/icons/edit-03.svg";
import AccountIcon from "src/assets/icons/user-check-02.svg";
import AuditLogIcon from "src/assets/icons/layers-three-01.svg";
import NotificationIcon from "src/assets/icons/bell-ringing-03.svg";
import LogOutIcon from "src/assets/icons/log-out-04.svg";
import CheckIcon from "src/assets/icons/tick_icon.svg";
import { usePermissionStore } from "src/store/zustand/permission";

const GetActiveIcon = (currentRoute: string, url: string) =>
  currentRoute === url ? (
    <ListItemIcon>
      <img src={CheckIcon} alt="check" />
    </ListItemIcon>
  ) : (
    <></>
  );

const SettingPopper: React.FC<any> = ({ open }) => {
  //   const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectTab = searchParams.get("select");
  const chooseTab = RoutesNameUrl[`${selectTab}`];

  const { setPermissions } = usePermissionStore();

  // for compact mode (should use gloabl store)
  const label = { inputProps: { "aria-label": "Switch demo" } };

  const handleToggle = () => {
    // setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef?.current?.contains(event.target as HTMLElement)) {
      return;
    }

    // setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      //   setOpen(false);
    } else if (event.key === "Escape") {
      //   setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current && !open) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const authStore = useAuthStore((state) => state);
  const userData = userDataStore((state) => state);
  const { enqueueSnackbar } = useSnackbar();
  const layoutStore = useLayoutStore((state) => state);

  const logoutAPICall = () => {
    getAPI("user/auth/logout")
      .then((res) => {
        enqueueSnackbar("Logout Successfully", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Logout Failed", { variant: "error" });
      });
  };

  const handleLogout = (): void => {
    logoutAPICall();
    authStore.setAuthenticated(false);
    layoutStore.clearLayoutValues();
    userData.clearUserData();
    localStorage.clear();
    setPermissions();
  };

  return (
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
                {/* <MenuItem
                          className="top__bar-settings-menu-item"
                          onClick={() => navigate('/setting')}>
                          <ListItemIcon>
                            <img src={LayoutIcon} alt="Audit Log Icon" />
                          </ListItemIcon>
                          <ListItemText>Compact Mode</ListItemText>
                          <div>
                            <IOSSwitch
                              value="email"
                              name="notify_tenant_signup_through"
                              checked={false}
                              onChange={() => {
                                console.log('clicked');
                              }}
                              disabled={true}
                              style={{ justifyContent: 'flex-end' }}
                              disableText
                            />
                          </div>
                        </MenuItem> */}
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
  );
};

export default SettingPopper;
