import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { moduleIdsFnR } from "src/utils/url";

interface WithDragProps {
  WrappedComponent: any;
  dragType: String;
  item?: Record<string, any>;
  canDrag?: Function;
}

interface WithDropProps {
  WrappedComponent: any;
  accept: string[] | string;
  onDrop: any;
}

// drag HOC
export const withDragHOC = ({ WrappedComponent, dragType, item, canDrag }: WithDragProps) => {
  return (props: any) => {
    let { id, ...rest } = props;
    // console.log({ id }, { rest });
    const [{ isDragging }, drag] = useDrag(() => ({
      type: `${dragType}`,
      item: { id, ...rest, ...item },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: () => {
        const check = canDrag ? canDrag(props?.dataItem) : true;
        return check;
      },
    }));
    const canDragStatus = !moduleIdsFnR?.includes(rest?.dataItem?.module_id);

    return (
      <div
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: canDragStatus ? (isDragging ? "grabbing" : "grab") : "not-allowed",
        }}
      >
        <WrappedComponent {...props} {...rest} />
      </div>
    );
  };
};

// drop HOC

export const withDropHOC = ({ WrappedComponent, accept, onDrop }: WithDropProps) => {
  return (props: any) => {
    const [{ isOver }, drop] = useDrop({
      accept: accept,
      drop: onDrop,
      collect: (monitor: any) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
      }),
    });

    return (
      <div ref={drop} style={{ backgroundColor: isOver ? "yellow" : "white" }}>
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export const withDragAndDropHOC = ({
  WrappedComponent,
  dragType,
  item,
  accept,
  onDrop,
  dataItem,
}: any) => {
  console.log({ dataItem });
  const DropComponent = (props: any) => {
    const [hoverItem, setHoverItem] = useState(null);

    const [{ isOver, canDrop }, drop] = useDrop({
      accept: accept,
      drop: (droppedItem, monitor) => {
        onDrop(droppedItem, monitor, hoverItem);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    });

    return (
      <div ref={drop} style={{ backgroundColor: isOver ? "yellow" : "white" }}>
        <WrappedComponent {...props} hoverItem={hoverItem} setHoverItem={setHoverItem} />
      </div>
    );
  };

  const DragComponent = (props: any) => {
    let { id, dataItem, ...rest } = props;
    const [{ isDragging }, drag] = useDrag(() => ({
      type: dragType,
      item: { id: id, items: dataItem },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}>
        <DropComponent {...props} />
      </div>
    );
  };

  return DragComponent;
};
