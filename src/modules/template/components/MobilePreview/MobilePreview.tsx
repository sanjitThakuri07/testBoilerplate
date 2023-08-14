import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import "./MobilePreview.scss";
import ScreenPreview from "src/assets/images/mobilePreview.svg";
import IpadPreview from "assets/template/icons/Ipad.png";
import IpadPro from "assets/template/icons/ipadpro.png";

import SmallScreenTabOpt from "./SmallScreenPreviewComp/MobileTabOption";
import { screenOptions } from "./SmallScreenPreviewComp/MobileTabOption";

interface MobilePreviewProps {
  children?: React.ReactNode;
}

const introText = (device: string) => {
  return (
    <>
      This is the {device} Preview (A view of the queries while conducting the inspection) of the
      template created by you. All the changes made in the template preview will be visible in the{" "}
      <span style={{ textTransform: "lowercase" }}>{device} </span>
      preview
    </>
  );
};

export const IphoneComp = ({ children, deviceType }: any) => {
  const SelectImage =
    deviceType === "iphone"
      ? ScreenPreview
      : deviceType?.toUpperCase() === "IPAD"
      ? IpadPro
      : ScreenPreview;

  return (
    <div className={`mobile_screen ${deviceType}`}>
      <div className="mobile__picture">
        <img src={SelectImage} alt={`${deviceType} preview`} />
      </div>
      <div className="inside_mobile_container">
        <div className="inside_mobile_container_wrapper">{children}</div>
      </div>
    </div>
  );
};

const MobilePreview = ({ children }: MobilePreviewProps) => {
  const [open, setOpen] = React.useState(true);
  const [value, setValue] = React.useState(0);
  const screenObj: any = {
    0: screenOptions?.MOBILE,
    1: screenOptions?.ANDROID,
    2: screenOptions?.IPAD,
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const ScreenOption = {
    [screenOptions?.MOBILE]: <IphoneComp deviceType="iphone">{children}</IphoneComp>,
    [screenOptions?.ANDROID]: <IphoneComp deviceType="android">{children}</IphoneComp>,
    [screenOptions?.IPAD]: <IphoneComp deviceType="ipad">{children}</IphoneComp>,
  };
  return (
    // <div className="left__fixed-template-layout">
    <div className="small-screen__viewport">
      <SmallScreenTabOpt value={value} setValue={setValue} handleChange={handleChange}>
        <p style={{ marginTop: "0" }} className="text-info">
          {introText(screenObj?.[value])}
        </p>
        <div id="MobilePreview">{ScreenOption?.[screenObj?.[value]]}</div>
      </SmallScreenTabOpt>
    </div>
  );
};

export default MobilePreview;
