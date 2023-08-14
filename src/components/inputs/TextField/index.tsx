/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { SyntheticEvent } from 'react';
import styles from './index.module.scss';

import { TextField } from '@mui/material';
import { TextFieldProps } from 'interfaces/inputProps';
const CustomTextField: React.FC<TextFieldProps> = ({
  label,
  type = 'text',
  value,
  disabled = false,

  fullwidth = true,
  InputProps,
  placeholder,
  sx,

  size,
  required = false,
  onChange,
  error,
}) => {
  const handleChange = (e: SyntheticEvent) => {
    onChange(e);
  };
  return (
    <div>
      {/* {label&&
      <Typography className='input-label'>{label}</Typography>
      } */}
      {label && (
        <label className={`control-label ${styles.label}`}>
          <span className={styles.labelText}>{label}</span>
        </label>
      )}

      <TextField
        InputProps={InputProps}
        sx={sx}
        value={value ?? ''}
        disabled={disabled}
        fullWidth={fullwidth}
        placeholder={placeholder}
        size={size}
        onChange={(e: SyntheticEvent) => handleChange(e)}
        type={type}
        required={required}
        error={error}
      />
    </div>
  );
};

export default CustomTextField;
