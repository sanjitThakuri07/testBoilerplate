import React, { useState } from "react";
import Select, { components } from "react-select";
import { Box } from "@mui/material";

import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import "./ReactSelect.scss";
import { getAPI } from "src/lib/axios";
import { checkPermission } from "src/utils/permission";

const { Option } = components;

export default function ReactSelect({
  handleTypeSelect,
  selectedValue,
  options,
  onEdit,
  onDelete,
  value,
  isDisabled,
  isClearable,
  refetchFilterData,
  Options,
  permissions,
  permission,
}: any) {
  // const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  const [filterData, setFilterData] = useState<any>([]);
  // const statusOptions = [
  //   {
  //     value: 'online',
  //     label: 'Online SSASASA',
  //     icon: (
  //       <>
  //         <ModeEditOutlineOutlinedIcon
  //           onClick={onEdit}
  //           style={{
  //             height: '20px',
  //             width: '20px',
  //             cursor: 'pointer',
  //           }}
  //         />
  //         <DeleteOutlinedIcon
  //           onClick={onDelete}
  //           style={{
  //             height: '20px',
  //             width: '20px',
  //             marginLeft: '7px',
  //             cursor: 'pointer',
  //           }}
  //         />
  //       </>
  //     ),
  //   },
  //   {
  //     value: 'away',
  //     label: 'away',
  //     icon: (
  //       <>
  //         <ModeEditOutlineOutlinedIcon
  //           onClick={onEdit}
  //           style={{
  //             height: '20px',
  //             width: '20px',
  //             cursor: 'pointer',
  //           }}
  //         />
  //         <DeleteOutlinedIcon
  //           onClick={onDelete}
  //           style={{
  //             height: '20px',
  //             width: '20px',
  //             marginLeft: '7px',
  //             cursor: 'pointer',
  //           }}
  //         />
  //       </>
  //     ),
  //   },
  // ];

  // const iconsItems = [
  //   {
  //     icon: (
  //       <>
  //         <ModeEditOutlineOutlinedIcon
  //           onClick={onEdit}
  //           style={{
  //             height: '20px',
  //             width: '20px',
  //             cursor: 'pointer',
  //           }}
  //         />
  //         <DeleteOutlinedIcon
  //           onClick={onDelete}
  //           style={{
  //             height: '20px',
  //             width: '20px',
  //             marginLeft: '7px',
  //             cursor: 'pointer',
  //           }}
  //         />
  //       </>
  //     ),
  //   },
  // ];

  // const fetchFilterData = () => {
  //   let defaultValue = {
  //     value: null,
  //     label: 'Select Filter',
  //     icon: null,
  //   };

  //   getAPI(`calendar-filter/`)
  //     .then((res) => {
  //       if (res.status === 200) {
  //         let filterOptions = res?.data?.items?.map((item: any) => ({
  //           value: item.id,
  //           label: item.name,
  //           icon: (
  //             <DeleteOutlinedIcon
  //               onClick={() => onDelete(item.id)}
  //               style={{
  //                 height: '20px',
  //                 width: '20px',
  //                 marginLeft: '7px',
  //                 cursor: 'pointer',
  //               }}
  //             />
  //           ),
  //         }));
  //         setFilterData([defaultValue, ...filterOptions]);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err, 'err');
  //     });
  // };

  // console.log(filterData, 'filterData');

  // React.useEffect(() => {
  //   fetchFilterData();
  // }, [refetchFilterData]);

  // console.log(statusOptions, 'statusOptions');

  const customSingleValue = ({ data }: any) => (
    <div className="input-select" id="custom_react_select_css">
      <div className="input-select__single-value">
        <span style={{ marginLeft: "4px" }}>
          {data.label.length > 20 ? data.label.slice(0, 20) + "..." : data.label}
        </span>
      </div>
    </div>
  );
  const IconOption = (props: any) => (
    <>
      {checkPermission({
        permissions,
        permission: permission.view,
      }) ? (
        <Option {...props}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{props.label.length > 20 ? props.label.slice(0, 20) + "..." : props.label} </span>
            {checkPermission({
              permissions,
              permission: permission.delete,
            }) ? (
              <span>{props.data.icon}</span>
            ) : null}
          </div>
        </Option>
      ) : null}
    </>
  );

  const [presence, setPresence] = useState();

  const changeSelectHandler = (pres: any) => {
    setPresence(pres);
  };
  return (
    <>
      <div id="Custom_React_Select_BAS">
        <Select
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: "#33426a",
              zIndex: "999",
            },
          })}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              border: "2px solid #384874",
              borderRadius: "8px",
              zIndex: "999",
            }),
            menu: (base) => ({
              ...base,
              zIndex: "999",
            }),
          }}
          isRtl={isRtl}
          placeholder="Select Filter"
          // isClearable={isClearable}
          isSearchable={isSearchable}
          isDisabled={isDisabled}
          onChange={handleTypeSelect}
          value={value}
          defaultValue={Options[0]}
          // menuIsOpen={true}
          options={Options}
          components={{ SingleValue: customSingleValue, Option: IconOption }}
        />
      </div>
    </>
  );
}
