import * as React from 'react';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';

interface Props {
  placeholder: string;
  emails: string[];
  onChange?: (emails: string[]) => void;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  id?: string;
  value: string[];
  disabled?: boolean;
}

function MultiEmail(props: Props) {
  const [emails, setEmails] = React.useState<string[]>([]);
  const [focused, setFocused] = React.useState(false);
  const { placeholder, onChange, id, value } = props;

  return (
    <form>
      <ReactMultiEmail
        placeholder={placeholder}
        emails={value}
        id={id}
        onChange={onChange}
        autoFocus={false}
        style={{
          fontSize: '16px',
          width: '100%',
          padding: '7px',
          borderRadius: '7px',
          border: focused ? '1.7px solid #33426a' : '1px solid #ccc',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={props?.disabled ? 'disabled' : ''}
        getLabel={(email: any, index: any, removeEmail: any) => {
          return (
            <div data-tag key={index} id="REACT_MULTI_EMAIL_ADDED_EMAIL">
              <div data-tag-item>{email}</div>
              {!props?.disabled && (
                <span data-tag-handle onClick={() => removeEmail(index)}>
                  ×
                </span>
              )}
            </div>
          );
        }}
      />
      <br />
      <p>{emails.join(', ') || ''}</p>
    </form>
  );
}

export default MultiEmail;
