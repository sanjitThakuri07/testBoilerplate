import React from "react";
import { Alert } from "@mui/material";
import { is } from "immutable";

function isObject(objValue: any) {
  return objValue && typeof objValue === "object" && objValue.constructor === Object;
}

const index = ({ children }: any) => {
  function showText(object: any): string[] {
    let textArray: string[] = [];
    if (isObject(object)) {
      Object.entries(object)?.forEach((val: any) => {
        if (Array.isArray(val?.[1])) {
          val?.[1]?.forEach((element: any) => {
            textArray = [...textArray, ...showText(element)];
          });
        } else if (isObject(val?.[1])) {
          textArray = [...textArray, ...showText(val?.[1])];
        } else {
          textArray.push(val?.[1]);
        }
      });
    } else if (Array.isArray(object)) {
      object?.forEach((element: any) => {
        textArray = [...textArray, ...showText(element)];
      });
    } else {
      textArray.push(object);
    }
    return textArray;
  }
  return (
    <Alert severity="error" className="error__box">
      {/* {children} */}
      {showText(children)?.map((text: any) => {
        return text;
      })}
    </Alert>
  );
};

export default index;
