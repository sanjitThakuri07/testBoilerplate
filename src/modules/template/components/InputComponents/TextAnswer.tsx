import { useTextAnswer } from "src/store/zustand/globalStates/templates/TextAnswer";
import { Menu, MenuItem } from "@mui/material";
import React, { MouseEvent } from "react";

import TextAnswerIcon from "src/assets/template/icons/Text_answer.png";
import { useTemplateFieldsStore } from "containers/template/store/templateFieldsStore";
import { BodyWrapper } from "containers/template/components/Wrapper";
import { ArrowDropDown, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

type TextAnswerProps = {
  responseTypeId?: any;
  dataItem?: any;
};

const TextAnswer = ({ dataItem, questionLogicShow }: any) => {
  const updateTemplateDatasets = useTemplateFieldsStore(
    (state: any) => state.updateTemplateDatasets,
  );
  const { selectedDataset } = useTemplateFieldsStore();
  const [open, setOpen] = React.useState<boolean>(false);
  const [textAnswerFormat, setTextAnswerFormat] = React.useState<string>("Short Answer");
  const [isAddLogicClicked, setIsAddLogicClicked] = React.useState<boolean>(false);

  const [triggerValue, setTriggerValue] = React.useState<string[]>([]);

  const [isAnswerLogic, setIsAnswerLogic] = React.useState<string>("is");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElIsAnswerLogic, setAnchorElIsAnswerLogic] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElTrigger, setAnchorElTrigger] = React.useState<null | HTMLElement>(null);

  const { setRightSectionTabValue, selectedInputType, setSelectedInputId } = useTextAnswer();

  const openMenu = Boolean(anchorEl);
  const openMenuIsAnswerLogic = Boolean(anchorElIsAnswerLogic);
  const openMenuTrigger = Boolean(anchorElTrigger);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClickIsAnswerLogic = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElIsAnswerLogic(event.currentTarget);
  };

  const handleMenuClickTrigger = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElTrigger(event.currentTarget);
  };

  const handleMenuClose = (e: MouseEvent<HTMLLIElement>, value: string) => {
    const target = e.target as HTMLLIElement;
    setAnchorEl(null);
    setTextAnswerFormat(value === "text_area" ? "Paragraph" : "Short Answer");
    updateTemplateDatasets(dataItem, "variables", {
      ...dataItem.variables,
      format: value,
    });
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
    // setSelectedInputId(responseTypeId);

    return;
  };

  const triggerActions = ["Require Action", "Require Evidence", "Notify", "Ask Question"];

  return {
    body: (
      <>
        {questionLogicShow?.getActiveLogicQuestion()?.includes(dataItem.id) ? (
          <BodyWrapper className="field__wrapper">
            <div className="question__answer-type">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>Format:</span>
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={(event) => handleMenuClick(event)}
                >
                  <span
                    id="format-positioned-button"
                    aria-controls={open ? "format-positioned-menu" : undefined}
                    aria-haspopup="true"
                    className={"custom__options-2"}
                    aria-expanded={open ? "true" : undefined}
                    style={{
                      textDecoration: "underline",
                      fontSize: "0.65rem !important",
                      marginLeft: "0.35rem",
                      color: "#2E7EC7",
                    }}
                  >
                    {textAnswerFormat}
                  </span>
                  {!anchorEl ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
                </div>
              </div>
              <Menu
                id="format-positioned-menu"
                aria-labelledby="format-positioned-button"
                anchorEl={anchorEl}
                open={openMenu}
                sx={{ marginTop: "23px" }}
                onClose={handleMenuCloseAction}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                className={"custom__options-2"}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={(e) => handleMenuClose(e, "text")} value="text">
                  Short Answer
                </MenuItem>
                <MenuItem onClick={(e) => handleMenuClose(e, "text_area")} value="text_area">
                  Paragraph
                </MenuItem>
              </Menu>
            </div>
          </BodyWrapper>
        ) : (
          <></>
        )}
      </>
    ),
    label: (
      <div className="response__label-block" onClick={onClick}>
        <div>
          <div className="select_icon_styling">
            <img src={TextAnswerIcon} alt="Text answer" />
          </div>
          <div className="inner_field_component_styling_in_template">Text Answer</div>
        </div>
        <div className="fake_custom_select_field_input_type_icon">
          {/* <KeyboardArrowUpIcon className="select_item_icon" /> */}
        </div>
      </div>
    ),
  };
};

export default TextAnswer;
