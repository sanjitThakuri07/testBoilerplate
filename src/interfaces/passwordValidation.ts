export interface PasswordValidation {
  atLeastCharacters: boolean;
  atLeastDigit: boolean;
  isSpace: boolean;
}

export interface PasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}