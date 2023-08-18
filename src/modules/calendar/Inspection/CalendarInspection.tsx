// CalendarInspection.ts
import { Button } from "@mui/material";
import { useInspectionStore } from "src/store/zustand/templates/inspectionStore";
import React, { useState, useEffect } from "react";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import { checkDate, formatDate } from "src/utils/keyFunction";
import { RadioOptions } from "src/utils/FindingsUtils";
import { useNavigate } from "react-router-dom";

import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

interface CalendarInspectionProps {
  ID: number;
}

export default function CalendarInspection(props: CalendarInspectionProps): JSX.Element {
  const { ID } = props;

  const isLoading = false;
  const navigate = useNavigate();

  const { manageInspection, manageInspectionData }: any = useInspectionStore();

  React.useEffect(() => {
    manageInspection({ id: ID });
  }, [ID]);

  console.log(manageInspectionData, "manageInspectionData");

  const formatData = ({ data }: any) => {
    const flatData = data?.location?.flatMap((item: any) => {
      if (item?.templates?.length) {
        return item?.templates?.flatMap((template: any) => {
          if (template?.template_data?.length) {
            return template?.template_data?.map((inspectionData: any) => {
              return {
                location: item.name,
                LOCATIONID: item?.id,
                TEMPLATEID: template?.id,
                INSPECTION_TYPE: item.inspection_name,
                inspection_type: item.inspection_name,
                template: template?.name,
                inspection_data: {
                  id: inspectionData?.id,
                  status: inspectionData?.status,
                  status_name: inspectionData?.status_name,
                  ...inspectionData,
                },
                inspectors: [...(item?.contractors || []), ...(item?.inspectors || [])],
                inspection_date: item?.inspection_date,
              };
            });
          } else {
            return {
              location: item.name,
              inspection_type: item.inspection_name,
              template: template?.name,
              LOCATIONID: item?.id,
              TEMPLATEID: template?.id,
              INSPECTION_TYPE: item.inspection_name,
              inspectors: [...(item?.contractors || []), ...(item?.inspectors || [])],
              inspection_date: item?.inspection_date,
            };
          }
        });
      } else {
        return {
          location: item.name,
          inspection_type: item.inspection_name,
          INSPECTION_TYPE: item.inspection_name,
          LOCATIONID: item?.id,
          inspectors: [...(item?.contractors || []), ...(item?.inspectors || [])],
          inspection_date: item?.inspection_date,
        };
      }
    });

    const finalData = flatData.map((item: any, index: any) => {
      if (index === 0) {
        return item;
      } else {
        if (!item) return;
        let { template, inspection_type, location, inspectors, inspection_date, ...rest } = item;
        const otherObj = rest;
        const prevData = flatData[index - 1];
        const nextData = flatData[index + 1];
        const newObj = Object.assign(
          {},
          {
            location: prevData?.location === location ? "" : location,
            inspectors: prevData?.location === location ? [] : inspectors,
            inpsection_date: prevData?.location === location ? [] : inspection_date,
            inspection_type:
              prevData?.location === location
                ? prevData?.inspection_type === inspection_type
                  ? ""
                  : inspection_type
                : inspection_type,
            template:
              prevData?.location === location
                ? prevData?.template === template
                  ? ""
                  : template
                : template,
            ...rest,
          },
        );

        return newObj;
      }
    });

    return finalData;
  };

  let checkLocationStatus: any = {};
  if (manageInspectionData?.location) {
    let data = formatData({ data: manageInspectionData });
    const checkComplete = data?.reduce((acc: any, curr: any) => {
      if (!acc?.[`${curr?.LOCATIONID}-${curr?.INSPECTION_TYPE}`]) {
        acc[`${curr?.LOCATIONID}-${curr?.INSPECTION_TYPE}`] = {
          [curr?.inspection_data?.id]:
            curr?.inspection_data?.status_name === "Completed"
              ? true
              : curr?.inspection_data?.status_name === "In Progress"
              ? "In Progress"
              : false,
        };
      } else {
        acc[`${curr?.LOCATIONID}-${curr?.INSPECTION_TYPE}`] = {
          ...(acc[`${curr?.LOCATIONID}-${curr?.INSPECTION_TYPE}`] || {}),
          [`${curr?.inspection_data?.id}-noId`]:
            curr?.inspection_data?.status_name === "Completed"
              ? true
              : curr?.inspection_data?.status_name === "In Progress"
              ? "In Progress"
              : false,
        };
      }
      return acc;
    }, {});
    checkLocationStatus = checkComplete;
    function checkForTrue(obj: any) {
      return Object.values(obj).some((innerObj: any) => Object.values(innerObj).includes(true));
    }
    const finalStatus = checkForTrue(checkComplete);
  }
  function checkStatus(locationId: any) {
    let data = checkLocationStatus?.[locationId];

    // Object.values(data || {}).includes('In Progress')

    return Object.values(data || {}).includes(true);
  }
  return (
    <div className="calendar-inspection">
      <>
        {!isLoading && manageInspectionData?.location
          ? formatData({ data: manageInspectionData }).map((tableData: any) => {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>{tableData?.template} : </div>
                  <div>
                    {tableData?.inspection_data?.id && (
                      <span
                        style={{ textDecoration: "underline", cursor: "pointer" }}
                        onClick={() => {
                          tableData?.inspection_data?.id &&
                            navigate(
                              `/inspections/${
                                tableData?.inspection_data?.status_name === "In Progress"
                                  ? "edit"
                                  : "view"
                              }/${tableData?.inspection_data?.id}?BOOKING_ID=${ID}`,
                            );
                        }}
                      >
                        {/* {tableData?.inspection_data?.template_name || 'working'} */}

                        {tableData?.inspection_data?.status_name === "In Progress" ? (
                          <Button
                            style={{
                              transform: "scale(0.8)",
                            }}
                            variant="outlined"
                            startIcon={<TuneOutlinedIcon />}
                          >
                            {" "}
                            Edit{" "}
                          </Button>
                        ) : (
                          <Button
                            style={{
                              transform: "scale(0.8)",
                            }}
                            variant="outlined"
                            startIcon={<RemoveRedEyeOutlinedIcon />}
                          >
                            View
                          </Button>
                        )}
                      </span>
                    )}
                    {!tableData?.inspection_data && tableData?.template && (
                      <>
                        {checkStatus?.(`${tableData?.LOCATIONID}-${tableData?.INSPECTION_TYPE}`) ? (
                          <span style={{ marginRight: "12px", display: "inline-block" }}>--</span>
                        ) : (
                          <span
                            style={{
                              transform: "scale(0.8)",
                            }}
                            className="start__button"
                            onClick={() => {
                              tableData?.TEMPLATEID &&
                                navigate(
                                  `/template/inspection/${tableData?.TEMPLATEID}?BOOKING_ID=${ID}`,
                                );
                            }}
                          >
                            <PlayCircleOutlineOutlinedIcon
                              style={{
                                height: "21px",
                                width: "21px",
                                color: "rgb(2 3 77 / 69%)",
                              }}
                            />
                            Start
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        display: "inline-block",
                        background: RadioOptions?.[
                          `${tableData?.inspection_data?.status_name || "Open"}`
                        ]
                          ? RadioOptions?.[`${tableData?.inspection_data?.status_name || "Open"}`]
                              .backgroundColor
                          : RadioOptions?.[`default`].backgroundColor,
                        padding: "4px 12px",
                        paddingLeft: "30px",
                        borderRadius: "20px",
                        position: "relative",

                        transform: "scale(0.8)",

                        color: RadioOptions?.[
                          `${tableData?.inspection_data?.status_name || "Open"}`
                        ]
                          ? RadioOptions?.[`${tableData?.inspection_data?.status_name || "Open"}`]
                              ?.textColor
                          : RadioOptions?.[`default`]?.textColor,
                      }}
                      className="badge__creator"
                    >
                      <span
                        style={{
                          background: RadioOptions?.[`${tableData?.inspection_data?.status_name}`]
                            ? RadioOptions?.[`${tableData?.inspection_data?.status_name || "Open"}`]
                                ?.dotColor
                            : RadioOptions?.[`default`]?.dotColor,
                        }}
                      ></span>
                      {tableData?.inspection_data?.status_name || "Open"}
                    </div>
                  </div>
                </div>
              );
            })
          : ""}
      </>
    </div>
  );
}
