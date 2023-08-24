/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useLayoutStore } from "src/store/zustand/globalStates/layout";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import { menuData } from "src/modules/layout/navbar/constants/menu.config";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Navicons
import { usePermissionStore } from "src/store/zustand/permission";
import { checkPermission } from "src/utils/permission";
import Activity from "src/assets/navIcons/activities.svg";
import Analytic from "src/assets/navIcons/analytics.svg";
import Booking from "src/assets/navIcons/bookings.svg";
import Calendar from "src/assets/navIcons/calendar.svg";
import Configuration from "src/assets/navIcons/configuration.svg";
import Customer from "src/assets/navIcons/customers.svg";
import Finance from "src/assets/navIcons/finance.svg";
import Help from "src/assets/navIcons/help.svg";
import Inspection from "src/assets/navIcons/inspections.svg";
import Organization from "src/assets/navIcons/organization.svg";
import Overview from "src/assets/navIcons/overview.svg";
import Quotation from "src/assets/navIcons/quotations.svg";
import Template from "src/assets/navIcons/templates.svg";
import { permissionFilter } from "src/modules/config/generalSettings/OrganizationConfiguration";
import { DecodedTokenProps } from "src/routers/private/privateRoute";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import jwt_decode from "jwt-decode";
import { Tooltip } from "@mui/material";
import { useTemplateStore } from "src/store/zustand/templates/templateStore";

export const sidebarFilter = ({ item, permissions, userType }: any) => {
  const checkRole = item?.role.length ? item?.role?.includes(userType) : true;
  const result = checkPermission({ permissions, permission: item.permission }) && checkRole;

  return result;
};

const MenuListComponent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const layoutStore = useLayoutStore((state) => state);
  const { userType } = userDataStore();
  const { permissions, isLoading } = usePermissionStore();

  const { templates, getTemplates }: any = useTemplateStore();
  const [appendSidebar, setAppendSidebar] = useState([]);

  let permissionss = [...permissions];

  const token = userDataStore((state) => state.token);
  const type = userDataStore((state) => state.userType);
  let decodedToken: DecodedTokenProps;
  let exp = 0;
  if (token) {
    decodedToken = jwt_decode(token);
    exp = decodedToken?.exp;
    exp = exp * 1000;
  }

  if (!(exp > Date.now())) {
    permissionss = [];
  }

  const handleNavigate = (path: string) => {
    navigate(path);
  };
  const getIcon = (icon: string): any => {
    switch (icon) {
      case "overview":
        return <img src={Overview} alt="" />;

      case "customer":
        return <img src={Customer} alt="" />;
      case "quotation":
        return <img src={Quotation} alt="" />;
      case "booking":
        return <img src={Booking} alt="" />;
      case "template":
        return <img src={Template} alt="" />;
      case "inspection":
        return <img src={Inspection} alt="" />;
      case "calendar":
        return <img src={Calendar} alt="" />;
      case "finance":
        return <img src={Finance} alt="" />;
      case "activity":
        return <img src={Activity} alt="" />;
      case "analytic":
        return <img src={Analytic} alt="" />;
      case "configuration":
        return <img src={Configuration} alt="" />;
      case "organization":
        return <img src={Organization} alt="" />;
      case "payment":
        return <img src={Finance} alt="" />;
      // case 'help':
      //   return <img src={Help} alt="" />;

      default:
        return <img src={Help} alt="" />;
    }
  };

  useEffect(() => {
    getTemplates({ query: { size: 999999999999 }, getAll: false });
    if (templates?.length) {
      setAppendSidebar((prev) => {
        const data = templates?.map((template: any) => {
          return {
            ...template,
            label: template?.name,
            path: `page/${template?.id}`,
            depth: 1,
            tabsContainer: [],
            permission: [],
            icon: "organization",
          };
        });

        return data;
      });
    }
  }, []);

  console.log({ appendSidebar });

  const handleListNavigation = ({ menu }: any) => {
    return menu.tabsContainer.length && menu.depth === 1
      ? handleNavigate(
          menu?.tabsContainer?.filter((item: any) =>
            permissionFilter({ item, permissions: permissionss }),
          )?.[0]?.link,
        )
      : menu.tabsContainer.length && menu.depth === 2
      ? menu?.tabsContainer?.filter((item: any) =>
          permissionFilter({ item, permissions: permissionss }),
        )?.[0]?.subTabContainer?.length
        ? handleNavigate(
            menu?.tabsContainer
              ?.filter((item: any) => permissionFilter({ item, permissions: permissionss }))?.[0]
              ?.subTabContainer?.filter((itemSub: any) =>
                permissionFilter({ item: itemSub, permissions: permissionss }),
              )?.[0]?.link,
          )
        : handleNavigate(
            menu?.tabsContainer?.filter((item: any) =>
              permissionFilter({ item, permissions: permissionss }),
            )?.[0]?.link,
          )
      : handleNavigate(menu.path);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "transparent",
        color: "white",
        height: "100%",
      }}
    >
      <div className="navbar_menu_icon_list sidebar___comon-style">
        {/* Navlink for platform owner */}
        {userType === "Platform_owner" &&
          (!permissionss.length ? (
            <List sx={{ flexDirection: "column" }} className="sidebar___comon-style">
              {[0, 1, 2].map((menu, ind) => (
                <ListItem
                  // disablePadding
                  key={ind}
                  className={"skeleton-box"}
                  onClick={() => handleListNavigation({ menu })}
                >
                  <ListItemButton>
                    <ListItemIcon></ListItemIcon>{" "}
                    {/* {!layoutStore.menucollapsed && <ListItemText primary={menu.label} />} */}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <List>
              {menuData.PLATFORM_OWNER.map((menu, ind) => (
                <ListItem
                  disablePadding
                  key={ind}
                  className={`${location.pathname === menu.path ? "active" : ""}`}
                  onClick={() => handleNavigate(menu.path)}
                >
                  <ListItemButton>
                    <ListItemIcon>{getIcon(menu.icon)}</ListItemIcon>
                    {!layoutStore.menucollapsed && <ListItemText primary={menu.label} />}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ))}
        {/* Navlink for  Tenant */}
        {userType === "Tenant" &&
          (!permissionss.length ? (
            <List sx={{ flexDirection: "column" }} className="sidebar___comon-style">
              {[0, 1].map((menu, ind) => (
                <ListItem
                  // disablePadding
                  key={ind}
                  className={"skeleton-box"}
                  onClick={() => handleListNavigation({ menu })}
                >
                  <ListItemButton>
                    <ListItemIcon></ListItemIcon>{" "}
                    {/* {!layoutStore.menucollapsed && <ListItemText primary={menu.label} />} */}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <List>
              {menuData.TENANT.map((menu, ind) => (
                <ListItem
                  disablePadding
                  key={ind}
                  className={`${location.pathname === menu.path ? "active" : ""}`}
                  onClick={() => handleNavigate(menu.path)}
                >
                  <ListItemButton>
                    <ListItemIcon>{getIcon(menu.icon)}</ListItemIcon>
                    {!layoutStore.menucollapsed && <ListItemText primary={menu.label} />}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ))}
        {/* Navlink for Organization */}
        {(userType === "Organization_user" ||
          userType === "Organization" ||
          userType === "Customer") &&
          (!permissionss.length ? (
            <List sx={{ flexDirection: "column" }} className="sidebar___comon-style">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((menu, ind) => (
                <ListItem
                  // disablePadding
                  key={ind}
                  className={"skeleton-box"}
                  onClick={() => handleListNavigation({ menu })}
                >
                  <ListItemButton>
                    <ListItemIcon></ListItemIcon>{" "}
                    {/* {!layoutStore.menucollapsed && <ListItemText primary={menu.label} />} */}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <List sx={{ flexDirection: "column" }} className="sidebar___comon-style">
              {[
                ...(menuData.ORGANIZATION || []),
                ...(templates || [])?.map((template: any) => {
                  return {
                    ...template,
                    label: template?.name,
                    path: `/page/${template?.id}`,
                    depth: 1,
                    tabsContainer: [],
                    permission: [],
                    icon: "organization",
                    role: [],
                    position: "",
                  };
                }),
              ]
                ?.filter((item) => sidebarFilter({ item, permissions: permissionss, userType }))
                .map((menu, ind) => {
                  return (
                    <>
                      {menu?.position === "end" ? (
                        <div
                          style={{ flex: "1", display: "flex", alignItems: "flex-end" }}
                          className={menu?.className ? menu?.className : ""}
                        >
                          <ListItem
                            disablePadding
                            key={ind}
                            className={`${location.pathname === menu.path ? "active" : ""}`}
                            onClick={() => handleListNavigation({ menu })}
                          >
                            <ListItemButton>
                              <ListItemIcon>{getIcon(menu.icon)}</ListItemIcon>
                              {!layoutStore.menucollapsed && (
                                <Tooltip title={menu.label} placement="top-start">
                                  <ListItemText primary={menu.label} className="sidebar__text" />
                                </Tooltip>
                              )}
                            </ListItemButton>
                          </ListItem>
                        </div>
                      ) : (
                        <ListItem
                          disablePadding
                          key={ind}
                          className={`${location.pathname === menu.path ? "active" : ""}`}
                          onClick={() => handleListNavigation({ menu })}
                        >
                          <ListItemButton>
                            <Tooltip title={menu.label} arrow placement="right">
                              <ListItemIcon
                                style={{
                                  margin: "0.3rem 0",
                                  cursor: "pointer",
                                }}
                              >
                                {getIcon(menu.icon)}
                              </ListItemIcon>
                            </Tooltip>

                            {!layoutStore.menucollapsed && (
                              <>
                                <Tooltip title={menu.label} placement="top-start">
                                  <ListItemText primary={menu.label} />
                                </Tooltip>
                              </>
                            )}
                          </ListItemButton>
                        </ListItem>
                      )}
                    </>
                  );
                })}
            </List>
          ))}
        <Divider />
      </div>
    </Box>
  );
};
export default MenuListComponent;
