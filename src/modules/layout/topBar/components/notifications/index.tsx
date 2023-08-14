import { Badge, Grid, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";

import NotificationsIcon from "@mui/icons-material/Notifications";
import useSocketStore from "src/store/zustand/globalStates/useSocketStore";
import { userDataStore } from "src/store/zustand/globalStates/userData";
import useReconnectingSocket from "src/hooks/useReconnectingSocket";
import useSocketManagement from "src/hooks/useSocketManagement";
import { apiRoutes } from "src/routers/apiRoutes";
import { getAPI } from "src/lib/axios";
import useAppStore from "src/store/zustand/app";
import NotificationPopper from "../notificationPopper/NotificationPopper";
import { addMessageHandler, messageHandlers } from "./notificationHandlers";

const sample = {
  id: 153,
  subject: "testing 101",
  content:
    '<p><strong>Subject Line:</strong> New <a href="http://localhost:3000/config/undefined" target="_self">dsfasdfajghjk</a></p>\n<p><strong>Body:</strong></p>\n<p><strong>Hello world</strong></p>',
  created_at: "2023-03-17T15:41:39.937072+05:45",
  is_read: null,
  full_name: "Tokyo Organization",
  photo:
    "https://bas-dev-api.bridge.propelmarine.com/https://bas-dev-api.bridge.propelmarine.com/static/profile/e55adc05-9a2.png",
};

const NotificatonMenuComponent: React.FC<any> = () => {
  // const { getNotifications, notifications }: any = useNotificationStore();
  const [open, setOpen] = useState(false);
  const { user }: any = useAppStore();

  const { userType } = userDataStore();

  const anchorRef = React.useRef<HTMLDivElement>(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const { messages, setMessages, count, setCount } = useSocketStore();
  const { socket, connected, setSocketConnected, setSocketDisconnected, connectSocket } =
    useSocketManagement({ url: `${process.env.VITE_WS_URL}noti/${user?.id}` || "" });

  useReconnectingSocket({
    maxReconnectAttempt: 5,
    reconnectInterval: 5000,
    pingInterval: 3000,
    connectOnMount: true,
    socket,
    me: true,
    connected,
    connectSocket,
    setSocketConnected,
    setSocketDisconnected,
    showLog: true,
    urlId: user?.id,
    messageHandlers,
  });

  const fetchNotificationMessage = async () => {
    const { data, status } = await getAPI(`${apiRoutes.notification.getAPI}?isread=false&size=5`);
    setMessages(data.items || []);
    setCount(data?.info?.unread_count || 0);
  };

  useEffect(() => {
    if (!userType) return;
    // fetch latest unread notificaton and its count and update the messages state on initial page load
    if (userType === "Organization") fetchNotificationMessage();
  }, [open, userType]);

  useEffect(() => {
    if (socket && connected)
      addMessageHandler(function handleNotifcation(message: any) {
        setMessages([message, ...messages]);
        setCount(count + 1);
      });
  }, [connected, messages, socket]);

  return (
    <Grid container spacing={0} alignItems={"center"} justifyContent={"center"} className=" h-100 ">
      <Grid item style={{ display: "flex" }}>
        <Stack direction="row" spacing={2}>
          <div
            ref={anchorRef}
            id="composition-button"
            aria-controls={open ? "composition-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            style={{ display: "flex" }}
          >
            <Badge badgeContent={count || 0} color="primary">
              <NotificationsIcon className="icon-buttons" style={{ fontSize: 28, padding: 0 }} />
            </Badge>
          </div>
        </Stack>
        <NotificationPopper anchorRef={anchorRef} open={open} setOpen={setOpen} />
      </Grid>
    </Grid>
  );
};

export default NotificatonMenuComponent;
