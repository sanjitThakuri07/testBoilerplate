import AttachFileIcon from "@mui/icons-material/AttachFile";
import { Box, Button, FormGroup, Grid, Typography, styled } from "@mui/material";
import MultiUploader from "src/components/MultiFileUploader/index";
import useReconnectingSocket from "src/hooks/useReconnectingSocket";
import useSocketManagement from "src/hooks/useSocketManagement";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { getAPI, postAPI } from "src/lib/axios";
import useAppStore from "src/store/zustand/app";
import { url } from "src/utils/url";
import MessageBox from "./MessageBox";
import { addMessageHandler, messageHandlers } from "./chatHandlers";

const MarqueAnimation = styled("div")`
  .marquee {
    width: 450px;
    line-height: 50px;
    background-color: red;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
  }
  .marquee p {
    display: inline-block;
    padding-left: 100%;
    animation: marquee 15s linear infinite;
  }
  @keyframes marquee {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(-100%, 0);
    }
  }
`;

const manyMessages = [
  {
    message: "Hello",
    media: null,
    activity_id: 94,
    id: 156,
    user_id: 17,
    created_at: "2023-08-07T09:14:05.184091+00:00",
    user: "Tokyo Organization",
  },
  {
    message:
      '{"created_at":"2023-08-07T09:14:27.716Z","activity_id":"94","user_id":17,"message":"sdf","media":""}',
    media: null,
    activity_id: 94,
    id: 157,
    user_id: 17,
    created_at: "2023-08-07T09:14:27.801963+00:00",
    user: "Tokyo Organization",
  },
  {
    message:
      '{"created_at":"2023-08-07T09:16:09.590Z","activity_id":"94","user_id":17,"message":"hi","media":""}',
    media: null,
    activity_id: 94,
    id: 158,
    user_id: 17,
    created_at: "2023-08-07T09:16:09.696590+00:00",
    user: "Tokyo Organization",
  },
  {
    message:
      '{"created_at":"2023-08-07T09:14:05.131Z","activity_id":"94","user_id":17,"message":"Heool ","media":""}',
    media: null,
    activity_id: 94,
    id: 160,
    user_id: 17,
    created_at: "2023-08-07T09:14:05.184091+00:00",
    user: "Tokyo Organization",
  },
  {
    message:
      '{"created_at":"2023-08-07T09:14:27.716Z","activity_id":"94","user_id":17,"message":"sdf","media":""}',
    media: null,
    activity_id: 94,
    id: 161,
    user_id: 17,
    created_at: "2023-08-07T09:14:27.801963+00:00",
    user: "Tokyo Organization",
  },
  {
    message:
      '{"created_at":"2023-08-07T09:16:09.590Z","activity_id":"94","user_id":17,"message":"hi","media":""}',
    media: null,
    activity_id: 94,
    id: 162,
    user_id: 17,
    created_at: "2023-08-07T09:16:09.696590+00:00",
    user: "Tokyo Organization",
  },
];

const SendChat = ({ assignActivityID, assignData, disabled = false }: any) => {
  const [openMultiImage, setOpenMultiImage] = React.useState<boolean>(false);
  const [clearData, setClearData] = React.useState<boolean>(false);
  const [messages, setMessages] = React.useState<any>([]);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [isLoadingMoreChat, setIsLoadingMoreChat] = useState(false);
  const [isSubmittingAttachment, setIsSubmittingAttachment] = useState(false);

  const [message, setMessage] = React.useState<string>("");
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [media, setMedia] = React.useState<any>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { user }: any = useAppStore();

  const { socket, connected, setSocketConnected, setSocketDisconnected, connectSocket } =
    useSocketManagement({
      url: `${process.env.VITE_WS_URL}chat/${assignActivityID}`,
    });

  useReconnectingSocket({
    maxReconnectAttempt: 1,
    reconnectInterval: 5000,
    pingInterval: 3000,
    connectOnMount: true,
    socket,
    me: {},
    connected,
    connectSocket,
    setSocketConnected,
    setSocketDisconnected,
    showLog: true,
    urlId: assignActivityID,
    messageHandlers,
  });

  useEffect(() => {
    if (socket && connected)
      addMessageHandler(function handleActivityChat(message: any) {
        setMessages((prev: any) => [...prev, message]);
      });

    return () => {
      if (socket && connected) {
        socket.close();
      }
    };
  }, [connected, socket]);

  const fetchMessages = async ({ overflowElement }: { overflowElement?: any }) => {
    try {
      if (lastMessage === null || (lastMessage && lastMessage?.page < lastMessage?.pages)) {
        const returnedParams = "activity-chat";
        let activityId = assignData?.id
          ? assignData?.id
          : assignActivityID
          ? assignActivityID
          : null;
        if (!activityId) return;
        let response = { status: null, data: null };
        if (lastMessage === null) {
          setIsLoadingMoreChat(true);
          response = await getAPI(
            `${returnedParams}/?activity=${activityId}&q=&archived=&page=1&size=10`,
          );
        } else {
          setIsLoadingMoreChat(true);
          response = await getAPI(
            `${returnedParams}/?activity=${activityId}&q=&archived=&page=${
              lastMessage?.page + 1
            }&size=5`,
          );

          overflowElement.scrollBy(0, 300);
        }
        const { status, data }: any = response;

        if (status && (status === 200 || (status > 200 && status < 300))) {
          if (response.data !== null) {
            setIsLoadingMoreChat(false);
            setLastMessage(data);
            const withOldMessages = [...(data?.items || []), ...messages];
            setMessages(withOldMessages);
          }
        } else {
          setIsLoadingMoreChat(false);
          enqueueSnackbar("Failed to fetch messages!", {
            variant: "error",
          });
        }
      }
    } catch (error: any) {
      setIsLoadingMoreChat(false);
      enqueueSnackbar(error.response.data.message || "Something went wrong!", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    fetchMessages({});
  }, []);

  const sampleMessage = {
    message: "fghjk",
    media: null,
    activity_id: 94,
    id: 51,
    user_id: 17,
    created_at: "2023-08-04T06:55:08.875009+00:00",
    user: "Tokyo Organization",
  };

  const handleAttachmentMessage = async ({ media = [] }: any) => {
    let activityId = assignData?.id ? assignData?.id : assignActivityID ? assignActivityID : null;
    if (!activityId) return;
    try {
      // setLoading(true);
      // const formData = new FormData();
      // media.forEach((file: any) => {
      //   // attachments is the name of array.
      //   formData.append('attachements', file);
      // });

      const payload = {
        message: "",
        media,
        activity_id: activityId,
      };

      setIsSubmittingAttachment(true);
      const { status, data } = await postAPI(
        `${url?.activityChat}/?activity=${activityId}`,
        payload,
      );
      if (status && (status === 200 || (status > 200 && status < 300))) {
        setIsSubmittingAttachment(false);
        const msg = data?.data[0];
        setMessages([...messages, msg]);
      } else {
        setIsLoadingMoreChat(false);
        enqueueSnackbar("Failed to fetch messages!", {
          variant: "error",
        });
      }
    } catch (error: any) {
      setIsSubmittingAttachment(false);
      enqueueSnackbar(error.response.data.message || "Something went wrong!", {
        variant: "error",
      });
    }
  };

  const sendChatMessage = async ({ text, media }: any) => {
    try {
      // const message = {
      //   created_at: new Date().toISOString(),
      //   activity_id: assignActivityID,
      //   user_id: user?.id, // is sender
      //   message: text,
      //   media: '',
      // };
      // setMessages((prev: any) => [...prev, message]);
      // setMessage('');
      if (user && socket && connected && socket.readyState === 1) {
        const message = {
          created_at: new Date().toISOString(),
          activity_id: assignActivityID,
          user_id: user?.id, // is sender
          message: text,
          media: "",
        };
        socket.send(JSON.stringify(message));
        setMessages((prev: any) => [...prev, message]);
        setMessage("");
      } else {
        enqueueSnackbar("Error in Connection", {
          variant: "error",
        });
      }
    } catch (error: any) {
      enqueueSnackbar("Error in Connection", {
        variant: "error",
      });
    }
  };

  return (
    <Box padding={"0 15px"}>
      <div className="sent__chat">
        <Typography className="form-title" margin="25px 10px">
          Start a conversation with your assignee here
        </Typography>
        <MessageBox
          messages={messages}
          fetchMessages={fetchMessages}
          assignData={assignData}
          meId={user?.id}
          isLoadingMoreChat={isLoadingMoreChat}
          isSubmittingAttachment={isSubmittingAttachment}
        />
        <Box position={"absolute"} bottom={"0"} width={"98%"}>
          <Grid item xs={12} height="100px" marginTop={"10px"}>
            <FormGroup className=" custom__textfield">
              {connected ? null : (
                <Typography
                  variant="caption"
                  sx={{ position: "absolute", color: "red", left: 4, top: -20 }}
                >
                  Please wait while connection is establised...
                </Typography>
              )}
              <textarea
                id="message"
                name="message"
                disabled={disabled || !connected}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                rows={5}
                style={{ height: "60px" }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    sendChatMessage({ text: message });
                  }
                }}
                //     error={Boolean(touched.message && errors.message)}
              />

              {!disabled && (
                <div className="send__attachments">
                  <div className="attachments__">
                    <AttachFileIcon onClick={() => setOpenMultiImage(true)} />
                  </div>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={message?.length < 1 && media.length < 1}
                    onClick={() => sendChatMessage({ text: message })}
                  >
                    Send
                  </Button>
                </div>
              )}
              <Grid item xs={7} display="none">
                <MultiUploader
                  setOpenMultiImage={setOpenMultiImage}
                  openMultiImage={openMultiImage}
                  getFileData={(files: [{ documents: any[]; title: string }]) => {
                    // here you get the selected files do what you want to accordingly
                    setMedia(files);
                    let mediaFiles = files?.[0]?.documents?.map((it: any) => it?.base64) || [];
                    if (mediaFiles.length) {
                      handleAttachmentMessage({ media: mediaFiles });
                    }
                  }}
                  initialData={media || []}
                  clearData={clearData}
                  setClearData={setClearData}
                  accept={{
                    "image/jpeg": [".jpeg", ".jpg"],
                    "image/png": [".png"],
                    "application/pdf": [".pdf"],
                    "application/csv": [".csv"],
                    "application/xlsx": [".xlsx"],
                  }}
                  maxFileSize={2}
                  requireDescription={false}
                />
              </Grid>
            </FormGroup>
          </Grid>
        </Box>
      </div>
    </Box>
  );
};

export default SendChat;
