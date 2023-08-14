import React from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckboxIcon from 'assets/template/icons//checkbox.svg';

import { BodyWrapper } from 'containers/template/components/Wrapper';

export default function Checkbox({ dataItem }: any) {
  const [open, setOpen] = React.useState(false);
  const onClick = () => {
    setOpen(!open);
    // setSelectedInputId(responseTypeId);
    return;
  };

  return {
    body: (
      <>
        <BodyWrapper className="field__wrapper">
          {/* <div className="question__answer-type">
            <Menu
              id="format-positioned-menu"
              aria-labelledby="format-positioned-button"
              anchorEl={anchorEl}
              open={openMenu}
              sx={{ marginTop: '23px' }}
              onClose={handleMenuCloseAction}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              className={'custom__options-2'}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}>
              <MenuItem onClick={(e) => handleMenuClose(e, 'text')} value="text">
                Short Answer
              </MenuItem>
              <MenuItem onClick={(e) => handleMenuClose(e, 'text_area')} value="text_area">
                Paragraph
              </MenuItem>
            </Menu>
          </div> */}
        </BodyWrapper>
      </>
    ),
    label: (
      <div className="response__label-block" onClick={onClick}>
        <div>
          <div className="select_icon_styling">
            <img src={CheckboxIcon} alt="Checkbox" />
          </div>
          <div className="inner_field_component_styling_in_template">Checkbox</div>
        </div>
        <div className="fake_custom_select_field_input_type_icon">
          <KeyboardArrowUpIcon className="select_item_icon" />
        </div>
      </div>
    ),
  };
  // return (
  //   <>
  //     <div
  //       className="fake_custom_select_field_wrapper field__wrapper"
  //       onClick={onClick}
  //       style={textFieldStyle}>
  //       <div className="fake_custom_select_field_input_type">
  //         <div className="select_icon_styling">
  //           <img src={CheckboxIcon} alt="Temperature" />
  //         </div>
  //         <div className="inner_field_component_styling_in_template">Checkbox</div>
  //       </div>
  //       <div
  //         className="fake_custom_select_field_input_type_icon"
  //         style={{
  //           transform: open ? 'rotate(90deg)' : 'rotate(180deg)',
  //         }}>
  //         <KeyboardArrowUpIcon className="select_item_icon" />
  //       </div>
  //     </div>
  //   </>
  // );
}
