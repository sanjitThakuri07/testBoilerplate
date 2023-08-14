import React, { CSSProperties, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Button, InputLabel, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import { itemTypes } from "src/modules/template/itemTypes/itemTypes";
import { useTemplateFieldsStore } from "containers/template/store/templateFieldsStore";
import { useTextAnswer } from "globalStates/templates/TextAnswer";
import { useDrag, useDrop } from "react-dnd";
import ChooseResponseType from "../ChooseResponseType/ChooseResponseType";
import SpeechPage from "../mobileComponents/MobileSpeechRecognition/MobileSpeechRecognition";
import { DropLogic } from "./DropLogic";
import GetTextInput from "./GetTextInput";
import FnrModal from "../TitlePage/FnRModal";
import { possibleFnR } from "src/utils/url";

interface TextAnswerProps {
  textValue?: string;
  setTextValue?: (value: string) => void;
  responseTypeValue?: string;
  createQuestionHandler?: Function;
  createSectionHandler?: Function;
  deleteHandler?: Function;
  isMultipleSection?: any;
  responseTypeID?: string;
  // parent index and children index
  templateIndex?: number;
  childrenIndex?: number;
  createNestedSection?: Function;
  questionNested?: boolean;
  createNestedQuestion?: Function;
  templateLayouts?: any;
  createTitleDescription?: Function;
  addQuestionHandler?: any;
  clickHandler: any;
  alignment: any;
  handleAlignment: any;
  tooltipItems: any;
  setTemplateIndex?: any;
  setSectionNested?: any;
  sectionNested?: any;
  dataItem?: any;
  items?: any;
  onAddLogicClick?: any;
  logic?: any;
  children?: any;
  questionLogicShow?: any;
  toggleSection?: any;
  isOpenSection?: any;
  multipleResponseData?: any;
  globalResponseData?: any;
  internalResponseData?: any;
  externalResponseData?: any;
  fnrAction?: any;
}

const TextAnswer = ({
  // textValue,
  responseTypeID,
  clickHandler,
  alignment,
  handleAlignment,
  tooltipItems,
  items,
  dataItem,
  onAddLogicClick,
  logic,
  children,
  questionLogicShow,
  toggleSection,
  isOpenSection,
  multipleResponseData,
  globalResponseData,
  internalResponseData,
  externalResponseData,
  fnrAction,
}: TextAnswerProps) => {
  const updateTemplateDatasets = useTemplateFieldsStore(
    (state: any) => state.updateTemplateDatasets,
  );
  const setSelectedData = useTemplateFieldsStore((state: any) => state.setSelectedData);
  const {
    moveItems,
    moveResponseData,
    selectedDataset,
    setLogicBlocks,
    checkCanDrop,
    templateDatasets,
  } = useTemplateFieldsStore();
  const [isQuestionFocused, setIsQuestionFocused] = React.useState(false);
  const { selectedInputType, setSelectedInputType } = useTextAnswer();
  const [clickedTooltipSection, setClickedTooltipSection] = React.useState<string | null>(null);
  const inputRef = useRef<any>(null);
  const { question, setQuestion } = useTextAnswer();

  const [hoverAlignment, setHoverAlignment] = useState("top");

  // for typing effect
  const [type, setType] = useState(dataItem?.label || "");

  // hover element height
  const hoverElHeight = 300;
  const hoverElId = "HoverItems";
  const hoverContainerClassName = "TextAnswer_wrapper_header";

  const calculateRemainingSpace = ({ currentELement }: any) => {
    // const container = containerRef.current;\
    const container: any = document.querySelector(".scroll__container");
    const el = currentELement?.target;
    const parentEl = el.closest("#hover__container");
    if (!container || !el || !parentEl) return;
    const containerBoundingRect = container.getBoundingClientRect();
    const currentElementBoundingRect = parentEl?.getBoundingClientRect();
    const elementPosition = currentElementBoundingRect?.top - containerBoundingRect?.top;

    const containerHeight = container.offsetHeight;
    const remainingSpace = containerHeight - (elementPosition || 0);
    setHoverAlignment(() => (remainingSpace > hoverElHeight ? "top" : "bottom"));
  };

  // this checks if the qustion has children or not
  const activeDrag = () => {
    let findChildrenLength = 0;
    for (let i = 0; i <= templateDatasets?.length; i++) {
      findChildrenLength =
        templateDatasets?.[i]?.parent === logic?.id ? findChildrenLength + 1 : findChildrenLength;
      if (findChildrenLength > 0) break;
    }
    return !isOpenSection(dataItem) || findChildrenLength <= 0;
  };

  const [{ isDragging }, drag, preview] = useDrag({
    type: itemTypes.TEXT_ANSWER,
    item: {
      items: dataItem,
      id: dataItem?.id,
      position: { x: 0, y: 0 },
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      canDrag: monitor.canDrag(),
    }),
    isDragging: (monitor) => {
      return dataItem.id === monitor.getItem().id;
    },
    canDrag: () => {
      return dataItem?.lock ? false : true;
    },
  });

  const handleDrop = useCallback(
    (item: any, monitor: any) => {
      const hoverId = dataItem?.id;
      const hoverData = dataItem;
      let { items, id } = item;
      DropLogic({
        actionType: "DROP",
        hoverId,
        id,
        item,
        fetchApI,
        moveItems,
        moveResponseData,
        monitor,
      });
    },
    [dataItem, fetchApI, moveItems, moveResponseData],
  );

  const handleHover = useCallback(
    (item: any, monitor: any) => {
      const hoverId = dataItem?.id;
      const hoverData = dataItem;
      let { items, id } = item;
      DropLogic({
        actionType: "HOVER",
        hoverId,
        id,
        item,
        fetchApI,
        moveItems,
        moveResponseData,
        monitor,
      });
    },
    [dataItem, fetchApI, moveItems, moveResponseData],
  );

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: [
      itemTypes?.TEXT_ANSWER,
      itemTypes?.SECTION,
      itemTypes?.RESPONSE_CHOICE_SET,
      itemTypes?.INTERNAL_RESPONSE,
      itemTypes?.DEFAULT,
    ],
    canDrop: () => {
      return !dataItem?.lock;
    },
    hover: handleHover,
    drop: handleDrop,
    collect: (monitor: any) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }));

  const styles = {
    dropComponent: {
      transition: "transform 0.2s ease",
    },
  };

  // on which it has been hovered
  const backgroundColor: string = canDrop ? (isOver ? "rgb(140, 190, 230,0.5)" : "") : "";

  // setting the refrence for drag and drop
  const ref = React.useRef(null);
  drag(ref);

  const getStyle = (isDragging: boolean): CSSProperties => {
    const opacity = isDragging ? 0 : 1;
    const cursor = isDragging ? "grabbing" : "grab";

    return {
      opacity,
      cursor,
    };
  };

  const tooltipClickedData = (e: string) => {
    setClickedTooltipSection(e);
  };

  useEffect(() => {
    if (question.length === 0) {
      setQuestion("Booking Id");
    }
    if (clickedTooltipSection !== null) {
      alert(clickedTooltipSection);
    }
  }, [isQuestionFocused, clickedTooltipSection]);

  // setTemplateIndex(index);
  // setSectionNested(true);

  function getActive() {
    if (selectedDataset?.component === "logic") {
      // return isQuestionFocused || selectedDataset?.parent === dataItem?.id;
      return selectedDataset?.parent === dataItem?.id;
    }

    return selectedDataset?.id === dataItem?.id;
  }

  const [count, setCount] = useState(0);

  function getCount(id: any) {
    let count = 0;
    const item = templateDatasets.find((item: any) => item.parent === id);

    if (item) {
      count += item.logics?.length;

      if (item.logics?.length > 0) {
        item.logics?.forEach((logic: any) => {
          if (logic.linkQuestions?.length > 0) {
            count += logic.linkQuestions?.length;
            logic.linkQuestions?.forEach((qid: any) => {
              count += getCount(qid);
            });
          }
        });
      }
    }
    setCount(count);

    return count || 0;
  }

  // logic?.logicApi?.url
  //   ?.split('/')
  //   .reverse()
  //   ?.filter((field: any) => Boolean(field))?.[0];

  const fieldOf: any = logic?.logicApi?.url
    ? logic?.logicApi?.url
        ?.toString()
        ?.split("/")
        .reverse()
        ?.filter((field: any) => Boolean(field))?.[0]
    : logic?.logicApi?.options
        ?.toString()
        ?.split("/")
        .reverse()
        ?.filter((field: any) => Boolean(field))?.[0] || "";
  const canDragStatus = !possibleFnR?.includes(fieldOf);

  return (
    <div
      onClick={(e: any) => {
        // if (dataItem?.lock) return;
        setSelectedData(dataItem);
        questionLogicShow?.toggleQuestionLg({
          item: logic,
          state: true,
          lastItem: dataItem.parent,
        });
        calculateRemainingSpace?.({ currentELement: e });
      }}
      className={`${isDragging ? "dragging" : ""}`}
    >
      <div id="TextAnswer">
        {/* {} */}
        <div
          className={`TextAnswer_wrapper ${dataItem?.type === "date" ? "flex__style" : ""}`}
          style={{ ...getStyle(isDragging), backgroundColor }}
        >
          <div className="TextAnswer_wrapper_header" ref={drop} id={"hover__container"}>
            <div className="input__logic-wrapper" ref={preview}>
              <InputLabel
                htmlFor="Question"
                className={`${getActive() ? "active" : ""} custom__input-styling`}
              >
                <div
                  className={`draggable_icon ${
                    canDragStatus ? (activeDrag() ? "active" : "de-active") : "de-active"
                  }`}
                  ref={ref}
                >
                  <img src="/assets/icons/dots.svg" alt="Drag" />
                </div>
                {dataItem?.required && (
                  <span style={{ paddingRight: "8px", fontSize: "16px" }}>*</span>
                )}
                {!!logic.logics?.length && (
                  <div
                    className="section_heading_icon"
                    onClick={(e: any) => {
                      e?.stopPropagation();
                      toggleSection(dataItem);
                      // countChildren();
                      getCount(dataItem.id);
                    }}
                  >
                    {isOpenSection(dataItem) ? (
                      <ExpandLess style={{ fontSize: "18px" }} />
                    ) : (
                      <ExpandMore style={{ fontSize: "18px" }} />
                    )}
                  </div>
                )}
                <div
                  onClick={(event: any) => {
                    setIsQuestionFocused((prev) => true);
                  }}
                  className="input__wrapper"
                >
                  {isQuestionFocused ? (
                    <>
                      <GetTextInput
                        autoFocus
                        type={"text"}
                        dataItem={dataItem}
                        // value={dataItem?.label === dataItem?.placeholder ? '' : dataItem?.label}
                        value={type}
                        logic={logic}
                        onBlur={(event: any) => {
                          event.stopPropagation();
                          setIsQuestionFocused((prev) => false);
                          updateTemplateDatasets(dataItem, "label", type);
                        }}
                        onClick={(event: any) => {
                          event.stopPropagation();
                          if (!isQuestionFocused) {
                            setIsQuestionFocused((prev) => true);
                          }
                        }}
                        onKeyPress={(e: any) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.target.blur();
                          }
                        }}
                        onChange={(event: any) => {
                          setType(event.target.value);
                          // updateTemplateDatasets(dataItem, 'label', event.target.value);
                        }}
                      />
                    </>
                  ) : (
                    <span className="template__text-view">
                      {/* {dataItem?.label ? dataItem?.label : dataItem?.placeholder} */}
                      {type ? type : dataItem?.label ? dataItem?.label : dataItem?.placeholder}
                    </span>
                  )}
                </div>

                <Button
                  variant={"outlined"}
                  size="small"
                  className={`indicator ${selectedDataset?.id === dataItem?.id ? "active" : ""}`}
                  onClick={(e: any) => {
                    e.stopPropagation();
                  }}
                >
                  {
                    ChooseResponseType({
                      responseTypeID,
                      dataItem: dataItem,
                      type: "",
                      label: false,
                      multipleResponseData,
                      globalResponseData,
                      internalResponseData,
                      externalResponseData,
                      isQuestionFocused: isQuestionFocused,
                      questionLogicShow: questionLogicShow,
                      logic: logic,
                    })?.label
                  }
                </Button>
              </InputLabel>

              {["instruction", "date", "media"].includes(dataItem?.type) ? null : (
                <Button
                  disabled={getActive() ? false : true}
                  variant="outlined"
                  onClick={(e: any) => {
                    onAddLogicClick?.();
                  }}
                >
                  Add Logic
                </Button>
              )}
              {/* <span>Short Answer</span> */}
            </div>
            {/* hover items will be rendered here */}
            <div
              id={`${getActive() ? "HoverItems_active" : "HoverItems"}`}
              className={`${hoverAlignment === "top" ? "top" : "bottom"} tooltip__addition`}
            >
              <ToggleButtonGroup
                value={alignment}
                className="template_HoverItems"
                orientation="vertical"
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
              >
                {tooltipItems.map((item: any, index: any) => (
                  <Tooltip
                    title={item.title}
                    placement="right"
                    arrow
                    key={index}
                    onClick={() => clickHandler(item.index, `${dataItem?.component}`)}
                  >
                    <ToggleButton value={index} aria-label="left aligned" disabled={item.disabled}>
                      <img src={item.icon} alt={item.title} />
                    </ToggleButton>
                  </Tooltip>
                ))}
              </ToggleButtonGroup>
            </div>
            {/* hover items stops here */}
          </div>

          {isOpenSection(dataItem) ? null : (
            <div style={{ paddingLeft: "16px" }}>
              {count} {count == 1 ? "item" : "items"} hidden
            </div>
          )}
          {/* {
            isOpenSection(item) && questionLogicShow.isOpenQuestionLg(logic) &&
          } */}
          <div className="speech__wrapper">
            <div className="TextAnswer_wrapper_body">
              <div className="speech__box">
                {questionLogicShow?.getActiveLogicQuestion()?.includes(dataItem.id) &&
                  dataItem?.type !== "media" && (
                    <>
                      <SpeechPage
                        onConfirm={(data: any) => {
                          setType?.((prev: any) => {
                            return prev?.length
                              ? prev === dataItem?.placeholder
                                ? `${data}`
                                : prev + ` ${data}`
                              : data;
                          });
                          updateTemplateDatasets(
                            dataItem,
                            "label",
                            dataItem?.label ? `${dataItem?.label} ${data}` : `${data}`,
                          );
                        }}
                      />
                    </>
                  )}
              </div>

              {
                ChooseResponseType({
                  responseTypeID,
                  dataItem: dataItem,
                  type: "",
                  label: false,
                  multipleResponseData,
                  globalResponseData,
                  isQuestionFocused,
                  questionLogicShow: questionLogicShow,
                  logic: logic,
                })?.body
              }
              {children}
            </div>
          </div>
        </div>
      </div>
      {fieldOf === "main-category" && <FnrModal parentItem={dataItem} fnrAction={fnrAction} />}
    </div>
  );
};

export default TextAnswer;
