import {
  FormGroup,
  FormHelperText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { MenuOptions } from 'interfaces/profile';
import { FocusEvent } from 'react';
import { FC } from 'react';

interface IProps {
  isViewOnly: boolean;
  handleChange: (event: SelectChangeEvent<string | number>) => void;
  handleBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectTouch: (key: string) => void;
  value?: any;
  // value?: number | string;
  menuOptions?: MenuOptions[];
  error?: string;
  touched?: boolean;
  id: string;
  children?: string;
  addChildren?: boolean;
  openModal?: () => void;
  setData?: string;
  disabled?: boolean;
  multiple?: boolean;
}

const DynamicSelectField: FC<IProps> = ({
  handleBlur,
  handleChange,
  handleSelectTouch,
  id,
  isViewOnly,
  menuOptions,
  value,
  error,
  touched,
  children,
  addChildren,
  openModal,
  setData = 'value',
  disabled,
  multiple = false,
}) => {
  if (!!!menuOptions) return null;

  if (isViewOnly)
    return (
      <OutlinedInput
        id={id}
        type="text"
        // eslint-disable-next-line eqeqeq
        placeholder={menuOptions?.find((mn) => mn.value == value)?.label}
        readOnly
        size="small"
        fullWidth
        name={id}
        className={disabled ? 'disabled' : ''}
        disabled
      />
    );

  const getValue: any = (data: any) => {
    if (Array.isArray(data)) {
      return data?.filter((it: any) => Boolean(it));
    }
    return data;
  };

  return (
    <FormGroup className="input-holder">
      <Select
        id={id}
        size="small"
        fullWidth
        onChange={handleChange}
        onBlur={handleBlur}
        name={id}
        value={getValue(value) || '' || []}
        onClose={() => handleSelectTouch(id)}
        error={Boolean(touched && error)}
        MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
        className={disabled ? 'disabled' : ''}
        multiple={multiple}
        disabled={disabled}>
        {addChildren && (
          <MenuItem key={'add'} value={''} onClick={openModal}>
            <label> {children}</label>
          </MenuItem>
        )}
        {menuOptions?.map((opt) => (
          <MenuItem key={opt.value} value={opt[`${setData}`]}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {Boolean(touched && error) && <FormHelperText error>{error}</FormHelperText>}
    </FormGroup>
  );
};

export default DynamicSelectField;
