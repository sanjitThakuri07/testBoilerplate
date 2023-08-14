import { useState, useCallback } from 'react';
import { RateDrag } from './RateDrag';
import update from 'immutability-helper';

interface InvoiceRateFieldsProps {
  as: any;
  locationIndex: number;
  rateIndex: number;
  disableEntireField: boolean;
  values: any;
  addDesc: any;
  handleChange: any;
  handleBlur: any;
}

const InvoiceRateFields = ({
  as,
  locationIndex,
  rateIndex,
  disableEntireField,
  values,
  addDesc,
  handleChange,
  handleBlur,
}: InvoiceRateFieldsProps) => {
  const [cards, setCards] = useState([
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
  ]);
  const moveCard = useCallback(
    (dragIndex: any, hoverIndex: any) => {
      const dragCard = cards[dragIndex];
      setCards(
        update(cards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        }),
      );
    },
    [cards],
  );
  const renderCard = (card: any, index: any) => {
    return (
      <RateDrag
        as={as}
        Iindex={index}
        locationIndex={locationIndex}
        rateIndex={rateIndex}
        disableEntireField={disableEntireField}
        values={values}
        addDesc={addDesc}
        handleChange={handleChange}
        handleBlur={handleBlur}
        key={card.id}
        index={index}
        id={card.id}
        text={card.text}
        moveCard={moveCard}
      />
    );
  };

  return (
    <>
      <>{cards?.map((card, i) => renderCard(card, i))}</>
    </>
  );
};

export default InvoiceRateFields;
