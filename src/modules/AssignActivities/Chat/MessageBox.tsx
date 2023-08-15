import { faAngleRight, faFileLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Box, Grid, Stack, Typography } from "@mui/material";
import FacebookCircularProgress from "src/components/CircularLoader";
import { useInspectionStore } from "src/modules/template/store/inspectionStore";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fileExtensions } from "src/utils/fileExtensionChecker";

const MessageItems = ({ creator, isSelf = false, message }: any) => {
  const dateTimeString = message?.created_at;
  let date = "";
  let time = "";
  let msgTime = "";

  const dateTime = new Date(dateTimeString);
  if (isNaN(dateTime.getTime())) {
    console.error("Invalid time value");
  } else {
    date = dateTime.toISOString().split("T")[0];
    time = dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (date === now.toISOString().split("T")[0]) {
      msgTime = "today";
    } else if (date === yesterday.toISOString().split("T")[0]) {
      msgTime = "yesterday";
    } else {
      msgTime = date;
    }
  }
  const FilePreview = ({ file }: any) => {
    let { fileOpen, fileType, isFile, isImage } = fileExtensions(file);
    if (isFile) {
      return (
        <a
          style={{ width: 140, height: 140 }}
          href={`${process.env.VITE_HOST_URL}/${file}`}
          target="_blank"
          rel="noreferrer"
        >
          <img
            style={{ objectFit: "cover", width: 140, height: 140, marginBottom: 10 }}
            src={fileOpen}
            alt={fileOpen}
          />
          <p
            style={{
              maxWidth: "330px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {file?.split("/")?.pop()}
          </p>
        </a>
      );
    }
    if (isImage) {
      return (
        <>
          <a
            style={{ width: 140, height: 140 }}
            href={`${process.env.VITE_HOST_URL}/${file}`}
            target="_blank"
            rel="noreferrer"
          >
            <img style={{ objectFit: "cover", width: 140, height: 140 }} src={fileOpen} alt="" />
          </a>
        </>
      );
    }

    return null;
  };

  return (
    <Grid
      container
      xs={12}
      columnGap={1.5}
      margin="10px 0"
      justifyContent={isSelf ? "flex-end" : "flex-start"}
      alignItems={isSelf ? "flex-end" : "flex-start"}
    >
      {!isSelf && (
        <Grid item xs={1} sx={{ maxWidth: "fit-content !important" }}>
          <Avatar
            alt="Example Alt"
            src={`${process.env.VITE_HOST_URL}/${message?.profile_picture}`}
          />
        </Grid>
      )}
      <Grid item xs={4} spacing={3}>
        <Grid display="flex" justifyContent={"space-between"}>
          <Typography component="span" color="primary" fontSize={14}>
            {/* {!isSelf ? message?.user : 'You'} */}
          </Typography>
          <Typography component="span" color="primary" fontSize={12} textTransform="capitalize">
            {msgTime} {time}
          </Typography>
        </Grid>
        <Grid display="flex" justifyContent={`${isSelf ? "flex-end" : "space-between"}`}>
          <Box
            component="span"
            sx={{ p: 1, backgroundColor: "#F2F4F7", borderRadius: "12px", lineHeight: "1" }}
          >
            <p>{message?.message}</p>
            {message?.media?.length ? (
              <p
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  maxWidth: 285,
                  flexWrap: "wrap",
                }}
              >
                {message?.media?.slice(0, 5).map((item: any) => (
                  <FilePreview file={item} />
                ))}
              </p>
            ) : null}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

const MessageBox = ({
  isLoadingMoreChat,
  isSubmittingAttachment,
  messages = [],
  fetchMessages,
  assignData = {},
  meId,
}: any) => {
  const dateTimeString = assignData?.created_at;
  let date = "";
  let time = "";
  let msgTime = "";

  const navigate = useNavigate();
  const getInspection = useInspectionStore((state: any) => state?.getInspection);
  const inspection = useInspectionStore((state: any) => state?.inspection);
  const messagesEndRef = useRef<any>(null);
  const overflowedElemRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   for (var i = 0; i < 5000; i++) {
  //     allItemsRef.current.push(<li key={i}>{i + 1} Item</li>);
  //   }
  //   setDisplayItems(allItemsRef.current.slice(0, 10));
  // }, []);

  const handleScroll = () => {
    if (!overflowedElemRef.current) return;
    // const scrolledToBottom =
    //   overflowedElemRef.current?.scrollTop + overflowedElemRef.current?.clientHeight >=
    //   overflowedElemRef.current?.scrollHeight;
    // if (scrolledToBottom) {
    //   console.log('scrolled to bottom');
    //   fetchMessages();
    // }

    const scrolledToTop = overflowedElemRef.current?.scrollTop === 0;
    if (scrolledToTop) {
      fetchMessages({ overflowElement: overflowedElemRef.current });
      console.log("scrolled to top");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages?.length]);

  const dateTime = new Date(dateTimeString);
  if (isNaN(dateTime.getTime())) {
    console.error("Invalid time value");
  } else {
    date = dateTime.toISOString().split("T")[0];
    time = dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (date === now.toISOString().split("T")[0]) {
      msgTime = "today";
    } else if (date === yesterday.toISOString().split("T")[0]) {
      msgTime = "yesterday";
    } else {
      msgTime = date;
    }
  }

  const date_ = new Date(inspection?.created_at);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  };
  const created_date = date_.toLocaleDateString("en-US", options);

  useEffect(() => {
    if (assignData?.inspection_id) {
      getInspection(assignData?.inspection_id);
    }
  }, [assignData?.inspection_id]);

  const uid = localStorage.getItem("uid");

  const creator = assignData?.created_by;
  return (
    <>
      <Grid margin="25px 10px" sx={{ color: "gray" }}>
        <Typography>{msgTime + " " + time}</Typography>
        <Typography>
          {" "}
          <Typography component="span" color="primary" fontWeight={700}>
            {creator}
          </Typography>{" "}
          created this activity
        </Typography>
        <hr
          style={{
            height: "0.5px",

            border: "none",
            width: "100%",
            backgroundColor: "#c6c2c2",
          }}
        />
      </Grid>
      <Grid position={"relative"} margin="15px 10px" height={"20rem"} paddingRight="5px">
        <Box
          overflow={"auto"}
          ref={overflowedElemRef}
          onScroll={handleScroll}
          className="custom__message_scrollbar"
          height={assignData?.inspection_id ? "70%" : "100%"}
        >
          {isLoadingMoreChat ? (
            <div>
              {" "}
              <FacebookCircularProgress />{" "}
            </div>
          ) : null}
          {messages?.map((message: any) => (
            <MessageItems
              key={message?.id}
              isSelf={String(message?.user_id) === String(meId)}
              creator={message?.user}
              date={date}
              message={message}
            />
          ))}
          {isSubmittingAttachment ? (
            <div style={{ marginBottom: 10 }}>
              {" "}
              <FacebookCircularProgress />{" "}
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </Box>
        {assignData?.inspection_id && (
          <Box
            position={"absolute"}
            bottom="0"
            left="50%"
            height={"28%"}
            sx={{
              transform: "translateX(-50%)",
              border: "1px solid silver !important",
              width: "50%",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            <Stack>
              <Typography margin={"4px 0"}>Linked Inspections</Typography>
              <Box
                padding={"5px"}
                borderRadius="4px"
                boxShadow=" rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px"
              >
                <Grid container>
                  <Grid
                    item
                    xs={10}
                    display="flex"
                    alignItems="center"
                    justifyContent="start"
                    gap="15px"
                  >
                    <div>
                      <FontAwesomeIcon icon={faFileLines} size="2x" />
                    </div>
                    <div>
                      <div>
                        {created_date}/ {inspection?.inspected_by || "NAME"}
                      </div>
                      <div>{inspection?.template}</div>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    textAlign="right"
                    alignSelf={"center"}
                    onClick={() =>
                      navigate({
                        pathname: `/inspections/view/${assignData?.inspection_id}`,
                        search: `?issue=${assignData?.id}`,
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faAngleRight} size="2x" />
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </Box>
        )}
      </Grid>
    </>
  );
};

export default MessageBox;
