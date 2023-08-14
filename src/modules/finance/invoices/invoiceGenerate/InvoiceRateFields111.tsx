import { Grid } from '@mui/material';
import { Field } from 'formik';
import React, { useRef } from 'react';

import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
  CARD: 'card',
};

const InvoiceRateFields = (props: any) => {
  const {
    values,
    handleChange,
    handleBlur,
    index,
    locationIndex,
    rateIndex,
    as,
    disableEntireField,
    locationID,
    indexId,
    addDesc,
  } = props;

  const ref = useRef(null);

  const arrayMove = (arr: any, fromIndex: any, toIndex: any) => {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
  };

  const moveItem = (dragIndex: any, hoverIndex: any) => {
    const item = values.invoiceBillingData[dragIndex];
    const newInvoiceBillingData = values.invoiceBillingData;
    newInvoiceBillingData.splice(dragIndex, 1);
    newInvoiceBillingData.splice(hoverIndex, 0, item);
    handleChange('invoiceBillingData', newInvoiceBillingData);
  };

  // Define the drag and drop functions
  const [{ isDragging }, drag] = useDrag({
    item: {
      indexId,
      locationID,
      rateIndex,
    },
    type: ItemTypes.CARD,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item: any) => {
      if (item.index === index) return;

      moveItem(item.index, index);
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;
  const backgroundColor = canDrop ? '#f0f0f0' : '#fff';

  drag(drop(ref));

  return (
    <>
      <Grid item xs={2.5}>
        <div style={{ opacity, backgroundColor }} ref={ref}>
          <Field
            as={as}
            name={`invoiceBillingData.${index}.locations.${locationIndex}.rate_types.${rateIndex}.rate_type`}
            id={`invoiceBillingData.${index}.locations.${locationIndex}.rate_types.${rateIndex}.rate_type`}
            type="text"
            placeholder="Rate Type"
            size="small"
            data-testid="rate_type"
            fullWidth
            key={index}
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
          name={`invoiceBillingData.${index}.locations.${locationIndex}.rate_types.${rateIndex}.rate`}
          id={`invoiceBillingData.${index}.locations.${locationIndex}.rate_types.${rateIndex}.rate`}
          type="text"
          placeholder="Rate"
          size="small"
          data-testid="rate"
          key={index}
          fullWidth
          autoComplete="off"
          disabled={disableEntireField}
          value={
            values?.invoiceBillingData[index]?.locations[locationIndex]?.rate_types[rateIndex]
              ?.rate || ''
          }
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </Grid>
    </>
  );
};

export default InvoiceRateFields;
