import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Box } from "@mui/material";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import { useTemplateFieldsStore } from "containers/template/store/templateFieldsStore";
import ErrorComponent from "src/components/Error";
import { errorValue } from "containers/template/validation/inputLogicCheck";
import ExtraUserFields from "containers/template/components/mobileComponents/ReusableMobileComponent/ExtraUserFields";
import { getValue } from "@testing-library/user-event/dist/utils";
import useApiOptionsStore from "containers/template/store/apiOptionsTemplateStore";
import { possibleFnR, url } from "src/utils/url";
import TodoComponent from "./TodoComponent";

function fetchRightApi({ value, item, fetchInternalResponseData }: any) {
  item?.filterFields?.map(async (relatedFieldAPi: any) => {
    let seperateField = relatedFieldAPi?.split("=>");
    await fetchInternalResponseData?.({
      url: url?.[seperateField?.[1]],
      queryParam: { id: value },
      key: relatedFieldAPi,
      replace: false,
    });
  });
}

const objectMap: any = {
  ["FindingsMainCategoryFindingsRecommendations"]: "recommendations",
  ["FindingsMainCategoryFindings"]: "findings",
  ["FindingsSubCategoryFindings"]: "findings",
  ["FindingRecommendationSubCategory"]: "sub category",
  ["FindingsSubCategoryFindingsRecommendations"]: "recommendations",
};

export default function SelectInternalResponse({
  handleTypeSelect,
  selectedValue,
  // options,
  apiItem,
  item,
  logic,
  errors,
  handleFormikFields,
  onChange,
  value,
  disabled,
  dataSetSeperator,
  ...rest
}: any) {
  const { internalResponseData: options, fetchInternalResponseData }: any = useApiOptionsStore();

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  // console.log(value, 'VADKLSJFN');
  function getFNROptions() {
    let opt = [];
    switch (fieldOf) {
      case "main-category":
        opt = options?.[`${item?.response_type}`];
        break;

      default:
        opt = options?.[item?.linkFieldId] || [];
        break;
    }
    return opt;
  }

  function getValue() {
    const data = options?.[`${item?.response_type}`]?.filter((it: any) =>
      value?.some((val: any) => val?.id === it?.id),
    );

    return data;
  }
  function getFnRValue() {
    let url = "";
    switch (fieldOf) {
      case "main-category":
        url = `${item?.response_type}`;
        break;

      default:
        url = `${item?.linkFieldId}`;
        break;
    }
    const data = options?.[`${url}`]?.filter((it: any) =>
      value?.some((val: any) => val?.id === it?.id),
    );

    return data;
  }

  const fieldOf =
    logic?.logicApi?.url ||
    logic?.logicApi?.options
      ?.split("/")
      .reverse()
      ?.filter((field: any) => Boolean(field))?.[0];

  const keys = Object?.keys(options || {});

  // if main category => fetch category (sub)
  // if sub fetch findings =>
  // if findings => fetch recommendations

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
            {/* <span style={{ marginLeft: 5 }}>{e?.[`${apiItem?.field}`] || e?.name}</span> */}
            <span style={{ marginLeft: 5 }}>
              {e?.[logic?.logicApi?.field || "name"] || e?.name}
            </span>
          </div>
        )}
        getOptionValue={(e: any): any => (
          <div style={{ display: "flex", alignItems: "center" }}>
            {e.Icon && <img src={e.Icon} alt="img" />}
            {/* <span style={{ marginLeft: 5 }}>{e?.[`${apiItem?.field}`] || e?.name}</span> */}
            <span style={{ marginLeft: 5 }}>
              {e?.[logic?.logicApi?.field || "name"] || e?.name}
            </span>
          </div>
        )}
        // for styling
        isMulti={logic?.multipleSelection || false}
        isRtl={isRtl}
        className="SelectResponseType"
        classNamePrefix="select"
        placeholder="Select"
        onChange={async (e: any) => {
          onChange(e, apiItem?.field);
          let value = Array.isArray(e)
            ? e?.map((data: any) => data?.id).filter((data: any) => Boolean(data))
            : [e]?.filter((data: any) => Boolean(data)).map((data: any) => data?.id);

          fetchRightApi({ value: value, item, fetchInternalResponseData });
        }}
        isDisabled={disabled}
        value={possibleFnR?.includes(fieldOf) ? getFnRValue() : getValue()}
        isLoading={isLoading}
        // clear the search items
        isClearable={isClearable}
        // searching through the options
        isSearchable={isSearchable}
        name="SelectResponseType"
        {...rest}
        // select options
        options={
          possibleFnR?.includes(fieldOf) ? getFNROptions() : options?.[`${item?.response_type}`]
        }
        // onBlur={handleFormikFields?.validateForm}
      />
      {(() => {
        let data = item?.linkFieldId?.split("=>")?.reverse()?.[0];
        let titleName = data?.length ? objectMap?.[data] : item?.formValuesLink ? "category" : "";
        let filterOptionValue = possibleFnR?.includes(fieldOf)
          ? getFNROptions()
          : options?.[`${item?.response_type}`];
        let valuess = Array.isArray(item?.value)
          ? item?.value?.filter((data: any) => data?.type)
          : [];
        return (
          <>
            {titleName ? (
              <TodoComponent
                title={titleName}
                setFieldValue={handleFormikFields?.setFieldValue}
                getValue={(data: any) => {}}
                item={item}
                value={value || []}
                values={valuess}
                dynamicField={item?.logicApi?.field || "name"}
              />
            ) : (
              <></>
            )}
          </>
        );
      })()}
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
