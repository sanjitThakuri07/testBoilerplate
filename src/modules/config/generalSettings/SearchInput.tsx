import React, { useState, useEffect } from 'react';
import { OutlinedInput } from '@mui/material';

const useDebounce = (value: any, delay: any) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export interface SearchInputProps {
  placeholder?: string;
  startAdornment?: React.ReactNode;
  fullWidth?: boolean;
  sx?: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  debounceDelay?: number;
}

const SearchInput = ({
  placeholder,
  startAdornment,
  fullWidth,
  sx,
  onChange,
  debounceDelay,
}: SearchInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, debounceDelay || 500);

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <form className="search-form">
      <OutlinedInput
        placeholder={placeholder}
        startAdornment={startAdornment}
        fullWidth={fullWidth}
        sx={sx}
        value={inputValue}
        onChange={handleInputChange}
      />
    </form>
  );
};

export default SearchInput;
