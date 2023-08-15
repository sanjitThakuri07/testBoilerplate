/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import InputIcon from "@mui/icons-material/Input";
import { Grid, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useLayoutStore } from "src/store/zustand/globalStates/layout";
import React from "react";
import MenuListComponent from "./components/menuList";
// import Help from 'src/assets/navIcons/help.svg';
import { loggedUserDataStore } from "src/store/zustand/globalStates/loggedUserData";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { usePermissionStore } from "src/store/zustand/permission";
import BASLogo from "src/assets/icons/logo.png";
import Help from "src/assets/navIcons/help.svg";
// import { userInfos } from  "src/store/zustand/globalStates/UserInfos";

const NavBar: React.FC<any> = () => {
  const layoutStore = useLayoutStore((state) => state);
  const handleToggleMenu = (): void => {
    let menuStatus = !layoutStore.menucollapsed;
    let root: any = document.querySelector(":root");
    root.style.setProperty("--sidebar-width-dynamic", menuStatus ? "74px" : "235px");
    layoutStore.setMenuCollapse(menuStatus);
  };
  const { logo, name } = loggedUserDataStore();
  const { permissions } = usePermissionStore();

  const { profilePicture, userType } = userDataStore();

  const navigate = useNavigate();

  const decoder: any = jwtDecode(localStorage?.getItem("access") || "");

  // const handleImageUploader: any = () => {
  //   let image = "";
  //   if (decoder?.role === "Organization") {
  //     image = sidebarImage?.includes("data")
  //       ? sidebarImage
  //       : `${process.env.VITE_HOST_URL}/${sidebarImage}`;
  //   } else {
  //     image = Logo;
  //   }
  //   return image;
  // };

  const homepageRedirect = () => {
    if (userType === "Organization") {
      navigate("/organization/no-data");
    } else {
      navigate("/dashboard");
    }
  };

  const logoPic = logo ? `${process.env.VITE_HOST_URL}/${logo}` : BASLogo;
  return (
    <Grid
      container
      className={`nav-container ${layoutStore.menucollapsed ? "collapsed" : ""}`}
      spacing={0}
      alignItems={layoutStore.menucollapsed ? "center" : "flex-start"}
      justifyContent={"space-between"}
      direction={"column"}
      sx={{ overflowY: "auto" }}
      flexWrap={"nowrap"}
    >
      <Grid
        item
        className="w-100 sidebar___comon-style"
        sx={{ flex: "1", flexDirection: "column" }}
      >
        <Grid item className="logo-section ">
          {/* <img
            src={logo ? `${process.env.VITE_HOST_URL}/${logo}` : Logo}
            alt="logo"
            style={{
              height: '70px',
              width: '70px',
              objectFit: 'cover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          /> */}

          {permissions?.length > 0 ? (
            <img
              src={logoPic}
              alt="avatar"
              width={layoutStore?.menucollapsed ? 40 : 80}
              height={layoutStore?.menucollapsed ? 40 : 80}
              // height={60}
              style={{
                // borderRadius: '50%',
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={homepageRedirect}
            />
          ) : (
            <Skeleton variant="circular" width={70} height={70} />
          )}
        </Grid>
        <Grid item className="menu-section sidebar___comon-style" sx={{ flex: "1" }}>
          <MenuListComponent />
        </Grid>
      </Grid>
      <Grid item className="extra-section w-100 text-white">
        <Box
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "transparent",
            color: "white",
          }}
        >
          <List>
            <ListItem disablePadding className={""}>
              <div className="nav_help_topography" style={{ width: "100%" }}>
                <ListItemButton>
                  <ListItemIcon>
                    <div
                      // className="help_icon"
                      style={{
                        marginRight: "7.5px",
                        color: "#c1c6d4",
                        fontSize: "16px",
                        fontWeight: "500",
                      }}
                    >
                      <img src={Help} alt="" />
                    </div>
                  </ListItemIcon>
                  {!layoutStore.menucollapsed && <ListItemText primary={"Help"} />}
                </ListItemButton>
              </div>
            </ListItem>
          </List>
          <Grid container justifyContent={"flex-end"} alignItems={"center"}>
            <Grid item container justifyContent={"flex-end"} alignItems={"center"}>
              <Divider className="text-white" sx={{ width: "100%" }} />
              <InputIcon
                style={{
                  margin: "22px 35px 0 0",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleMenu();
                }}
                className="menu-icon help-icon"
                sx={{ marginTop: "10px", marginRight: "6px" }}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default NavBar;
