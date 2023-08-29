import React, { useMemo, useState } from "react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { menuData } from "src/modules/layout/navbar/constants/menu.config";
import { useLayoutStore } from "src/store/zustand/globalStates/layout";
import { useTemplateStore } from "src/store/zustand/templates/templateStore";
import { sidebarFilter } from "./index";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";

const DynamicMenuList = ({ handleListNavigation, getIcon, permissions, userType }: any) => {
  const { templates, getTemplates }: any = useTemplateStore();
  const layoutStore = useLayoutStore((state) => state);
  let menuDatas = [
    ...(menuData.ORGANIZATION || []),
    ...(templates || [])?.map((template: any) => {
      return {
        ...template,
        label: template?.name,
        path: `/page/${template?.id}`,
        depth: 1,
        tabsContainer: [],
        permission: [],
        icon: "none",
        role: [],
        position: "",
      };
    }),
  ];

  let groupMenu = menuDatas?.reduce((acc: any, curr: any, index: number) => {
    if (!Object.keys(curr || {})?.includes("menu")) {
      acc.render_firstNavigation = {
        ...(acc.render_firstNavigation || {}),
        sidebarId: curr?.id,
        sortOrder: 1,
        data: [...(acc.render_firstNavigation?.data || []), { ...curr }],
      };
    } else {
      acc[`${curr?.menu_id}=>${curr?.menu}`] = {
        ...(acc?.[`${curr?.menu_id}=>${curr?.menu}`] || {}),
        sidebarId: curr?.id,
        data: [...(acc[`${curr?.menu_id}=>${curr?.menu}`]?.data || []), { ...curr }],
      };
    }

    return acc;
  }, {});

  const SidebarData = ({ datas, className, lastItemId }: any) => {
    return (
      <>
        {datas
          ?.filter((item) => sidebarFilter({ item, permissions: permissions, userType }))
          .map((menu, ind) => {
            return (
              <>
                {menu?.position === "end" ? (
                  <div
                    style={{ flex: "1", display: "flex", alignItems: "flex-end" }}
                    className={`${className ? className : ""} ${
                      menu?.className ? menu?.className : ""
                    }`}
                  >
                    <ListItem
                      disablePadding
                      key={ind}
                      className={`${location.pathname === menu.path ? "active" : ""}  ${
                        className ? className : ""
                      }
                      ${lastItemId === menu?.id ? "last__block" : ""}
                       sidebar__list`}
                      onClick={(e: any) => {
                        e?.stopPropagation();
                        handleListNavigation({ menu });
                      }}
                    >
                      <ListItemButton>
                        <ListItemIcon>{getIcon(menu.icon)}</ListItemIcon>
                        {!useLayoutStore.menucollapsed && (
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
                    className={`${location.pathname === menu.path ? "active" : ""} ${
                      className ? className : ""
                    }
                    ${lastItemId === menu?.id ? "last__block" : ""}
                    `}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      handleListNavigation({ menu });
                    }}
                  >
                    <ListItemButton>
                      <Tooltip title={menu.label} arrow placement="right">
                        <ListItemIcon
                          style={{
                            margin: "0.3rem 0",
                            cursor: "pointer",
                          }}
                        >
                          {menu?.icon === "none" ? (
                            <ListAltIcon
                              sx={{
                                fill: "rgb(122, 132, 161)",
                                width: "30px",
                                marginRight: "2px",
                              }}
                            />
                          ) : (
                            getIcon(menu?.icon)
                          )}
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
      </>
    );
  };

  const SidebarLabel = ({ label, datas }: any) => {
    const [toggle, setToggle] = useState(false);

    if (label === "null" || label === "render_firstNavigation")
      return (
        <>
          <SidebarData
            datas={datas}
            className={"independent__block"}
            // lastItemId={datas?.length && datas?.[datas?.length - 1]?.id}
          />
        </>
      );

    return (
      <>
        <h3
          onClick={() => {
            setToggle((prev) => !prev);
            console.log("here");
          }}
          className={`nested__heading ${toggle ? "active" : ""}`}
        >
          <span className={`icon__indicator`}>
            <ViewSidebarIcon />
          </span>
          <span style={{ flex: "1", paddingLeft: "8px" }} className="content__box">
            {label}
          </span>

          <span className={`icon__indicator ${toggle ? "up" : "down"}`}>
            <KeyboardArrowDownIcon />
          </span>
        </h3>
        {toggle && (
          <SidebarData
            datas={datas}
            className={"nested__block"}
            lastItemId={datas?.length && datas?.[datas?.length - 1]?.id}
          />
        )}
      </>
    );
  };

  return useMemo(
    () => (
      <List sx={{ flexDirection: "column" }} className="sidebar___comon-style">
        {Object.keys(groupMenu || {})?.length &&
          Object.keys(groupMenu || {})?.map((sidebar: any) => {
            return (
              <React.Fragment key={sidebar?.sidebarId}>
                <SidebarLabel
                  label={sidebar?.split("=>")?.reverse()?.[0] || ""}
                  datas={groupMenu?.[sidebar]?.data || []}
                />
              </React.Fragment>
            );
          })}
      </List>
    ),
    [templates],
  );
};

export default DynamicMenuList;
