import React, { useState } from "react";
import { textFieldStyle } from "../ChooseResponseType/ChooseResponseType";
import LocationIcon from "src/assets/template/icons/location_icon.svg";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ComponentWrapper from "src/modules/template/components/Wrapper";
import { Grid } from "@mui/material";

export default function Location({ dataItem }: any) {
  const [open, setOpen] = useState(false);

  const onClick = () => {
    setOpen(!open);
    // setSelectedInputId(responseTypeId);
    return;
  };

  return (
    <>
      <Grid container spacing={2} className="field__wrapper">
        <ComponentWrapper>
          <div
            className="fake_custom_select_field_wrapper"
            onClick={onClick}
            style={textFieldStyle}
          >
            <div className="fake_custom_select_field_input_type">
              <div className="select_icon_styling">
                <img src={LocationIcon} alt="Temperature" />
              </div>
              <div className="inner_field_component_styling_in_template">Location</div>
            </div>
            <div
              className="fake_custom_select_field_input_type_icon"
              style={{
                transform: open ? "rotate(90deg)" : "rotate(180deg)",
              }}
            >
              <KeyboardArrowUpIcon className="select_item_icon" />
            </div>
          </div>
        </ComponentWrapper>
      </Grid>
    </>
  );
}
