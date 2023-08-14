import { Grid } from '@mui/material';
import { Field } from 'formik';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
  CARD: 'card',
};
const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

interface RateDragProps {
  id: number;
  text: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;

  as: any;
  Iindex: number;
  locationIndex: number;
  rateIndex: number;
  disableEntireField: boolean;
  values: any;
  addDesc: any;
  handleChange: any;
  handleBlur: any;
}

export const RateDrag = ({
  as,
  Iindex,
  locationIndex,
  rateIndex,
  disableEntireField,
  values,
  addDesc,
  handleChange,
  handleBlur,
  id,
  text,
  index,
  moveCard,
}: RateDragProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      <Grid item xs={2.5}>
        <div style={{ opacity }} ref={ref}>
          <Field
            as={as}
            name={`invoiceBillingData.${Iindex}.locations.${locationIndex}.rate_types.${rateIndex}.rate_type`}
            id={`invoiceBillingData.${Iindex}.locations.${locationIndex}.rate_types.${rateIndex}.rate_type`}
            type="text"
            placeholder="Rate Type"
            size="small"
            data-testid="rate_type"
            fullWidth
            key={Iindex}
            autoComplete="off"
            isItemDraggable={true}
            isItemAddable={true}
            onClickItemAddadble={addDesc}
            disabled={disableEntireField}
            value={
              values?.invoiceBillingData[index]?.locations[locationIndex]?.rate_types[rateIndex]
                ?.rate_type || ''
            }
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {/* ddf {index} */}
        </div>
      </Grid>

      <Grid item xs={2}>
        <Field
          as={as}
          name={`invoiceBillingData.${Iindex}.locations.${locationIndex}.rate_types.${rateIndex}.rate`}
          id={`invoiceBillingData.${Iindex}.locations.${locationIndex}.rate_types.${rateIndex}.rate`}
          type="text"
          placeholder="Rate"
          size="small"
          data-testid="rate"
          key={Iindex}
          fullWidth
          autoComplete="off"
          disabled={disableEntireField}
          value={
            values?.invoiceBillingData[Iindex]?.locations[locationIndex]?.rate_types[rateIndex]
              ?.rate || ''
          }
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Grid>
    </div>
  );
};
