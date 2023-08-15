import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Box } from "@mui/material";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import { useTemplateFieldsStore } from "src/modules/template/store/templateFieldsStore";
import ErrorComponent from "src/components/Error";
import { errorValue } from "src/modules/template/validation/inputLogicCheck";
import ExtraUserFields from "src/modules/template/components/mobileComponents/ReusableMobileComponent/ExtraUserFields";
import { getValue } from "@testing-library/user-event/dist/utils";

export default function SelectExternalResponse({
  handleTypeSelect,
  selectedValue,
  options,
  apiItem,
  item,
  logic,
  errors,
  handleFormikFields,
  onChange,
  value,
  disabled,
}: any) {
  // console.log(item, 'itemlskdf');
  console.log(options, "optionsds dfsdf");
  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  const { updateTemplateDatasets, templateDatasets } = useTemplateFieldsStore();

  const [externalOptions, setExternalOptions] = React.useState<any>([]);
  // const handleExternalOptions = async () => {
  //   await fetchApI({
  //     setterFunction: (data: any) => {
  //       if (data?.length) {
  //         const opt = data?.map((item: any) => ({
  //           ...item,
  //           value: item?.[`${apiItem?.field}`] || item?.name,
  //         }));
  //         // console.log({ opt }, { data });
  //         setExternalOptions(opt);
  //         updateTemplateDatasets(item, 'type', 'Array');
  //         if (logic) {
  //           updateTemplateDatasets(
  //             logic,
  //             'logicOptions',
  //             data?.map((it: any) => it?.[`${apiItem?.field}`] || it?.name),
  //           );
  //           updateTemplateDatasets(logic, 'selectField', true);
  //         }
  //       }
  //     },
  //     // url: 'config/country',
  //     url: apiItem.options,
  //     replace: true,
  //   });
  // };

  // // selected data set
  // // update logicOptions =>

  // useEffect(() => {
  //   handleExternalOptions();
  // }, [apiItem]);

  function getValue() {
    const data = options?.[`${item?.response_type}`]?.filter((it: any) =>
      value?.includes(it?.[apiItem?.field]),
    );
    return data;
  }

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
        getOptionLabel={(e): any => (
          <div style={{ display: "flex", alignItems: "center" }}>
            {e.Icon && <img src={e.Icon} alt="img" />}
            {/* <span style={{ marginLeft: 5 }}>{e[`${apiItem.field}`]}</span> */}
            <span style={{ marginLeft: 5 }}>{e?.[`${apiItem?.field}`] || e?.name}</span>
          </div>
        )}
        // for styling
        isMulti={logic?.multipleSelection || false}
        isRtl={isRtl}
        className="SelectResponseType"
        classNamePrefix="select"
        placeholder="Select"
        onChange={(e: any) => {
          onChange(e, apiItem?.field);
        }}
        isDisabled={disabled}
        value={getValue()}
        isLoading={isLoading}
        // clear the search items
        isClearable={isClearable}
        // searching through the options
        isSearchable={isSearchable}
        name="SelectResponseType"
        // select options
        options={options?.[`${item?.response_type}`]}
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
