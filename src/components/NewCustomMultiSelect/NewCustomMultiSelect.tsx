import React from "react";
import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
// import { OutlinedInput } from '@material-ui/core';
// import SearchIcon from '@mui/icons-material/Search';

export default function NewCustomMultiSelect({
  menuOptions,
  selected,
  setSelected,
  menuLabel,
  labelKey,
  valueKey,
  placeholder,
  disabled = false,
  className,
  isMultiSelect = true,
  fieldName,
}: any) {
  const [searchValue, setSearchValue] = React.useState<any>("");

  const renderSelectedValues = () => {
    return selected?.map((select: any, index: any) => {
      const selectedObj: any = menuOptions?.find((val: any) => {
        if (select instanceof Object) {
          return val?.[valueKey] === select?.[valueKey];
        }
        return val?.[valueKey] === select;
      });

      return (
        <Chip
          key={index}
          size="small"
          sx={{ ml: index > 0 ? 0.5 : 0, zIndex: 999 }}
          label={selectedObj?.[labelKey] || selectedObj?.label}
          deleteIcon={<CancelIcon onMouseDown={(e: any) => e.stopPropagation()} />}
          avatar={
            selectedObj?.image ? (
              <Avatar alt="Natacha" src={selectedObj?.image && selectedObj?.image} />
            ) : (
              <Avatar>{selectedObj?.[labelKey]?.charAt(0)?.toUpperCase()}</Avatar>
            )
          }
          onDelete={(e) => {
            const filteredValues = selected?.filter((_: any, i: any) => i !== index);
            console.log({ filteredValues });
            setSelected(filteredValues);
          }}
        />
      );
    });
  };

  const handleChange = (event: any) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelected(
        selected?.length === menuOptions?.length
          ? []
          : menuOptions?.map((val: any) => val?.[valueKey]),
      );
      return;
    }
    setSelected(value);
  };

  const isAllSelected = menuOptions.length > 0 && selected.length === menuOptions.length;

  //   searching through options
  const filteredSearch = menuOptions?.filter((fi: any) =>
    fi?.[labelKey]?.toLowerCase()?.includes(searchValue.toLowerCase()),
  );

  return (
    <>
      <FormControl sx={{ width: "100%" }}>
        {placeholder && <InputLabel>{placeholder}</InputLabel>}

        <Select
          labelId="mutiple-select-label"
          multiple={isMultiSelect ? true : false}
          style={{ width: "100%" }}
          value={selected}
          disabled={disabled}
          className={className}
          onChange={handleChange}
          renderValue={renderSelectedValues}
          MenuProps={{
            PaperProps: { style: { maxHeight: 200 } },
          }}
          name={fieldName ?? ""}
          sx={{ overflow: "hidden" }}
        >
          <MenuItem value="all">
            <ListItemIcon>
              <Checkbox
                color="primary"
                checkedIcon={<img src="src/assets/icons/icon-check.svg" alt="check" />}
                icon={<img src="src/assets/icons/icon-uncheck.svg" alt="uncheck" />}
                indeterminateIcon={
                  <img src="src/assets/icons/icon-check-remove.svg" alt="indeterminate" />
                }
                checked={isAllSelected}
                indeterminate={selected?.length > 0 && selected?.length < menuOptions?.length}
              />
            </ListItemIcon>
            <ListItemText
              // classes={{ primary: classes.selectAllText }}
              primary={menuLabel}
            />
          </MenuItem>
          {filteredSearch.map((option: any) => {
            return (
              <MenuItem key={option?.[valueKey]} value={option?.[valueKey]}>
                <ListItemIcon>
                  <Checkbox
                    color="primary"
                    checkedIcon={<img src="src/assets/icons/icon-check.svg" alt="check" />}
                    icon={<img src="src/assets/icons/icon-uncheck.svg" alt="uncheck" />}
                    indeterminateIcon={
                      <img src="src/assets/icons/icon-check-remove.svg" alt="indeterminate" />
                    }
                    checked={selected.indexOf(option?.[valueKey]) > -1}
                  />
                </ListItemIcon>
                <ListItemText primary={option?.[labelKey]} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {/* search through options values */}
      {/* {isSearched && <Box>fdsa</Box>} */}
    </>
  );
}
