import { Box, Button, Grid, Stack, Tab, Tabs } from "@mui/material";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TemplateHeading from "./TemplateHeading/TemplateHeading";
import useUndoRedo from "src/hooks/useUndoRedo";
import { useTemplateFieldsStore } from "src/store/zustand/templates/templateFieldsStore";

const TemplateTopbar = ({ formikBag, isTab = false, tabValues = {} }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentState, setNewState, undo, redo] = useUndoRedo("");
  const { currentStateIndex, pastStates } = useTemplateFieldsStore();

  return (
    <div id="TemplateTopbar">
      <Grid container spacing={2} padding="0 15px" alignItems={"center !important"}>
        <Grid item xs={isTab ? 4 : 8} borderRight={!isTab ? "1px solid silver" : ""}>
          <TemplateHeading formikBag={formikBag} isTab={isTab} />
        </Grid>
        {isTab && (
          <Grid item xs={4} borderRight={isTab ? "1px solid silver" : ""}>
            <Stack mt={3} direction="row" alignItems="center" className="CUSTOM_TABS">
              {tabValues?.tabsName?.map((tab: any, i: number) => {
                return (
                  <Button
                    key={i}
                    className={tabValues.value == tab.value ? "active" : ""}
                    onClick={() => tabValues?.handleChange(tab.value)}
                  >
                    {tab?.label}
                  </Button>
                );
              })}
            </Stack>
          </Grid>
        )}

        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div></div>
          <div>
            <Button
              variant="outlined"
              color="primary"
              onClick={undo}
              disabled={!(currentStateIndex > 0)}
            >
              Undo
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{ marginLeft: "10px" }}
              onClick={redo}
              disabled={!(currentStateIndex < pastStates.length - 1)}
            >
              Redo
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default TemplateTopbar;
