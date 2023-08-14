import { Typography } from '@mui/material';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export interface ExternalResponseItemProps {
  open?: any;
  externalResponseItem?: any;
  onClick?: any;
}

const ExternalResponseItem = ({
  open,
  externalResponseItem,
  onClick,
}: ExternalResponseItemProps) => {
  return {
    body: (
      <div id="ExternalResponseItem">
        {/* <div
          className={`${open && 'response_type_border'} response_type_wrapper`}
          onClick={onClick}>
          <div className="response_type_inner">
            <div
              className="rendering_multiple_choice_response"
              style={{
                marginTop: '10px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}></div>
          </div>
        </div> */}
      </div>
    ),
    label: (
      <div className="response__label-block" onClick={onClick}>
        <div>
          <div className="inner_field_component_styling_in_template">
            {' '}
            {externalResponseItem?.name}
          </div>
        </div>
        <div className="fake_custom_select_field_input_type_icon">
          {/* <KeyboardArrowUpIcon className="select_item_icon" /> */}
        </div>
      </div>
    ),
  };
};

export default ExternalResponseItem;
