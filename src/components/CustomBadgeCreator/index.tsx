import React from "react";
import { converText } from "containers/table/BASDataTable";
import { Tooltip } from "@material-ui/core";

export const RadioOptions: any = {
  Accepted: {
    id: 1,
    value: "High",
    backgroundColor: "#ECFDF3",
    textColor: "#027A48",
    dotColor: "#12B76A",
    label: "High",
  },
  Paid: {
    id: 5,
    value: "High",
    backgroundColor: "#ECFDF3",
    textColor: "#027A48",
    dotColor: "#12B76A",
    label: "High",
  },
  Pending: {
    id: 2,
    value: "Medium",
    backgroundColor: "#FFFAEB",
    textColor: "#B54708",
    dotColor: "#F79009",
    label: "Medium",
  },
  Overdue: {
    id: 3,
    value: "Low",
    backgroundColor: "#FEF3F2",
    textColor: "#B42318",
    dotColor: "#F04438",
    label: "Low",
  },
  Draft: {
    id: 4,
    value: "N/A",
    backgroundColor: "#F2F4F7",
    textColor: "#344054",
    dotColor: "#667085",
    label: "N/A",
  },
  Active: {
    id: 5,
    value: "Active",
    backgroundColor: "#ECFDF3",
    textColor: "#027A48",
    dotColor: "#12b76a",
    label: "Active",
  },
  Inactive: {
    id: 6,
    value: "Inactive",
    backgroundColor: "#f2f4f7",
    textColor: "#344054",
    dotColor: "#667085",
    label: "Inactive",
  },
  OutlineActive: {
    backgroundColor: "transparent",
    textColor: "#027A48",
    outline: "1px solid #039855",
    dotColor: "#039855",
  },
  OutlineInactive: {
    backgroundColor: "transparent",
    textColor: "#344054",
    outline: "1px solid #344054",
    dotColor: "#667085",
  },
  // default: {
  //   backgroundColor: 'transparent',
  //   textColor: '#344054',
  //   outline: '1px solid #344054',
  //   dotColor: '#667085',
  //   border: '1px solid #667085',
  // },
};

const Index = ({ value, styleChoice, badgeStyle = {}, dotStyle = {} }: any) => {
  return (
    <div
      style={{
        display: "inline-block",
        backgroundColor: RadioOptions?.[`${styleChoice}`]?.backgroundColor,
        padding: "5px 12px",
        paddingLeft: "30px",
        borderRadius: "20px",
        position: "relative",
        color: RadioOptions?.[`${styleChoice}`]?.textColor,
        outline: RadioOptions?.[`${styleChoice}`]?.outline || "none",
        ...badgeStyle,
      }}
      className="badge__creator"
    >
      <span style={{ background: RadioOptions?.[`${styleChoice}`]?.dotColor, ...dotStyle }}></span>
      {value}
    </div>
  );
};

export const CustomChipComponent = ({ value, ...attr }: any) => {
  // const {} =attr;
  let { color_code } = attr;

  return (
    <>
      <Tooltip title={value} placement="top" arrow>
        <div
          style={{
            display: "inline-block",
            background: "transparent",
            padding: "8px 12px",
            paddingLeft: "30px",
            borderRadius: "20px",
            position: "relative",
            // color: color_code || '#000',
            color: color_code === "#FFFFFF" ? "#b0adad" : color_code || "#000",
            border: "1px solid #bdbdbd",
          }}
          className="badge__creator"
        >
          <span
            style={{
              // background: color_code || 'red',
              background: color_code === "#FFFFFF" ? "#b0adad" : color_code || "red",
            }}
          ></span>

          {converText(value)}
        </div>
      </Tooltip>
    </>
  );
};

export default Index;
