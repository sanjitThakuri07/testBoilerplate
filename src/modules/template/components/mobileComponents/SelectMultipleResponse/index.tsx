import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Box } from "@mui/material";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import ErrorComponent from "src/components/Error";
import { errorValue } from "src/modules/template/validation/inputLogicCheck";
import ExtraUserFields from "src/modules/template/components/mobileComponents/ReusableMobileComponent/ExtraUserFields";
import useApiOptionsStore from "src/store/zustand/templates/apiOptionsTemplateStore";

export default function SelectMultipleResponse({
  onChange,
  selectedValue,
  value,
  // options,
  item,
  errors,
  handleFormikFields,
  logic,
  className,
  flaggedValue,
  disabled,
  ...rest
}: // multipleResponseData,
// globalResponseData,
any) {
  const {
    multipleResponseData,

    internalResponseData: options,
    globalResponseData,
  }: any = useApiOptionsStore();

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(disabled);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  if (item?.response_choice === "multiple") {
    var multipleResponseItem = multipleResponseData?.find(
      (multipleResponseItem: any) => multipleResponseItem.id === item?.response_type,
    );
  }
  if (item?.response_choice === "global") {
    var globalResponseItem = globalResponseData?.find(
      (globalResponseItem: any) => globalResponseItem.id === item?.response_type,
    );
  }

  const getValue = () => {
    let VALUE =
      selectedValue || item?.response_choice === "multiple"
        ? multipleResponseItem?.options
            ?.map((item: any) => ({ ...item, value: item?.name }))
            .filter((list: any) => value?.includes(list.name))
        : item?.response_choice === "global"
        ? globalResponseItem?.options
            ?.map((item: any) => ({ ...item, value: item?.name }))
            .filter((list: any) => value?.includes(list.name))
        : "";

    return value;
  };

  return (
    <Box>
      <div className="mobile_component_box_wrapper_heading">{item.label}</div>
      <Select
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: "#f9fafb",
            primary: "#f9fafb",
          },
        })}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "8px",
            cursor: "pointer",
            borderColor: state.isFocused ? "#D0D5DD" : "#D0D5DD",
            "&:hover": {
              border: "1px solid #D0D5DD",
            },
          }),
          option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? "#000000" : "#475467",
            background: state.isSelected ? "#edeef0" : "#f9fafb",
          }),
        }}
        getOptionLabel={(e: any): any => (
          <div style={{ display: "flex", alignItems: "center" }}>
            {e.Icon && <img src={e.Icon} alt="img" />}
            <span style={{ marginLeft: 5 }}>{e?.name}</span>
          </div>
        )}
        // for styling
        isMulti={logic?.multipleSelection || false}
        isRtl={isRtl}
        className={`SelectResponseType ${className ? className : ""}`}
        classNamePrefix="select"
        placeholder="Select"
        onChange={onChange}
        isDisabled={disabled}
        value={getValue()}
        isLoading={isLoading}
        // clear the search items
        isClearable={isClearable}
        // searching through the options
        isSearchable={isSearchable}
        name="SelectResponseType"
        {...rest}
        // select options
        options={
          item?.response_choice === "multiple"
            ? multipleResponseItem?.options?.map((item: any) => ({ ...item, value: item?.name }))
            : item?.response_choice === "global"
            ? globalResponseItem?.options?.map((item: any) => ({ ...item, value: item?.name }))
            : []
        }
      />
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
    </Box>
  );
}
