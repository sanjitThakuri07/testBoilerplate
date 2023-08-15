import React, { forwardRef, useEffect, useState, CSSProperties } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { itemTypes } from "src/modules/template/itemTypes/itemTypes";
import { useDrag, useDrop } from "react-dnd";
import {
  FormControlLabel,
  FormGroup,
  ListItemButton,
  OutlinedInput,
  styled,
  Switch,
  SwitchProps,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import addQuestion from "src/assets/template/icons/addQuestion.svg";
import { FormikProps } from "formik";
import addSection from "src/assets/template/icons/addSection.svg";
import { useTemplateFieldsStore } from "containers/template/store/templateFieldsStore";
import Delete from "src/assets/template/icons/delete.svg";
import { reduceDataSet } from "src/modules/utils/reducedDataSet";
import { v4 as uuidv4 } from "uuid";
import { deepCloneArray, deepCloneObject } from "src/modules/utils/deepCloneArray";
import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import LogoutIcon from "src/assets/icons/logout_icon.svg";
interface SectionProps {
  question: string;
}

interface IProps {
  item?: any;
  id?: any;
  index?: number;
  formikBags: FormikProps<SectionProps>;
  isViewOnly?: boolean;
  handleUploadImage?: (image: File) => Promise<void>;
  loading?: boolean;
  children?: React.ReactNode;
  wholeDataSets: any;
  drop?: boolean;
  setTemplateLayouts?: any;
  sectionChildren?: any;
  templateLayouts?: any;
  templateDeleteHandler: any;
  setToggle?: any;
  toggleSection?: any;
  isOpenSection?: any;
  logic?: any;
  sectionShowHide: {
    showHideHandler: Function;
    openSection: boolean;
  };
}

const Section = ({
  item,
  isViewOnly,
  templateDeleteHandler,
  id,
  sectionShowHide,
  setToggle,
  toggleSection,
  isOpenSection,
  logic,
}: IProps) => {
  const {
    addTemplateNestedSection,
    addTemplateSection,
    updateTemplateDatasets,
    duplicateSectionHandler,
    setTemplateDatasets,
    moveItems,
    moveResponseData,
    selectedDataset,
    setSelectedData,
    setLogicBlocks,
    checkCanDrop,
    templateDatasets,
  } = useTemplateFieldsStore();

  const handleRepeatSection = (item: any) => {
    var arr = [...templateDatasets];
    const level1Arr = arr.filter(
      (templateData) => item.id == templateData.parent || item.id == templateData.id,
    );

    let level2Arr = deepCloneArray(
      arr.filter((temp) =>
        level1Arr.some((l1: any) => l1["id"] === temp.id || l1["id"] === temp.parent),
      ),
    );
    let isFirstSection = true;

    level2Arr.forEach((e: any, i: number, a: any) => {
      var puid = uuidv4();
      a.forEach((f: any) => {
        f.parent == e.id && (f.parent = puid);
        f.logicId == e.id && (f.logicId = puid);
      });
      e.id = puid;
      if (e.component === "section" && isFirstSection) {
        e.duplicatedParent = item.id;
        isFirstSection = false;
      }
    });
    setTemplateDatasets([...templateDatasets, ...level2Arr]);
  };

  const [duplicate, setDuplicate] = useState(false);
  const [required, setRequired] = useState(false);
  const [repeatSection, setRepeatSection] = useState(item.repeat || false);

  // to stop re rendering the template datasets
  const [typing, setTyping] = useState(item?.label ? item?.label : "");

  const handleAddTemplateNestedSection = (item: any, index: any) => {
    addTemplateNestedSection(item, index);
  };

  const [isQuestionFocused, setIsQuestionFocused] = React.useState(false);
  const [alignment, setAlignment] = React.useState<string | null>("left");
  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    setAlignment(newAlignment);
  };

  const addNestedTemplateQuestion = useTemplateFieldsStore(
    (state: any) => state.addNestedTemplateQuestion,
  );
  const handleAddTemplateQuestion = (item: any, id: any) => {
    addNestedTemplateQuestion(item, id);
  };

  // const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    // setOpen(!open);
    sectionShowHide?.showHideHandler((prev: boolean) => !prev);
  };

  const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,

      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#33426A",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,

      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));

  const tooltipItems = [
    {
      title: "Add Question",
      icon: addQuestion,
      disabled: false,
    },
    {
      title: "Add Section",
      icon: addSection,
      disabled: false,
    },
    {
      title: "Delete",
      icon: Delete,
      disabled: false,
    },
  ];
  const clickHandler = (tooltipIndex: number, title?: string) => {
    switch (tooltipIndex) {
      case 0:
        handleAddTemplateQuestion(item, item?.id);
        break;
      case 1:
        // onAddNestedSection(item, index);
        addTemplateSection(item, item?.id, item?.logicReferenceId, item?.globalLogicReferenceId);
        // addTemplateNestedSection(item, item?.id);
        break;
      default:
      case 2:
        templateDeleteHandler(id, title);
    }
  };

  // useEffect(() => {
  //   const newUID = uuidv4();
  //   if (!duplicate) {
  //     return;
  //   } else {
  //     // let clonedArray = deepCloneArray(wholeDataSets);
  //   }
  // }, [duplicate]);

  function updateObjects(objects: any, oldId: any, newId: any) {
    const updatedObjects = objects.map((obj: any) => {
      if (obj.id === oldId) {
        obj.id = newId;
      }

      return obj;
    });

    updatedObjects.forEach((obj: any) => {
      if (obj.parent === oldId) {
        // updateObjects(updatedObjects, obj.id, `${newId}_${obj.id}`);

        const jj = uuidv4();

        obj.id = jj;

        obj.parent = `${newId}`;
      }
    });

    return updatedObjects;
  }

  // this checks if the qustion has children or not
  const activeDrag = () => {
    let findChildrenLength = 0;
    for (let i = 0; i <= templateDatasets?.length; i++) {
      findChildrenLength =
        templateDatasets?.[i]?.parent === item?.id ? findChildrenLength + 1 : findChildrenLength;
      if (findChildrenLength > 0) break;
    }
    return !isOpenSection?.(item) || findChildrenLength <= 0;
  };

  // drag and drop functionality
  const [{ isDragging }, drag, preview] = useDrag(
    {
      type: itemTypes.SECTION,
      item: {
        items: item,
        type: itemTypes.SECTION,
        id: item?.id,
        position: { x: 0, y: 0 },
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      isDragging: (monitor: any) => {
        return item.id === monitor.getItem().id;
      },
      canDrag: () => {
        // return activeDrag();
        return true;
      },
    },
    [templateDatasets],
  );

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: [itemTypes?.TEXT_ANSWER, itemTypes?.SECTION],
    canDrop: () => checkCanDrop(),
    hover: async (itemss: any, monitor) => {
      const hoverId = item?.id;
      const hoverData = item;
      let { items, id } = itemss;
      switch (monitor.getItemType()) {
        case itemTypes?.TEXT_ANSWER:
          moveItems({ dragId: id, destinationId: hoverId });
          break;
        case itemTypes.SECTION:
          moveItems({ dragId: id, destinationId: hoverId });
          break;

        default:
          moveItems({
            dragId: id,
            destinationId: hoverId,
          });
          break;
      }
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }));

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

  const backgroundColor: string = isOver ? "rgb(140, 190, 230,0.5)" : canDrop ? "" : "";
  function getActive() {
    if (selectedDataset?.component === "logic") {
      // return isQuestionFocused || selectedDataset?.parent === dataItem?.id;
      return selectedDataset?.parent === id;
    }

    return selectedDataset?.id === id;
  }

  const [count, setCount] = useState(0);

  const visitedElements = new Set();

  function getCount(id: any, visitedElements: Set<any> = new Set()) {
    let count = 0;
    const item = templateDatasets.find((item: any) => item.id === id);

    if (item && !visitedElements.has(id)) {
      visitedElements.add(id);

      count += item.logics?.length;
      item.logics?.forEach((logic: any) => {
        if (logic.linkQuestions?.length > 0) {
          count += logic.linkQuestions?.length;
          logic.linkQuestions?.forEach((qid: any) => {
            count += getCount(qid, visitedElements);
          });
        }
      });
    }

    return count || 0;
  }

  const countChildren = (parentId: any) => {
    let childCount = 0;

    templateDatasets.forEach((item: any) => {
      if (
        (item.component === "question" || item.component === "section") &&
        item.parent === parentId
      ) {
        childCount++;
        if (
          sectionShowHide?.openSection &&
          (item.component === "question" || item.component === "section")
        ) {
          childCount += countChildren(item.id);
        }
      } else if (item.component === "logic" && item.parent === parentId) {
        childCount += getCount(item.id, visitedElements);
      }
    });

    return childCount;
  };

  const handleParentClick = (parentId: any) => {
    const childrenCount = countChildren(parentId);
    setCount(childrenCount);
  };

  return (
    <div>
      {/* <div id="Section" className="custom__padding-t"> */}
      <div
        id="Section"
        className={selectedDataset?.id === item?.id ? "active" : ""}
        onClick={() => {
          setSelectedData?.(item);
          handleParentClick(item.id);
        }}
      >
        <div id="SectionHoverHeader" className={`${isDragging ? "dragging" : ""}`}>
          <div className="Section_wrapper draggable_icon">
            <div ref={preview} style={{ ...getStyle(isDragging) }}>
              <div style={{ display: "flex", alignItems: "center", backgroundColor }} ref={drop}>
                {/* {!!!sectionShowHide?.openSection && (
                 
                )} */}
                <div
                  style={{ paddingLeft: "16px" }}
                  ref={ref}
                  className={`draggable_icon ${activeDrag() ? "active" : "de-active"}`}
                >
                  <img src="src/assets/icons/dots.svg" alt="Drag" />
                </div>
                <ListItemButton onClick={handleClick}>
                  <div className="section_heading">
                    <div
                      className={`${
                        repeatSection ? "section_heading_icon_repeat" : "section_heading_icon"
                      }`}
                    >
                      {isOpenSection(item) ? (
                        <ExpandLess onClick={() => toggleSection(item)} />
                      ) : (
                        <ExpandMore onClick={() => toggleSection(item)} />
                      )}
                    </div>

                    <div className="TextAnswer_input">
                      <FormGroup className="input-holder">
                        <div
                          className="input__wrapper section__wrapper"
                          onClick={(event: any) => {
                            setIsQuestionFocused((prev) => true);
                          }}
                        >
                          {isQuestionFocused ? (
                            <OutlinedInput
                              id="question"
                              type="text"
                              autoFocus
                              placeholder="Enter Section Title"
                              size="small"
                              style={{
                                backgroundColor: "#f9fafb",
                                width: "100%",
                              }}
                              fullWidth
                              name="question"
                              value={typing}
                              onClick={(event: any) => {
                                event.stopPropagation();
                                if (!isQuestionFocused) {
                                  setIsQuestionFocused((prev) => true);
                                }
                              }}
                              onChange={(e) =>
                                // updateTemplateDatasets(item, 'label', e.target.value)
                                setTyping(e.target.value)
                              }
                              onBlur={(event) => {
                                setIsQuestionFocused(false);
                                updateTemplateDatasets(item, "label", typing);
                              }}
                              onKeyPress={(e: any) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  e.target.blur();
                                }
                              }}
                              disabled={isViewOnly}
                            />
                          ) : (
                            <span className="template__text-view">
                              {/* {item?.label ? item?.label : item?.placeholder} */}
                              {typing ? typing : item?.label ? item?.label : item?.placeholder}
                            </span>
                          )}
                        </div>
                      </FormGroup>
                    </div>
                  </div>
                </ListItemButton>
                <div className="switch_sections">
                  <div className="switch_sections_lvl_1">
                    <ConfirmationModal
                      openModal={duplicate}
                      setOpenModal={setDuplicate}
                      confirmationIcon={LogoutIcon}
                      handelConfirmation={() => {
                        handleRepeatSection(item);
                        setDuplicate(false);
                      }}
                      confirmationHeading={`Do you want to duplicate this section?`}
                      confirmationDesc={`Entire section along with it's question, logic will be duplicated.`}
                      status="warning"
                    />
                    <button
                      className="section__duplicate"
                      type="button"
                      onClick={(e: any) => {
                        e?.preventDefault();
                        // handleRepeatSection(item);
                        setDuplicate(true);
                      }}
                    >
                      <span>Duplicate</span>
                      <span>
                        {
                          templateDatasets.filter(
                            (templateData: any) => templateData.duplicatedParent === item.id,
                          )?.length
                        }
                      </span>
                    </button>

                    {/* <span>Duplicate <button ></button></span> */}
                    {/* <FormControlLabel
                    value="start"
                    control={
                      <IOSSwitch
                        sx={{ m: 1 }}
                        name="required"
                        checked={required}
                        onChange={() => setRequired(!required)}
                        className="switch__section"
                      />
                    }
                    label="Required"
                    labelPlacement="start"
                  /> */}
                  </div>

                  <div className="switch_sections_lvl_2">
                    <FormControlLabel
                      value="start"
                      control={
                        <IOSSwitch
                          sx={{ m: 1 }}
                          name="repeatSection"
                          checked={repeatSection}
                          value={repeatSection}
                          className="switch__section"
                          // onChange={() => setRepeatSection(!repeatSection)}
                          onChange={(e) => {
                            updateTemplateDatasets(item, "repeat", e.target.value);
                            setRepeatSection(!repeatSection);
                          }}
                        />
                      }
                      label="Repeat this section"
                      labelPlacement="start"
                    />
                  </div>
                </div>
              </div>
              {isOpenSection(item) ? null : (
                <div style={{ paddingLeft: "16px" }}>
                  {count} {count == 1 ? "item" : "items"} hidden
                </div>
              )}

              <div
                id={`${getActive() ? "HoverItems_active" : "HoverItems"}`}
                className={`${getActive() ? "top" : ""}`}
              >
                <ToggleButtonGroup
                  value={alignment}
                  className="template_HoverItems"
                  orientation="vertical"
                  exclusive
                  onChange={handleAlignment}
                  aria-label="text alignment"
                >
                  {tooltipItems.map((items: any, index: any) => (
                    <Tooltip
                      title={items.title}
                      placement="right"
                      arrow
                      key={index}
                      onClick={() => {
                        clickHandler(index, `${item?.component}`);
                      }}
                    >
                      <ToggleButton
                        value={index}
                        aria-label="left aligned"
                        disabled={items.disabled}
                      >
                        <img src={items.icon} alt={items.title} />
                      </ToggleButton>
                    </Tooltip>
                  ))}
                </ToggleButtonGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section;
