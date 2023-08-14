import React, { useState, useEffect, useRef } from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

function ResettableTextField(props) {
  const valueRef = useRef();

  useEffect(() => {
    if (props?.clearData) {
      props?.setClearData(false);
    }
  }, [props?.clearData]);

  const handleReset = () => {};

  return (
    <div>
      <TextField
        {...props}
        // value={value}
        onChange={(event) => {
          // setValue(event.target.value);
          props?.onChange(event);
        }}
      />
    </div>
  );
}

export default ResettableTextField;
