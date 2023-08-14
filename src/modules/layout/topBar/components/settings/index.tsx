/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Grid } from "@mui/material";
import React from "react";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleIcon from "@mui/icons-material/Circle";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useAuthStore } from "src/store/zustand/globalStates/auth";
import { useLayoutStore } from "src/store/zustand/globalStates/layout";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import { useNavigate, useLocation } from "react-router-dom";
import { getAPI } from "src/lib/axios";
import { useSnackbar } from "notistack";
import { IOSSwitch } from "src/components/switch/IosSwitch";
import { RoutesNameUrl } from "src/routers/routingsUrl";
// icons
import EditIcon from "src/assets/icons/edit-03.svg";
import AccountIcon from "src/assets/icons/user-check-02.svg";
import AuditLogIcon from "src/assets/icons/layers-three-01.svg";
import NotificationIcon from "src/assets/icons/bell-ringing-03.svg";
import LayoutIcon from "src/assets/icons/layout-alt-03.svg";
import LogOutIcon from "src/assets/icons/log-out-04.svg";
import CheckIcon from "src/assets/icons/tick_icon.svg";
import "./settings.scss";
import { usePermissionStore } from "src/store/zustand/permission";

const GetActiveIcon = (currentRoute: string, url: string) =>
  currentRoute === url ? (
    <ListItemIcon>
      <img src={CheckIcon} alt="check" />
    </ListItemIcon>
  ) : (
    <></>
  );

const SettingMenuComponent: React.FC<any> = () => {
  const [open, setOpen] = React.useState(false);
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
    setOpen((prevOpen) => !prevOpen);
  };

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

  const handleChangeTheme = (sel: string, event: Event | React.SyntheticEvent): void => {
    layoutStore.changeTheme(sel);
    handleClose(event);
  };

  return (
    <Grid
      container
      spacing={0}
      alignItems={"center"}
      justifyContent={"center"}
      className=" h-100"
      style={{
        boxShadow: open ? "0px 0px 0px 4px #F2F4F7" : "none",
        borderRadius: "8px",
      }}
    >
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
            >
              <SettingsIcon className="icon-buttons" style={{ width: "56px" }} />
            </div>
          </div>
        </Stack>
      </Grid>
    </Grid>
  );
};

// previous menu item
{
  /* <Paper>
  <ClickAwayListener onClickAway={handleClose}>
    <MenuList
      autoFocusItem={open}
      id="composition-menu"
      aria-labelledby="composition-button"
      onKeyDown={handleListKeyDown}
    >
      <MenuItem onClick={handleClose}>Select Theme</MenuItem>
      <Divider />
      <MenuItem
        onClick={(event: Event | React.SyntheticEvent) =>
          handleChangeTheme("blue", event)
        }
      >
        <ListItemIcon className="theme-blue">
          {layoutStore.theme === "blue" ? <CheckCircleIcon /> : <CircleIcon />}
        </ListItemIcon>
        <ListItemText>Blue</ListItemText>
      </MenuItem>

      <MenuItem
        onClick={(event: Event | React.SyntheticEvent) =>
          handleChangeTheme("green", event)
        }
      >
        <ListItemIcon className="theme-green">
          {layoutStore.theme === "green" ? <CheckCircleIcon /> : <CircleIcon />}
        </ListItemIcon>{" "}
        <ListItemText>Green</ListItemText>
      </MenuItem>
    </MenuList>
  </ClickAwayListener>
</Paper>; */
}

export default SettingMenuComponent;
