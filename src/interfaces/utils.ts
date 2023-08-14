export interface FormikFormHelpers {
  [key: string]: boolean;
  isValid: boolean;
  dirty: boolean;
  touched: boolean;
}

export interface ActionButtonProps {
  [key: string]: string;
  edit: string;
  submit: string;
  cancel: string;
}

export const fileTypes: any = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
};
