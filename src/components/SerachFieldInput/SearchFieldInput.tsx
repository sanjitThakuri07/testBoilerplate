import React, { useEffect } from "react";
import {
  Autocomplete,
  Box,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
// import SearchIcon from '../../assets/icons/search_icon.svg';
import _debounce from "lodash/debounce";

interface SearchOptionsListI {
  options: DropdownOptions[];
}

interface DropdownOptions {
  id?: string | number;
  label: any;
  icon?: any;
}

interface InputInterface {
  value: any;
  setValue: Function;
  placeholder: string;
  label?: string;
  setDebouncedSearch?:any
}

export default function SearchFieldInput({
  label,
  options,
  placeholder,
  value,
  setValue,
  setDebouncedSearch,
}: InputInterface & SearchOptionsListI) {
  // const [searchValue, setSearchValue] = React.useState<string>("");
  const debouncedSearchInput = (value: string) => {
    setDebouncedSearch(value);
  };

  const debounceFn = React.useCallback(
    _debounce(debouncedSearchInput, 400),
    []
  );

  const handleChange = (e: any) => {
    const searchTerm = e.target.value;
    setValue(searchTerm);
    debounceFn(searchTerm);
  };

  return (
    <>
      <Box>
        <label style={{ color: "#344054", fontWeight: 500 }}>{label}</label>
        {/* <Autocomplete
          sx={{ mt: 0.8 }}
          freeSolo
          options={options}
          disableCloseOnSelect={false}
          inputValue={value}
          onInputChange={(event: any, newValue: any) => setValue(newValue, event)}
          renderOption={(props, option) => (
            <li
              {...props}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '5px',
                borderRadius: '8px'
              }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ margin: '5px 0px', color: '#1F2840' }}>{option?.label}</Box>
              </Stack>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                <img src={CheckIcon} alt="check" />
              </Box>
            </li>
          )}
          renderInput={params => (
            <TextField
              className="custom_textfield"
              placeholder={placeholder}
              {...params}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <img src={SearchIcon} alt="search" />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                )
              }}
            />
          )}
        /> */}
        <OutlinedInput
          size="small"
          type="search"
          fullWidth
          value={value}
          onChange={handleChange}
          sx={{ marginTop: "5px" }}
          placeholder={placeholder}
          className="form_input"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </Box>
    </>
  );
}
