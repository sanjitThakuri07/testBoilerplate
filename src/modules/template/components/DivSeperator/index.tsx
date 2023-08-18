import React from "react";
// import {onDrop}
import { useDrag, useDrop } from "react-dnd";
import { itemTypes } from "src/modules/template/itemTypes/itemTypes";
import { useTemplateFieldsStore } from "src/store/zustand/templates/templateFieldsStore";

export const OuterDropTarget = ({ children }: any) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [itemTypes?.TEXT_ANSWER, itemTypes?.SECTION], // Accept all types of draggable items
    drop: (item, monitor) => {
      // Handle the drop logic for items dropped outside of the box
      // item contains the dropped item data
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  });
  const backgroundColor = canDrop ? "lightgreen" : "white";
  console.log({ isOver });

  return (
    <div ref={drop} style={{ backgroundColor, height: "100px" }}>
      {/* Your outer drop target content */}
      {children}
    </div>
  );
};

const setStyle = ({ element, color, check }: any) => {
  element?.forEach((el: any) => {
    if (check) {
      el.style.background = color;
    } else {
      el.style.background = "";
    }
  });
};

const Index = ({ item, sameBlock }: any) => {
  const {
    templateDatasets,
    templateHeading,
    setTemplateDatasets,
    addTitleAndDescription,
    setTemplateHeading,
    activeLogicBlocks,
    selectedDataset,
    moveItemBlockSide,
    moveItems,
  } = useTemplateFieldsStore();

  // drop function
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: [itemTypes?.TEXT_ANSWER, itemTypes?.SECTION],
    canDrop: (logItem: any, monitor) => {
      if (logItem?.items?.id === item?.id) {
        return false;
      }
      if (logItem?.items?.parent === null && item?.id === logItem?.items?.id) {
        return false;
      }
      return true;
    },
    drop: (logItem: any, monitor) => {
      const findParentData = templateDatasets.find((it: any) => it.id === item?.parent);
      const anotherParent = templateDatasets.find((it: any) => it.id === findParentData?.parent);
      if (findParentData && monitor.getItemType() !== itemTypes.RESPONSE_CHOICE_SET) {
        // console.log(monitor.getItemType(), 's');
        if (item?.logicReferenceId) {
          moveItems({ destinationId: item?.id, dragId: logItem?.items?.id });
        } else {
          moveItems({ destinationId: item?.id, dragId: logItem?.items?.id });
        }
        // moveItemBlockSide({ dragItem: logItem?.items, destinationItem: findParentData });
      } else {
        // alert('You are not allowed to');
        if (logItem?.id && item?.id)
          moveItems({ destinationId: item?.id, dragId: logItem?.items?.id });
      }
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }));

  // on which it has been hovered

  // setting the refrence for drag and drop
  const ref = React.useRef(null);
  drop(ref);
  if (item?.parent) {
    const findParentData = templateDatasets.find((it: any) => it.id === item.parent);
    const anotherParent = templateDatasets.find((it: any) => it.id === findParentData?.parent);

    let allElement = document.querySelectorAll(`[data-id="${item?.parent || "1-level"}"]`);
    if (allElement?.length) {
      setStyle({ check: isOver && canDrop, element: allElement, color: "rgb(140, 190, 230,0.5)" });
    }
  } else {
    let allElements = document.querySelectorAll(`[data-id="${"1-level"}"]`);
    if (canDrop) {
      setStyle({ check: isOver && canDrop, element: allElements, color: "rgb(140, 190, 230,0.5)" });
    } else {
      allElements.forEach((el: any) => {
        el.style.background = "";
      });
    }
  }

  return (
    <div
      className={`${item?.component === "logic" ? "" : "div__indicator"}  `}
      ref={ref}
      data-id={item?.parent || "1-level"}
    ></div>
  );
};

export default Index;
