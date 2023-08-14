/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import GetWindowSize from "src/components/GetWindowSize";
import { useLayoutStore } from "src/store/zustand/globalStates/layout";
import React, { useState } from "react";
import Footer from "./footer";
import NavBar from "./navbar";
import TopBar from "./topBar";

interface ReactNodeProps {
  children: React.ReactNode;
  className?: String;
}

type Anchor = "top" | "left" | "bottom" | "right";

const Layout: React.FC<any> = ({ children, className }: ReactNodeProps) => {
  const layoutStore = useLayoutStore((state) => state);
  // const { user }: any = useAppStore();

  const [sidebarState, setSidebarState] = useState({ left: false });
  const windowSize = GetWindowSize();

  const toggleDrawer =
    (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setSidebarState({ ...sidebarState, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        width:
          anchor === "top" || anchor === "bottom"
            ? "auto"
            : layoutStore.menucollapsed
            ? "80"
            : "200",
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      className={`layout-container ${layoutStore.theme}`}
    >
      <NavBar collapsed={layoutStore.menucollapsed} />
    </Box>
  );

  return (
    <div className={`layout-container ${layoutStore.theme} ${className}`}>
      {windowSize?.width > 1100 ? (
        <NavBar collapsed={layoutStore.menucollapsed} />
      ) : (
        <Drawer anchor={"left"} open={sidebarState["left"]} onClose={toggleDrawer("left", false)}>
          {list("left")}
        </Drawer>
      )}

      <div className={`page-section ${layoutStore.menucollapsed ? "collapsed" : ""}`}>
        <div style={{ position: "relative", zIndex: "1005" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer("left", true)}
            edge="start"
            sx={{ mr: 2, ...(sidebarState["left"] && { display: "none" }) }}
            className="hamburger__button"
          >
            <MenuIcon />
          </IconButton>
          <TopBar />
        </div>
        <div className="children-container">
          <div className="page-container ">
            <div className="child-container">{children}</div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
