import { useTextAnswer } from "src/store/zustand/globalStates/templates/TextAnswer";
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { FC, MouseEvent, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import AddIcon from "@mui/icons-material/Add";
import ModalLayout from "components/ModalLayout";
import { useTemplateFieldsStore } from "containers/template/store/templateFieldsStore";
import InspectionDateIcon from "assets/template/icons/inspectionDate.png";
import { CheckBox } from "@mui/icons-material";
import ComponentWrapper, {
  LabelWrapper,
  BodyWrapper,
} from "containers/template/components/Wrapper";

type InspectionDateProps = {
  responseTypeId?: any;
  dataItem?: any;
};

const InspectionDate = ({ responseTypeId, dataItem }: any) => {
  const updateTemplateDatasets = useTemplateFieldsStore(
    (state: any) => state.updateTemplateDatasets,
  );
  const { selectedDataset } = useTemplateFieldsStore();

  const [open, setOpen] = React.useState<boolean>(false);
  const [isAddLogicClicked, setIsAddLogicClicked] = React.useState<boolean>(false);

  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const [blankChip, setBlankChip] = React.useState<boolean>(true);
  const [blankValue, setBlankValue] = React.useState<string>("Blank");

  const [triggerValue, setTriggerValue] = React.useState<string[]>([]);

  const [isAnswerLogic, setIsAnswerLogic] = React.useState<string>("is");
  const [autoGeneratedNumber, setAutoGeneratedNumber] = React.useState<string>("");

  const [isRequiredDate, setIsRequiredDate] = React.useState<boolean>(
    dataItem?.variables?.date || false,
  );
  const [isRequiredTime, setIsRequiredTime] = React.useState<boolean>(
    dataItem?.variables?.time || false,
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElIsAnswerLogic, setAnchorElIsAnswerLogic] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElTrigger, setAnchorElTrigger] = React.useState<null | HTMLElement>(null);

  const { setRightSectionTabValue, selectedInputType, setSelectedInputId } = useTextAnswer();

  const openMenu = Boolean(anchorEl);
  const openMenuIsAnswerLogic = Boolean(anchorElIsAnswerLogic);
  const openMenuTrigger = Boolean(anchorElTrigger);

  const handleMenuClickIsAnswerLogic = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElIsAnswerLogic(event.currentTarget);
  };

  const handleMenuClickTrigger = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTrigger(event.currentTarget);
  };

  const handleMenuCloseIsAnswerLogic = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLLIElement;
    setAnchorElIsAnswerLogic(null);
    setIsAnswerLogic(target.innerText);
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

  const handleMenuCloseAction = () => {
    setAnchorEl(null);
  };

  const onClick = () => {
    setRightSectionTabValue("2");
    setOpen(!open);
    setSelectedInputId(responseTypeId);

    return;
  };

  const triggerActions = ["Require Action", "Require Evidence", "Notify", "Ask Question"];

  return {
    body: (
      <>
        <Grid container spacing={2} className="field__wrapper">
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRequiredDate}
                  onChange={(e) => {
                    let checked = e.target.checked;
                    setIsRequiredDate(checked);
                    updateTemplateDatasets(dataItem, "variables", {
                      ...dataItem.variables,
                      date: checked,
                      time: isRequiredTime,
                    });
                  }}
                  value={isRequiredDate}
                />
              }
              label="Date"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRequiredTime}
                  onChange={(e) => {
                    let checked = e.target.checked;
                    setIsRequiredTime(checked);
                    updateTemplateDatasets(dataItem, "variables", {
                      ...dataItem.variables,
                      date: isRequiredDate,
                      time: checked,
                    });
                  }}
                  value={isRequiredTime}
                />
              }
              label="Time"
            />
          </Grid>

          {isAddLogicClicked && (
            <Grid
              item
              xs={12}
              sx={{
                backgroundColor: "#F4F6FA;",
                paddingBottom: "15px",
                marginLeft: "30px",
                marginTop: "10px",
              }}
            >
              <div className="text_answer_add_logic">
                <div className="text_answer_add_logic_inner">
                  If the answer
                  <Chip
                    label={isAnswerLogic}
                    onClick={handleMenuClickIsAnswerLogic}
                    size="small"
                    sx={{ marginRight: "6px", marginLeft: "8px", borderRadius: "5px" }}
                    deleteIcon={<DriveFileRenameOutlineIcon />}
                    variant="outlined"
                  />
                  {blankChip ? (
                    <Chip
                      label={blankValue}
                      size="small"
                      sx={{ marginRight: "10px", marginLeft: "5px", borderRadius: "5px" }}
                      onDelete={() => setBlankChip(false)}
                      deleteIcon={<DriveFileRenameOutlineIcon />}
                      variant="outlined"
                    />
                  ) : (
                    <TextField
                      variant="standard"
                      autoFocus
                      value={blankValue}
                      sx={{ backgroundColor: "#f9fafb", height: "25px", marginRight: "10px" }}
                      InputProps={{
                        disableUnderline: true,
                      }}
                      onChange={(event) => setBlankValue(event.target.value)}
                      onBlur={(event) => setBlankChip(true)}
                    />
                  )}
                  then{" "}
                  <div className="trigger_value">
                    {triggerValue.length > 0
                      ? triggerValue.map((item, index) => {
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
                                  (item, i) => i !== index,
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
                  <MenuItem onClick={handleMenuCloseIsAnswerLogic}>is</MenuItem>
                  <MenuItem onClick={handleMenuCloseIsAnswerLogic}>is not</MenuItem>
                </Menu>

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
                  {triggerActions.map((item, index) => {
                    return (
                      <MenuItem onClick={handleMenuCloseTrigger} key={index}>
                        {item}
                      </MenuItem>
                    );
                  })}
                </Menu>
              </div>
            </Grid>
          )}
        </Grid>

        <ModalLayout
          id="MCRModal"
          children={
            <>
              <div className="config_modal_form_css user__department-field">
                <div className="config_modal_heading">
                  <div className="config_modal_title">InspectionDate</div>
                  <div className="config_modal_text">
                    <div>You can define the range with the slider.</div>
                  </div>
                  <Divider />
                  <div
                    className="document_number_format"
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    <div className="document_number_format_heading">Increment</div>
                  </div>
                  <br />

                  <div
                    className="document_number_format"
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    <div className="document_number_format_heading">Range</div>
                  </div>

                  <div
                    className="document_number_format_footer"
                    style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}
                  >
                    <Button
                      variant="outlined"
                      className="buttonContainer"
                      // onClick={() => setOpenModal(false)}
                    >
                      Reset All
                    </Button>
                  </div>
                </div>
              </div>
            </>
          }
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      </>
    ),
    label: <LabelWrapper img={InspectionDateIcon} title="Inspection Date" />,
  };
};

export default InspectionDate;
