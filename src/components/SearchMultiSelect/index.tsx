import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

import styles from "./index.module.scss";

interface Props {
  className?: string;
  name?: string;
  placeholder?: string;
  labelName?: string;
  optional?: string;
  tooltip?: string;
  value: any;
  data?: any; //DropdownNode[] | undefined
  handleChange: (value: object) => void;
  error?: any;
}

interface handleProps {
  event?: any;
  value: any;
}

const SearchMultiSelect = (props: Props) => {
  const { className, name, placeholder, labelName, optional, value, tooltip, data, error } = props;

  const handleChange = (e: handleProps) => {
    props.handleChange(e);
  };

  return (
    <>
      <div className={`${className}`}>
        {labelName && (
          <label className={`control-label ${styles.label}`}>
            <span className={styles.labelText}>{labelName}</span>
            {tooltip && (
              <span className={styles.tooltip_ic} title={tooltip}>
                <img src="/src/assets/images/icons/tooltip.svg" alt="" />{" "}
              </span>
            )}
            {optional && <span className={styles.light}>Optional</span>}
          </label>
        )}
        <div className={styles.inputGroup}>
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            size="small"
            options={data}
            disableCloseOnSelect
            getOptionLabel={(option: any) => option.label}
            renderOption={(props, option) => <li {...props}>{option.label}</li>}
            onChange={(event: any, newValue: any) => handleChange({ event, value: newValue })}
            // style={{ width: 500 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label=""
                className={`textfield`}
                name={name}
                value={value}
                placeholder={placeholder}
                error={error ? true : false}
                helperText={error?.message}
              />
            )}
          />
        </div>
      </div>
    </>
  );
};

export default SearchMultiSelect;
