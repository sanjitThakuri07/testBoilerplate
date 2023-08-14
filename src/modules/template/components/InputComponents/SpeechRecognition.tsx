import { Grid } from '@mui/material';
import React from 'react';
import { textFieldStyle } from '../ChooseResponseType/ChooseResponseType';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SpeechRecognitionIcon from 'assets/template/icons/speech_recognition.svg';

export default function SpeechRecognition({ dataItem }: any) {
  const [open, setOpen] = React.useState<boolean>(false);
  const onClick = () => {
    setOpen(!open);

    return;
  };

  return {
    body: <></>,
    label: (
      <div className="response__label-block" onClick={onClick}>
        <div>
          <div className="select_icon_styling">
            <img src={SpeechRecognitionIcon} alt="Speech Recognition" />
          </div>
          <div className="inner_field_component_styling_in_template">Speech Recognition</div>
        </div>
        <div className="fake_custom_select_field_input_type_icon">
          <KeyboardArrowUpIcon className="select_item_icon" />
        </div>
      </div>
    ),
  };
}
