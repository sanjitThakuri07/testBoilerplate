import { Checkbox, FormControlLabel } from '@mui/material';
import { useState } from 'react';

import { useTemplateFieldsStore } from 'containers/template/store/templateFieldsStore';
import DateTimeIcon from 'assets/template/icons/dateTime.png';
import { LabelWrapper, BodyWrapper } from 'containers/template/components/Wrapper';

const DateTime = ({ dataItem, questionLogicShow }: any) => {
  const updateTemplateDatasets = useTemplateFieldsStore(
    (state: any) => state.updateTemplateDatasets,
  );

  const [isRequiredDate, setIsRequiredDate] = useState<boolean>(dataItem?.variables?.date || false);
  const [isRequiredTime, setIsRequiredTime] = useState<boolean>(dataItem?.variables?.time || false);

  return {
    body: (
      <>
        {questionLogicShow?.getActiveLogicQuestion()?.includes(dataItem.id) && (
          <BodyWrapper>
            <div className="DateTime">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isRequiredDate}
                    onChange={(e) => {
                      let checked = e.target.checked;
                      setIsRequiredDate(checked);
                      updateTemplateDatasets(dataItem, 'variables', {
                        ...dataItem.variables,
                        date: checked,
                        time: isRequiredTime,
                      });
                    }}
                    value={isRequiredDate}
                  />
                }
                label="Date"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isRequiredTime}
                    onChange={(e) => {
                      let checked = e.target.checked;
                      setIsRequiredTime(checked);
                      updateTemplateDatasets(dataItem, 'variables', {
                        ...dataItem.variables,
                        date: isRequiredDate,
                        time: checked,
                      });
                    }}
                    value={isRequiredTime}
                  />
                }
                label="Time"
              />
            </div>
          </BodyWrapper>
        )}
      </>
    ),
    label: <LabelWrapper img={DateTimeIcon} title="Date & Time" />,
  };
};

export default DateTime;
