import React, { useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useState } from "react";
import DotGrid from "src/assets/iconsdotGrid2by2.svg";
import "./invoiceGenerate.scss";
import { deleteAPI, getAPI } from "src/lib/axios";
import { useParams } from "react-router-dom";
import { Box, IconButton, TextField } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import {
  triggerAdjustment,
  useAdditionalPreviewData,
  useAdjustmentModal,
  useBillingInvoceData,
  useInvoiceRemarkModal,
  useInvoiceTableDatas,
  usePublicInvoice,
  useUpdateRemarkIndex,
  useUpdatingAdjustment,
} from "src/store/zustand/globalStates/invoice/invoice";
import SaveIcon from "src/assets/icons/save_icon.svg";
import { getHighestLowestData, getObjectsWithinRange } from "src/utils/keyFunction";

const itemtypes = {
  ROW: "row",
  CELL: "cell",
};

const Headers = [
  { name: "Booking Id", value: "booking_id" },
  { name: "location", value: "location" },
  { name: "Inspection", value: "inspection" },
  { name: "Rate Type", value: "rate_type" },
  { name: "Rate", value: "rate" },
];

function checkCellDrop({ dragData, dropData, destinationCellDetail, sourceCellDetail }) {
  if (!dragData || !dropData) return false;
  if (["booking_id", "inspection"]?.includes(sourceCellDetail?.key)) return false;

  if (destinationCellDetail?.key !== sourceCellDetail?.key) {
    return false;
  }

  if (destinationCellDetail?.key == "row") {
    return dragData?.booking_id && dropData?.booking_id
      ? dragData?.booking_id !== dropData?.booking_id
        ? true
        : false
      : false;
  }

  if (dragData?.BOOKINGID !== dropData?.BOOKINGID) {
    return false;
  }
  if (destinationCellDetail?.key === "location") {
    return !(dragData?.LOCATIONID === dropData?.LOCATIONID);
  } else if (destinationCellDetail?.key === "rate") {
    return dragData?.LOCATIONID !== dropData?.LOCATIONID ? false : true;
  }

  return true;
}

const Cell = ({
  data,
  rowId,
  index,
  individualCellDetails,
  moveCell,
  blockData,
  tableDatas,
  moveRow,
}) => {
  const { openRemarkModal, setOpenRemarkModal } = useInvoiceRemarkModal();
  const [updateRemarkIndex, setUpdateRemarkIndex] = useState("");
  const [showRemarkInput, setShowRemarkInput] = useState(false);
  const [showRemark, setShowRemark] = useState(false);

  const { additionalPreviewData, setAdditionalPreviewData } = useAdditionalPreviewData();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: itemtypes?.CELL,
      item: { index, rowId, data: blockData, individualCellDetails },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: (item) => {
        return ["booking_id", "inspection"]?.includes(individualCellDetails?.key) ? false : true;
      },
    }),
    [tableDatas],
  );

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: itemtypes?.CELL,
      drop: (item, monitor) => {
        moveCell({
          sourceDetails: item?.data,
          destinationDetails: blockData,
          destinationCellDetail: individualCellDetails,
          sourceCellDetail: item?.individualCellDetails,
          tableDatas: tableDatas,
        });
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      }),
      canDrop: (item) => {
        return checkCellDrop({
          dragData: item?.data,
          dropData: blockData,
          destinationCellDetail: individualCellDetails,
          sourceCellDetail: item?.individualCellDetails,
        });
      },
    }),
    [tableDatas],
  );

  const opacity = isDragging ? 0.5 : 1;
  const backgroundColor = isOver ? "lightgreen" : canDrop ? "lightgrey" : null;
  const ref = React.useRef(null);
  drag(drop(ref));

  let rate_type_datas = [];
  let rate_data = [];
  let location_type_datas = [];

  Object.keys(blockData).forEach(function eachKey(key) {
    if (data === blockData["rate_type"]) {
      return rate_type_datas.push(data);
    }
    if (data === blockData["location"]) {
      return location_type_datas.push(data);
    }
    if (data === blockData["rate"]) {
      return rate_data.push(data);
    } else {
      return [];
    }
  });
  const { invoiceTableData, setInvoiceTableData } = useInvoiceTableDatas();
  const { invoiceData, setInvoiceData } = useBillingInvoceData();

  React.useEffect(() => {
    setAdditionalPreviewData(tableDatas);
    setInvoiceTableData(tableDatas);
    setInvoiceData({ ...invoiceData, booking_data: tableDatas });
  }, [updateRemarkIndex]);

  return (
    <>
      <td ref={ref} style={{ opacity, backgroundColor, textAlign: "right" }}>
        {data && (
          <>
            <div>
              {rate_type_datas.includes(data) ? (
                <div
                  style={{
                    marginBottom: showRemarkInput && "-20px",
                  }}
                >
                  <div className={`custom_input_field`}>
                    <div className="additional_drag_icon">
                      <div
                        className="additional_input_iconn"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {data.rate_type}
                        <IconButton
                          style={{
                            height: "0.7rem",
                          }}
                          onClick={() => {
                            // setUpdateRemarkIndex(index);
                            setShowRemark(true);
                            setOpenRemarkModal(true);
                          }}
                        >
                          <AddIcon
                            style={{
                              fontSize: "1rem",
                            }}
                          />
                        </IconButton>
                      </div>
                    </div>
                  </div>

                  {/* {openRemarkModal && ( */}

                  {showRemark && (
                    <div
                      className="invoice_remark_modal"
                      style={{
                        marginLeft: "9px",
                      }}
                    >
                      <div
                        className="invoice_remark_modal_header_title"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="invoice_remark_modal_text">
                          {/* {data?.remarks} */}

                          {showRemarkInput ? (
                            <input
                              defaultValue={data?.remarks}
                              onBlur={(e) => {
                                setUpdateRemarkIndex(e.target.value);
                                setShowRemarkInput(false);
                                moveCell({
                                  typee: "remarks",
                                  tableDatas,
                                  destinationCellDetail: {
                                    value: e.target.value,
                                    index: index,
                                  },
                                });
                              }}
                            />
                          ) : (
                            <>
                              {data?.remarks || (
                                <input
                                  type="text"
                                  defaultValue={data?.remarks}
                                  onBlur={(e) => {
                                    setUpdateRemarkIndex(e.target.value);
                                    setShowRemarkInput(false);
                                    moveCell({
                                      typee: "remarks",
                                      tableDatas,
                                      destinationCellDetail: {
                                        value: e.target.value,
                                        index: index,
                                      },
                                    });
                                  }}
                                />
                              )}
                            </>
                          )}
                        </div>
                        <div className="invoice_remark_modal_icons">
                          <IconButton
                            style={{
                              height: "20px",
                              width: "20px",
                            }}
                            onClick={() => {
                              setUpdateRemarkIndex(index);
                              setOpenRemarkModal(true);
                              setShowRemarkInput(true);
                            }}
                          >
                            <EditIcon
                              style={{
                                height: "20px",
                                width: "20px",
                              }}
                            />
                          </IconButton>{" "}
                          <IconButton
                            style={{
                              height: "20px",
                              width: "20px",
                              marginRight: "5px",
                            }}
                            onClick={() => {
                              // setUpdateRemarkIndex(index);

                              moveCell({
                                typee: "remarks",
                                tableDatas,
                                destinationCellDetail: {
                                  value: "",
                                  index: index,
                                },
                              });

                              setShowRemark(false);
                            }}
                          >
                            <DeleteOutlineIcon
                              style={{
                                height: "20px",
                                width: "20px",
                              }}
                            />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* )} */}
                </div>
              ) : location_type_datas.includes(data) ? (
                <div className={`custom_input_field`}>
                  <div className="additional_drag_icon">{data}</div>
                </div>
              ) : (
                <div className={`custom_input_field`}>
                  <div>{data}</div>
                </div>
              )}
            </div>
          </>
        )}
      </td>
    </>
  );
};

export const Row = ({ index, row, moveCell, tableDatas, moveRow }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: itemtypes?.ROW,
      item: { index, data: row },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [tableDatas],
  );

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: itemtypes?.ROW,
      drop: (item, monitor) => {
        const sourceIndex = item.index;
        const hoverIndex = index;
        if (sourceIndex === hoverIndex) {
          return;
        }
        moveRow({
          sourceIndex,
          destinationIndex: hoverIndex,
          sourceRowData: item.data,
          destinationRowData: row,
        });
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      }),
      canDrop: (item) => {
        return checkCellDrop({
          dragData: item?.data,
          dropData: row,
          destinationCellDetail: { key: "row" },
          sourceCellDetail: { key: "row" },
        });
      },
    }),
    [tableDatas],
  );

  const opacity = isDragging ? 0.5 : 1;
  const backgroundColor = isOver ? "lightgreen" : canDrop ? "lightgrey" : null;
  const ref = React.useRef(null);
  drag(drop(ref));

  return (
    <tr>
      <td ref={ref} style={{ opacity, backgroundColor, cursor: "grab" }}>
        {row?.["booking_id"] ? (
          <>
            <img src={DotGrid} alt="" className="drag_icon_start" />
          </>
        ) : (
          ""
        )}
      </td>

      {Headers.map((header) => (
        <Cell
          key={header.value}
          data={row?.[header.value]}
          rowId={row?.BOOKINGID}
          blockData={row}
          index={index}
          individualCellDetails={{
            position: index,
            key: header?.value === "rate_type" ? "rate" : header?.value,
          }}
          moveCell={moveCell}
          tableDatas={tableDatas}
          moveRow={moveRow}
        />
      ))}
    </tr>
  );
};

function GetModifiedData({ data }) {
  const flatData = data?.flatMap((item) => {
    return item.locations?.flatMap((location) => {
      return location?.rate_types.map((rateType) => {
        return {
          booking_id: item.booking_id,
          location: location.location,
          inspection: location.inspection,
          rate: rateType.rate,
          rate_type: {
            rate_type: rateType.rate_type,
            remarks: rateType.remarks,
          },
          RATEID: rateType.id,
          LOCATIONID: location.id,
          BOOKINGID: item.booking_id,
          currency: item?.currency_data?.currency,
        };
      });
    });
  });

  const finalData = flatData?.map((item, index) => {
    if (index === 0) {
      return item;
    } else {
      if (!item) return;
      let { rate, rate_type, booking_id, inspection, location, ...rest } = item;

      const otherObj = { rate, rate_type };
      const prevData = flatData[index - 1];
      const nextData = flatData[index + 1];
      const newObj = Object.assign({}, otherObj, {
        booking_id: prevData?.booking_id === booking_id ? "" : booking_id,
        inspection:
          prevData?.BOOKINGID === booking_id
            ? prevData?.LOCATIONID === item?.LOCATIONID
              ? ""
              : inspection
            : inspection,
        location:
          prevData?.BOOKINGID === booking_id
            ? prevData?.LOCATIONID === item?.LOCATIONID
              ? ""
              : location
            : location,
        totalAmmount: Number(prevData?.rate || 0) + Number(rate || 0),
        ...rest,
      });

      return newObj;
    }
  });
  return finalData;
}

const TestTable = ({ setCurrentPreviewData, data }) => {
  const { publicInvoice } = usePublicInvoice();
  const { additionalInvoiceData } = useBillingInvoceData();

  const getModifiedData = publicInvoice
    ? publicInvoice
    : additionalInvoiceData?.booking_data?.[0].items
    ? GetModifiedData({ data: additionalInvoiceData.booking_data?.[0].items })
    : additionalInvoiceData.booking_data;

  const [tableDatas, setTableDatas] = useState(getModifiedData);
  const { invoiceTableData, setInvoiceTableData } = useInvoiceTableDatas();

  const [adjustmentData, setAdjustmentData] = useState([]);

  const { invoiceId } = useParams();

  useEffect(() => {
    if (data?.length) {
      setTableDatas(getModifiedData);
      setInvoiceTableData(data);
    }
  }, [data]);

  const moveCell = ({
    sourceDetails,
    destinationDetails,
    destinationCellDetail,
    sourceCellDetail,
    tableDatas,
    typee,
  }) => {
    if (typee === "remarks") {
      setTableDatas((prev) => {
        return prev.map((data, index) => {
          if (index == destinationCellDetail?.index) {
            return {
              ...data,
              rate_type: {
                ...data?.rate_type,
                remarks: destinationCellDetail?.value,
              },
            };
          } else {
            return data;
          }
        });
      });
      return;
    }
    if (sourceCellDetail?.key !== destinationCellDetail?.key) {
      return;
    } else if (
      sourceCellDetail?.key === "rate" &&
      destinationCellDetail?.key === "rate" &&
      sourceDetails?.LOCATIONID === destinationDetails?.LOCATIONID
    ) {
      const changeData = [...tableDatas];
      const swapRate = ["rate", "rate_type", "RATEID"];
      swapRate.forEach((it) => {
        [
          changeData[sourceCellDetail?.position][it],
          changeData[destinationCellDetail?.position][it],
        ] = [
          changeData[destinationCellDetail?.position][it],
          changeData[sourceCellDetail?.position][it],
        ];
      });
      setCurrentPreviewData(changeData);
      setTableDatas(changeData);
    } else if (sourceCellDetail?.key === "location" && destinationCellDetail.key === "location") {
      if (sourceDetails?.LOCATIONID === destinationDetails?.LOCATIONID) {
        return;
      }
      const swapRate = ["booking_id", "inspection"];

      const wholeDragDropDatas = tableDatas?.reduce(
        (acc, curr, index, wholeArr) => {
          if (curr?.booking_id) {
            acc.startEndIndexOf[curr?.booking_id] = {
              ...acc.startEndIndexOf[curr?.booking_id],
              start: index,
              [curr?.LOCATIONID]: {
                start: curr?.location ? index : null,
              },
              // locationEnd: index + 1,
            };
          }
          if (index >= 0) {
            let nextData = wholeArr?.[index + 1];
            if (curr?.BOOKINGID !== nextData?.BOOKINGID) {
              acc.startEndIndexOf[curr?.BOOKINGID] = {
                ...acc.startEndIndexOf[curr?.BOOKINGID],
                end: index,
                // locationStart: curr?.LOCATIONID ===,
                // locationEnd: index + 1,
              };
            }
            if (curr?.location) {
              acc.startEndIndexOf[curr?.BOOKINGID] = {
                ...acc.startEndIndexOf[curr?.BOOKINGID],
                [curr?.LOCATIONID]: {
                  start: curr?.location ? index : null,
                },
                // locationEnd: index + 1,
              };
            }
            if (curr?.LOCATIONID !== nextData?.LOCATIONID) {
              acc.startEndIndexOf[curr?.BOOKINGID] = {
                ...acc.startEndIndexOf[curr?.BOOKINGID],
                [curr?.LOCATIONID]: {
                  ...acc?.startEndIndexOf[curr?.BOOKINGID]?.[curr?.LOCATIONID],
                  end: index,
                },
              };
            }
          }
          if (curr?.LOCATIONID === sourceDetails?.LOCATIONID) {
            acc.filterDragData.push(curr);
          } else if (curr?.LOCATIONID === destinationDetails?.LOCATIONID) {
            acc.filterDestinationData.push(curr);
            if (isNaN(acc?.findIndexOfDestination?.[curr.BOOKINGID])) {
              acc.findIndexOfDestination[curr.BOOKINGID] = curr?.location ? index : "null";
              acc.destinationIndex = curr?.location ? index : "null";
            }
          } else {
            acc.remainingValue.push(curr);
          }

          if (tableDatas?.length === index + 1 && acc.filterDragData.length) {
            if (sourceCellDetail?.position > destinationCellDetail?.position) {
              swapRate.forEach((swapValue) => {
                [
                  acc.filterDragData[0][`${swapValue}`],
                  acc.filterDestinationData[0][`${swapValue}`],
                ] = [
                  acc.filterDestinationData[0][`${swapValue}`],
                  acc.filterDragData[0][`${swapValue}`],
                ];
              });
            } else {
              swapRate.forEach((swapValue) => {
                [
                  acc.filterDestinationData[0][`${swapValue}`],
                  acc.filterDragData[0][`${swapValue}`],
                ] = [
                  acc.filterDragData[0][`${swapValue}`],
                  acc.filterDestinationData[0][`${swapValue}`],
                ];
              });
            }
          }

          return acc;
        },
        {
          remainingValue: [],
          filterDragData: [],
          filterDestinationData: [],
          findIndexOfDestination: {},
          middleValue: [],
          startEndIndexOf: {},
          destinationIndex: null,
        },
      );
      // drag and drop logic
      if (tableDatas) {
        wholeDragDropDatas.finalValue = [...tableDatas];
        const bookingCount = Object.keys(wholeDragDropDatas?.startEndIndexOf)?.length || 0;
        Object.keys(wholeDragDropDatas?.findIndexOfDestination || {})?.forEach((bookingKey) => {
          let arrayCutCollection = getHighestLowestData({
            objectCollection: {
              drag: wholeDragDropDatas?.startEndIndexOf?.[bookingKey]?.[sourceDetails?.LOCATIONID],
              drop: wholeDragDropDatas?.startEndIndexOf?.[bookingKey]?.[
                destinationDetails?.LOCATIONID
              ],
            },
          });

          // get the middle range datas
          let middleRange = getObjectsWithinRange({
            obj: wholeDragDropDatas?.startEndIndexOf?.[bookingKey],
            startRange: arrayCutCollection?.lowestStart,
            endRange: arrayCutCollection?.highestEnd,
          });

          if (middleRange?.lowestStart !== Infinity && middleRange?.highestRange !== -Infinity) {
            wholeDragDropDatas.middleValue = wholeDragDropDatas.finalValue?.slice(
              middleRange?.lowestStart,
              middleRange?.highestRange + 1,
            );
          }

          if (sourceCellDetail?.position < destinationCellDetail?.position) {
            let finalPushValues = [
              ...wholeDragDropDatas?.filterDestinationData,
              ...(wholeDragDropDatas?.middleValue || []),
              ...wholeDragDropDatas?.filterDragData,
            ];

            wholeDragDropDatas.finalValue?.splice(
              arrayCutCollection?.lowestStart,
              arrayCutCollection?.highestEnd - arrayCutCollection?.lowestStart + 1,
              ...finalPushValues,
            );
          } else {
            let finalPushValues = [
              ...wholeDragDropDatas?.filterDragData,
              ...(wholeDragDropDatas?.middleValue || []),
              ...wholeDragDropDatas?.filterDestinationData,
            ];
            wholeDragDropDatas.finalValue?.splice(
              arrayCutCollection?.lowestStart,
              arrayCutCollection?.highestEnd - arrayCutCollection?.lowestStart + 1,
              ...finalPushValues,
            );
          }
        });
      }
      setTableDatas(wholeDragDropDatas?.finalValue);
    }
  };

  const moveRow = ({ sourceIndex, destinationIndex, sourceRowData, destinationRowData, type }) => {
    if (!type) {
      // find all the datas related to that booking id
      const filterDragData = tableDatas?.filter(
        (data) => data.BOOKINGID === sourceRowData?.BOOKINGID,
      );

      const updatedData = tableDatas?.filter((data) => data.BOOKINGID !== sourceRowData?.BOOKINGID);

      if (sourceRowData?.BOOKINGID == destinationRowData?.BOOKINGID) {
        return;
      }

      const destinationDataFilter = tableDatas?.filter(
        (data) => data.BOOKINGID === destinationRowData?.BOOKINGID,
      );

      const findIndexOfDestination = updatedData.findIndex(
        (data) => data?.BOOKINGID === destinationRowData?.BOOKINGID,
      );

      let putIndex =
        sourceIndex > destinationIndex
          ? destinationIndex
          : findIndexOfDestination + destinationDataFilter?.length;
      updatedData.splice(putIndex, 0, ...filterDragData);

      setTableDatas(updatedData);
    }
  };

  const pdf_preview_label = {
    fontSize: "17px",
    fontWeight: "300",
    marginTop: "10px",
    color: "#344054",
  };
  const pdf_preview_text = {
    fontSize: "17px",
    fontWeight: "500",
    marginTop: "10px",
    color: "#344054",
  };

  const pdf_preview_label_float_right = {
    float: "right",
    marginRight: "10px",
  };

  const netAmount = tableDatas?.reduce((acc, curr) => {
    return acc + Number(curr?.rate || 0);
  }, 0);

  const adjustmentAmount = adjustmentData?.reduce((acc, curr) => {
    if (curr?.adjustment_type === "amount") {
      acc = acc + Number(curr?.adjustment_amount);
    } else if (curr?.adjustment_type === "percent") {
      // adjustmentPercentAmount =
      //   adjustmentPercentAmount + Number(curr?.adjustment_amount) * netAmount;

      acc = acc + (Number(curr?.adjustment_amount) * netAmount) / 100;
    }

    return acc;
  }, 0);

  let taxAmount =
    (additionalInvoiceData?.tax?.tax_percentage / 100) * (netAmount + adjustmentAmount);

  const finalAmount = netAmount + adjustmentAmount + taxAmount;

  // const tax = (finalAmount * 10) / 100;
  // const tax = 0;

  const { adjustmentModal, setAdjustmentModal } = useAdjustmentModal();
  const { openRemarkModal, setOpenRemarkModal } = useInvoiceRemarkModal();
  const { invoiceData, setInvoiceData } = useBillingInvoceData();

  const { isAdjustmentTriggered, setIsAdjustmentTriggered } = triggerAdjustment();
  const { updatingAdjustmentId, setUpdatingAdjustmentId } = useUpdatingAdjustment();

  const getAdjustment = () => {
    getAPI(`invoice-price-adjustment/${invoiceId}`)
      .then((res) => {
        setAdjustmentData(res?.data);
        setInvoiceData({
          ...invoiceData,
          invoice_price_adjustment: res?.data,
        });
      })
      .catch((err) => {});
  };

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    getAdjustment();
  }, [invoiceId, isAdjustmentTriggered]);

  React.useEffect(() => {
    if (isAdjustmentTriggered) {
      getAdjustment();
      setIsAdjustmentTriggered(false);
    }
  }, [isAdjustmentTriggered]);

  React.useEffect(() => {
    setInvoiceTableData(tableDatas);
  }, [tableDatas]);

  return (
    <>
      <table
        id="table"
        style={{
          width: "100%",
        }}
      >
        <thead>
          <tr
            className="invoice_Bl_Fm_header"
            style={{
              color: "#475467",
              borderBottom: "1px solid #d3cece",
              textAlign: "right",
            }}
          >
            {Headers.map((th) => {
              return <th colSpan={th.value === "booking_id" ? "2" : "1"}>{th.name}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {tableDatas?.map((row, index) => (
            <>
              <Row
                key={index}
                index={index}
                row={row}
                moveCell={moveCell}
                tableDatas={tableDatas}
                moveRow={moveRow}
              ></Row>
            </>
          ))}
          <tr>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td>
              <div
                className="pdf_preview_label_opt"
                style={{ ...pdf_preview_label, ...pdf_preview_label_float_right }}
              >
                Net Amount ({additionalInvoiceData?.currency?.currency}) :
              </div>{" "}
            </td>

            <td>
              <div
                className="pdf_preview_label_opt"
                style={{ ...pdf_preview_text, ...pdf_preview_label_float_right }}
              >
                {additionalInvoiceData?.currency?.currency} {netAmount}
              </div>{" "}
            </td>
          </tr>
          {adjustmentData?.map((it) => {
            return (
              <tr>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
                <td>
                  <div
                    className="pdf_preview_label"
                    style={{ ...pdf_preview_label, ...pdf_preview_label_float_right }}
                  >
                    <IconButton
                      style={{
                        height: "20px",
                        width: "20px",
                      }}
                      onClick={() => {
                        setAdjustmentModal(true);
                        setUpdatingAdjustmentId(it.id);
                      }}
                    >
                      <EditIcon
                        style={{
                          height: "18px",
                          width: "18px",
                        }}
                      />
                    </IconButton>{" "}
                    <IconButton
                      style={{
                        height: "20px",
                        width: "20px",
                        marginRight: "5px",
                      }}
                      onClick={() => {
                        const payload = {
                          config_ids: [it.id],
                        };
                        deleteAPI(`invoice-price-adjustment/`, payload)
                          .then((res) => {
                            enqueueSnackbar(res?.data?.message, {
                              variant: "success",
                            });

                            getAdjustment();
                          })
                          .catch((err) => {
                            enqueueSnackbar(err?.data?.message, {
                              variant: "error",
                            });
                          });
                      }}
                    >
                      <DeleteOutlineIcon
                        style={{
                          height: "18px",
                          width: "18px",
                        }}
                      />
                    </IconButton>
                    {`${it.adjustment_name}

                    ${it.adjustment_type === "percent" ? "(" + it.adjustment_amount + "%)" : ""}


                    `}{" "}
                    :
                  </div>
                </td>

                <td>
                  <div
                    className="pdf_preview_label"
                    style={{ ...pdf_preview_text, ...pdf_preview_label_float_right }}
                  >
                    {it.adjustment_type === "percent"
                      ? `${additionalInvoiceData?.currency?.currency} ${
                          (it.adjustment_amount / 100) * netAmount
                        }`
                      : `${additionalInvoiceData?.currency?.currency} ${it.adjustment_amount}`}
                  </div>
                </td>
              </tr>
            );
          })}{" "}
          <tr>
            <td> </td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td>
              <div
                className="pdf_preview_label_opt"
                style={{ ...pdf_preview_label, ...pdf_preview_label_float_right }}
              >
                Tax ({additionalInvoiceData?.tax?.tax_percentage})% :
              </div>{" "}
            </td>

            <td>
              <div
                className="pdf_preview_label_opt"
                style={{ ...pdf_preview_text, ...pdf_preview_label_float_right }}
              >
                {additionalInvoiceData?.currency?.currency + " "}
                {/* {additionalInvoiceData?.tax?.tax_amount} */}
                {taxAmount.toFixed(2)}
              </div>{" "}
            </td>
          </tr>
        </tbody>
      </table>

      <div
        className="invoice_info_container grand_total_container"
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto auto  auto auto auto auto auto auto",
          marginTop: "20px",
          boxShadow: "rgb(40 52 81) 0px 0px 0px 1000px inset",
          padding: "10px",
          color: "#ffffff",
          borderRadius: "0 0 10px 10px",
        }}
      >
        <div className="invoice_info_grid"></div>
        <div className="invoice_info_grid"></div>
        <div className="invoice_info_grid"></div>
        <div className="invoice_info_grid"></div>
        <div className="invoice_info_grid"></div>
        <div className="invoice_info_grid"></div>
        <div className="invoice_info_grid"></div>
        <div className="invoice_info_grid"></div>

        <div className="pdf_preview_label grand_total_label" style={{}}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "500",
              marginTop: "10px",
              color: "#ffffff",
              marginBottom: "10px",
              float: "right",
            }}
          >
            Grand Total
          </div>
        </div>

        <div className="invoice_info_grid invoice_footer">
          <div
            className="pdf_preview_text"
            style={{
              ...pdf_preview_text,
              fontSize: "18px",
              marginTop: "10px",
              color: "#ffffff",
              marginBottom: "10px",
              float: "right",
              marginRight: "10px",
            }}
          >
            {additionalInvoiceData?.currency?.currency + " "}
            {finalAmount.toFixed(2)}
          </div>
        </div>
      </div>
    </>
  );
};

export default TestTable;
