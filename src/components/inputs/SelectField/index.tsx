/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { SyntheticEvent } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { TextField, ListItemText } from '@mui/material';
import styles from './index.module.scss';

import { SelectFieldProps } from 'interfaces/inputProps';
const CustomSelectField: React.FC<SelectFieldProps> = ({
  label,
  type = 'text',
  value,
  disabled = false,
  fullwidth = true,
  InputProps,
  placeholder,
  required = false,
  options,
  onChange
}) => {
  const handleChange = (e: SyntheticEvent) => {
    onChange(e);
  };
  return (
    <div>
      {label && (
        <label className={`control-label ${styles.label}`}>
          <span className={styles.labelText}>{label}</span>
        </label>
      )}{' '}
      <TextField
        InputProps={InputProps}
        defaultValue={value ?? ''}
        disabled={disabled}
        select
        fullWidth={fullwidth}
        helperText={placeholder}
        onChange={(e: SyntheticEvent) => handleChange(e)}
        type={type}
        required={required}>
        {options.map((opt: any, i: number) => (
          <MenuItem key={i} value={opt.value}>
            <ListItemText>{opt.label}</ListItemText>
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default CustomSelectField;
