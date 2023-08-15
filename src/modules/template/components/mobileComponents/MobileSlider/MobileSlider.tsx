import React from "react";
import { Slider } from "@mui/material";

import ErrorComponent from "src/components/Error";
import { errorValue } from "src/modules/template/validation/inputLogicCheck";
import ExtraUserFields from "src/modules/template/components/mobileComponents/ReusableMobileComponent/ExtraUserFields";

export const RangeSlider = () => {
  const [value, setValue] = React.useState<number[]>([20, 37]);

  function valuetext(value: number) {
    return `${value}`;
  }

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  return (
    <div id="RangeSlider">
      <Slider
        getAriaLabel={() => "Range slider"}
        value={value}
        style={{ width: "93%" }}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
      />
    </div>
  );
};

const MobileSlider = ({
  item,
  onChange,
  value,
  errors,
  handleFormikFields,
  disabled,
  ...attr
}: any) => {
  function valuetext(value: number) {
    return `${value}`;
  }

  return (
    <div id="MobileSlider">
      <div className="mobile_component_box_wrapper_heading">{item.label}</div>
      {
        <Slider
          aria-label="Slider"
          // defaultValue={1}
          style={{ width: "100%" }}
          getAriaValueText={valuetext}
          valueLabelDisplay="auto"
          step={Number(item?.variables?.step)}
          min={Number(item?.variables?.min_value)}
          max={Number(item?.variables?.max_value)}
          value={value ? value : ""}
          defaultValue={1}
          onChange={onChange}
          {...attr}
        />
      }
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>{item?.variables?.min_value}</div>
        <div>{item?.variables?.slider_value}</div>
        <div>{item?.variables?.max_value}</div>
      </div>
      <>
        {errors &&
          errorValue?.map((err: any) => {
            return Object?.keys(errors || [])?.includes(err) ? (
              <ErrorComponent>{errors?.[err]}</ErrorComponent>
            ) : (
              <></>
            );
          })}
      </>
      <div>
        <ExtraUserFields item={item} handleFormikFields={handleFormikFields} disabled={disabled} />
      </div>
    </div>
  );
};

export default MobileSlider;
