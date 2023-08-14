import { TextareaAutosize } from '@mui/material';
import React from 'react';

const GetTextInput = ({ dataItem, logic, ...attr }: any) => {
  return (
    <>
      {(() => {
        switch (dataItem?.response_type) {
          case 'INSTRUCT_001':
            return (
              <TextareaAutosize
                placeholder="Type the instruction you want to pass"
                minRows={1}
                className="template__text-area"
                {...attr}
              />
            );
          default:
            return (
              <TextareaAutosize
                placeholder="Type the instruction you want to pass"
                minRows={1}
                className="template__text-area"
                {...attr}
              />
            );
        }
      })()}
    </>
  );
};

export default GetTextInput;
