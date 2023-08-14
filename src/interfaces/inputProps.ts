export interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string | number | null | undefined;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  fullwidth?: boolean;
  InputProps?: any;
  endAdornment?: any;
  sx?: any;
  style?: any;
  size?: any;
  onChange: (data: any) => void;
  error?: boolean;
}
export interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  value?: string | number | null | undefined;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  fullwidth?: boolean;
  InputProps?: any;
  options: any;
  onChange: (data: any) => void;
}
