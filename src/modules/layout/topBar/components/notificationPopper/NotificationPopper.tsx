import React, { useEffect, useState } from "react";

import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";

import ListItemIcon from "@mui/material/ListItemIcon";
import { useAuthStore } from "src/store/zustand/globalStates/auth";
import { useLayoutStore } from "src/store/zustand/globalStates/layout";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import { useSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";
import { RoutesNameUrl } from "src/routers/routingsUrl";
import { getAPI, putAPI } from "src/lib/axios";
// icons
import { Avatar, Box, Button } from "@mui/material";
import CheckIcon from "src/assets/icons/tick_icon.svg";
import useSocketStore from "src/store/zustand/globalStates/useSocketStore";
import { usePermissionStore } from "src/store/zustand/permission";

import Accordion from "src/components/Accordion/index";
import FacebookCircularProgress from "src/components/CircularLoader";
import { apiRoutes } from "src/routers/apiRoutes";

const GetActiveIcon = (currentRoute: string, url: string) =>
  currentRoute === url ? (
    <ListItemIcon>
      <img src={CheckIcon} alt="check" />
    </ListItemIcon>
  ) : (
    <></>
  );

const dummys = [
  {
    id: 1,
    subject: "testing 101",
    content:
      '<p><strong>Subject Line:</strong> New <a href="http://localhost:3000/config/undefined" target="_self">Asiahn</a></p>\n<p><strong>Body:</strong></p>\n<p><strong>Hello world</strong></p>',
  },
  {
    id: 2,
    subject: "testing 101",
    content:
      '<p><strong>Subject Line:</strong> New <a href="http://localhost:3000/config/undefined" target="_self">gghg</a></p>\n<p><strong>Body:</strong></p>\n<p><strong>Hello world</strong></p>',
  },
];

const NotificationPopper: React.FC<any> = ({ open, setOpen, anchorRef }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectTab = searchParams.get("select");
  const chooseTab = RoutesNameUrl[`${selectTab}`];
  const [isReading, setIsReading] = useState(false);
  const [notificationClicked, setNotificationClicked] = useState<any>(null);
  const { messages, setMessages } = useSocketStore();

  const { setPermissions } = usePermissionStore();

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef?.current?.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
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

  useEffect(() => {
    if (prevOpen.current && !open) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
    // isRead
    // console.log('filtering only unread message based on open change  and isRead property');
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

  const toggleMessageRead = (item: any) => {
    const messagesRead = messages.map((message) =>
      String(message?.id) === String(item?.id)
        ? {
            ...message,
            is_read: !item.is_read,
          }
        : message,
    );

    setMessages(messagesRead);
  };

  const handleExpandNotification = async (item: any) => {
    if (notificationClicked?.id === item?.id) {
      setNotificationClicked(null);
    } else {
      setNotificationClicked(item);
    }

    if (item?.is_read) {
      return;
    }

    setIsReading(true);

    try {
      const { status, result } = await putAPI(`${apiRoutes.notification.getSingleAPI}${item?.id}`, {
        is_read: true,
      });

      if (status === 200 || (status > 200 && status < 300)) {
        // change isRead status of the message
        toggleMessageRead(item);
        setIsReading(false);
      } else {
        setIsReading(false);
        enqueueSnackbar("Failed to read notification", { variant: "error" });
      }
    } catch (err) {
      setIsReading(false);
      enqueueSnackbar("Failed to read notification", { variant: "error" });
    }
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
              width: 400,
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
                  padding: "10px",
                  maxHeight: 420,
                  overflowY: "auto",
                }}
              >
                <div
                  // className="top__bar-settings-menu-item"
                  style={{
                    display: "flex",
                    alignItems: "center",

                    marginBottom: 1,
                  }}
                >
                  <h3>Notifications</h3>
                </div>
                {messages?.slice(0, 3)?.map((item: any, index: number) => (
                  <Accordion
                    key={item?.id}
                    expanded={notificationClicked?.id === item?.id}
                    header={
                      <Box
                        // className="top__bar-settings-menu-item"
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem",
                          cursor: "pointer",
                          borderRadius: "4px",
                          transition: "background-color 0.5s",
                          ":hover": {
                            backgroundColor: "#dddddd55",
                          },
                        }}
                        onClick={(e) => {
                          handleExpandNotification(item);
                        }}
                      >
                        <div
                          style={{
                            visibility: item?.is_read ? "hidden" : "visible",
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            backgroundColor: "#283352",
                          }}
                        />

                        <div style={{ borderRadius: "50%", width: "50px", height: "50px" }}>
                          <Avatar
                            alt="Notification Avatar"
                            src={`${process.env.VITE_HOST_URL}/${item?.photo}`}
                          />
                        </div>
                        <div>
                          <div>{item.subject}</div>
                        </div>

                        {GetActiveIcon(chooseTab?.url, RoutesNameUrl?.notification?.url)}
                      </Box>
                    }
                  >
                    {!item?.is_read && isReading && notificationClicked?.id === item?.id ? (
                      <FacebookCircularProgress />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: item?.content }} />
                    )}
                  </Accordion>
                ))}

                <div
                  // className="top__bar-settings-menu-item"
                  style={{
                    textAlign: "center",
                    padding: "0.5rem 0",
                  }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    style={{ width: "100%" }}
                    onClick={() => {
                      navigate("/notification-list");
                      setOpen(false);
                    }}
                  >
                    View All
                  </Button>
                </div>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default NotificationPopper;
