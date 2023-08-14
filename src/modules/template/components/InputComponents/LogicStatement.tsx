import React, { SetStateAction, useState } from "react";
import {
  Box,
  Chip,
  Grid,
  Menu,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import DocumentNumberInput from "./DocumentNumberInput";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import AddIcon from "@mui/icons-material/Add";

interface LogicStatementI {
  statementOptions: string[];
  triggerActions: string[];
  setStatementLogic: React.Dispatch<SetStateAction<any>>;
  setLogicInput: React.Dispatch<SetStateAction<string>>;
  statementLogic: any;
  logicInput: any;
  setTriggerValue: any;
  triggerValue: any;
}

export default function LogicStatement({
  statementOptions,
  triggerActions,
  setStatementLogic,
  setLogicInput,
  statementLogic,
  logicInput,
  setTriggerValue,
  triggerValue,
}: LogicStatementI) {
  const [anchorElIsAnswerLogic, setAnchorElIsAnswerLogic] =
    React.useState<null | HTMLElement>(null);
  const [anchorElTrigger, setAnchorElTrigger] =
    React.useState<null | HTMLElement>(null);

  const [blankChip, setBlankChip] = React.useState<boolean>(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenuTrigger = Boolean(anchorElTrigger);

  const openMenuIsAnswerLogic = Boolean(anchorElIsAnswerLogic);

  const handleMenuClickIsAnswerLogic = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorElIsAnswerLogic(event.currentTarget);
  };

  const handleMenuCloseIsAnswerLogic = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLLIElement;
    setAnchorElIsAnswerLogic(null);
    setStatementLogic(target.innerText);
  };

  const handleMenuCloseAction = () => {
    setAnchorEl(null);
  };

  const handleMenuClickTrigger = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTrigger(event.currentTarget);
  };

  const handleMenuCloseTrigger = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLLIElement;
    if (triggerValue.includes(target.innerText)) {
      setTriggerValue([...triggerValue]);
    } else {
      setTriggerValue([...triggerValue, target.innerText]);
    }
    setAnchorElTrigger(null);
  };

  // props
  let logicFormat = "Celcius";
  let prefixContent = "If Temperature is";
  let postFixContent = "then";

  return (
    <>
      <div>
        <Grid
          item
          xs={12}
          sx={{
            backgroundColor: "#F4F6FA;",
            marginLeft: "30px",
            marginTop: "10px",
            padding: "10px",
          }}
        >
          <div className="text_answer_add_logic">
            <div className="text_answer_add_logic_inner">
              {prefixContent}
              <Chip
                label={statementLogic}
                onClick={handleMenuClickIsAnswerLogic}
                size="small"
                sx={{
                  marginRight: "6px",
                  marginLeft: "8px",
                  borderRadius: "5px",
                }}
                deleteIcon={<DriveFileRenameOutlineIcon />}
                variant="outlined"
              />
              {blankChip ? (
                <Chip
                  label={logicInput}
                  size="small"
                  sx={{
                    marginRight: "10px",
                    marginLeft: "5px",
                    borderRadius: "5px",
                  }}
                  onDelete={() => setBlankChip(false)}
                  deleteIcon={<DriveFileRenameOutlineIcon />}
                  variant="outlined"
                />
              ) : (
                <TextField
                  variant="standard"
                  autoFocus
                  value={logicInput}
                  sx={{
                    backgroundColor: "#f9fafb",
                    height: "25px",
                    marginRight: "10px",
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  onChange={(event) => setLogicInput(event.target.value)}
                  onBlur={(event) => setBlankChip(true)}
                />
              )}
              k, {postFixContent}
              <div className="trigger_value">
                {triggerValue.length > 0
                  ? triggerValue.map((item: any, index: number) => {
                      return (
                        <Chip
                          label={item}
                          size="small"
                          sx={{
                            border: "none",
                            marginLeft: "5px",
                            transform: "scale(0.9)",
                            backgroundColor: "#FFFAEB",
                            color: "#B14608",
                          }}
                          variant="outlined"
                          onDelete={() => {
                            const newTriggerValue = triggerValue.filter(
                              (item: any, i: number) => i !== index
                            );
                            setTriggerValue(newTriggerValue);
                          }}
                        />
                      );
                    })
                  : ""}
              </div>
              <AddIcon
                sx={{
                  fontSize: "17px",
                  marginLeft: "5px",
                }}
              />{" "}
              <span onClick={handleMenuClickTrigger}>Trigger</span>
            </div>

            {/* logic menu */}
            <Menu
              id="format-positioned-menu"
              aria-labelledby="format-positioned-button"
              anchorEl={anchorElIsAnswerLogic}
              open={openMenuIsAnswerLogic}
              sx={{ marginTop: "23px" }}
              onClose={handleMenuCloseAction}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {statementOptions.map((stat, index) => {
                return (
                  <MenuItem onClick={handleMenuCloseIsAnswerLogic} key={index}>
                    {stat}
                  </MenuItem>
                );
              })}
            </Menu>

            {/* trigger actions */}
            <Menu
              id="format-positioned-menu"
              aria-labelledby="format-positioned-button"
              anchorEl={anchorElTrigger}
              open={openMenuTrigger}
              sx={{ marginTop: "23px" }}
              onClose={handleMenuCloseAction}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              {triggerActions?.map((trigger, index) => {
                return (
                  <MenuItem onClick={handleMenuCloseTrigger} key={index}>
                    {trigger}
                  </MenuItem>
                );
              })}
            </Menu>
          </div>
        </Grid>
      </div>
    </>
  );
}
