import { TextField } from '@mui/material';
import React, { FC } from 'react';

interface IProps {
  children: React.ReactNode;
  label?: string;
}

// const InputComponent: FC<{ inputRef: FunctionComponent<InputBaseComponentProps> }> = ({ inputRef, ...other }) => (
//   <div {...other} />
// );
const OutlinedDiv: FC<IProps> = ({ children, label }) => {
  return (
    <TextField
      variant="outlined"
      label={label}
      multiline
      InputLabelProps={{ shrink: true }}
      //   InputProps={{
      //     inputComponent: InputComponent
      //   }}
      inputProps={{ children: children }}
    />
  );
};
export default OutlinedDiv;
