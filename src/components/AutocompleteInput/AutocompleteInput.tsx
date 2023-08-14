import { Autocomplete, Box, Stack, TextField } from "@mui/material";
import CheckIcon from "src/assets/icons/tick_icon.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface OptionsListInterface {
  options: DropdownOptions[];
}

interface DropdownOptions {
  id: string | number;
  label: any;
  icon?: any;
}

interface InputInterface {
  value: any;
  setValue: any;
  placeholder?: string;
  label?: string;
}

export default function AutocompleteInput({
  options,
  placeholder,
  value,
  setValue,
  label,
}: OptionsListInterface & InputInterface) {
  return (
    <Box>
      {label && <label style={{ color: "#344054", fontWeight: 500 }}>{label}</label>}
      <Autocomplete
        sx={{ mt: 0.8 }}
        popupIcon={<ExpandMoreIcon />}
        options={options}
        disableCloseOnSelect={false}
        clearOnBlur={false}
        clearIcon={false}
        value={value}
        onChange={(event: any, newValue: any) => setValue(newValue, event)}
        // inputValue={value}
        // onInputChange={(event:any, inputValue:any) => setValue(inputValue, event)}
        renderOption={(props, option) => (
          <li
            {...props}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "5px",
              borderRadius: "8px",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              {!!option.icon && (
                <Box sx={{ margin: "5px 0px" }}>
                  <img
                    src={option?.icon}
                    alt="icon"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                </Box>
              )}
              <Box sx={{ margin: "5px 0px", color: "#1F2840" }}>{option?.label}</Box>
            </Stack>
            {value?.id === option?.id && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <img src={CheckIcon} alt="check" />
              </Box>
            )}
          </li>
        )}
        renderInput={(params) => (
          <TextField className="custom_textfield" {...params} placeholder={placeholder} />
        )}
      />
    </Box>
  );
}
