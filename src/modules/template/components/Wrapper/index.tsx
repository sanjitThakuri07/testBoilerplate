import { Grid } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React from 'react';

type LabelWrapperType = {
  children?: any;
  img?: any;
  onClick?: any;
  title: string;
};

const index = ({ children, onClick, xs }: any) => {
  return (
    <Grid item xs={8} onClick={onClick}>
      {children}
    </Grid>
  );
};

export const LabelWrapper = ({ children, img, onClick, title }: LabelWrapperType) => {
  return (
    <div className="response__label-block" onClick={onClick}>
      <div>
        {img ? (
          <div className="select_icon_styling">
            <img src={img} alt="Inspection Date" />
          </div>
        ) : (
          <></>
        )}
        <div className="inner_field_component_styling_in_template">{title}</div>
      </div>
      <div className="fake_custom_select_field_input_type_icon">
        {/* <KeyboardArrowUpIcon className="select_item_icon" /> */}
      </div>
    </div>
  );
};

export const MultipleResponseWrapper = ({ children, img, onClick, title }: any) => {
  return (
    <div className="response__label-block" onClick={onClick}>
      <div className="multiple__options">{children}</div>
      <div className="fake_custom_select_field_input_type_icon">
        {/* <KeyboardArrowUpIcon className="select_item_icon" /> */}
      </div>
    </div>
  );
};

export const BodyWrapper = ({ children }: any) => {
  return <div className="body__wrapper">{children}</div>;
};

export default index;
