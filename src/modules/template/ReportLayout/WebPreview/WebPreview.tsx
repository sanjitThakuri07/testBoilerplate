import React from "react";
import { Box, CircularProgress, Grid, Stack } from "@mui/material";
import Disclaimer from "../Components/Disclaimer";
import FlaggedItems from "../Components/FlaggedItems";
import Overview from "../Components/Overview";
import Actions from "../Components/Actions";

const WebPreview = ({ layoutObj, layoutParams, layoutObjLoader }: any) => {
  return (
    <>
      {layoutParams && layoutObjLoader && (
        <Grid item xs={9}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
            height={"100%"}
            sx={{ mt: 4 }}
          >
            <Box>Loading</Box>
            <CircularProgress style={{ color: "#283352" }} size={25} />
          </Stack>
        </Grid>
      )}

      <Box>
        {!layoutParams && (
          <Stack
            alignItems="center"
            justifyContent="center"
            height="30vh"
            direction="column"
            spacing={1}
          >
            <Box>
              <img src="/assets/icons/icon-feature.svg" alt="warning" />
            </Box>
            <Box>
              Please select your layout from left panel to load your layout
              datas
            </Box>
          </Stack>
        )}
        {layoutParams && !layoutObjLoader && (
          <>
            <Box p={1}>
              <Overview
                badgeContent={{ value: "Incomplete", status: "Pending" }}
                layoutObj={layoutObj}
                layoutParams={layoutParams}
              />
            </Box>
            <Box p={1}>
              <Disclaimer layoutObj={layoutObj} />
            </Box>
            <Box p={1}>
              <FlaggedItems layoutObj={layoutObj} />
            </Box>
            <Actions layoutObj={layoutObj} />
          </>
        )}
      </Box>
    </>
  );
};

export default WebPreview;
