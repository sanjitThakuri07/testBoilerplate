import React, { useState, useRef, useEffect } from 'react';
import * as Yup from 'yup';
import { TextField, Chip, IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface Props {
  placeholder?: string;
  value: string[] | any;
  onChange?: (emails: string[]) => void;
  id?: string;
  disabled?: boolean;
}

const MultiEmailSchema = Yup.array().of(Yup.string().email('Invalid email address'));
function MultiEmail(props: Props) {
  const [emails, setEmails] = useState<string[]>(props.value);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === ' ') {
      e.preventDefault();
      addEmail();
    } else if (e.key === 'Backspace' && !inputValue) {
      removeEmail(emails.length - 1);
    }
  };

  const addEmail = () => {
    setError('');
    if (!inputValue?.trim()?.toString()?.length) {
      setError('Invalid email address');
      return;
    }
    const newEmails = [...emails, inputValue.trim()];
    MultiEmailSchema.validate(newEmails)
      .then(() => {
        setError(() => '');
        setEmails(newEmails);
        setInputValue('');
        props.onChange && props.onChange(newEmails);
      })
      .catch((err) => {
        setError(err.errors[0]);
      });
  };

  const removeEmail = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
    props.onChange && props.onChange(newEmails);
  };

  const handleBlur = () => {
    if (!inputValue.trim()?.length) return setError('');
    if (inputValue.trim()) {
      addEmail();
    }
  };

  useEffect(() => {
    if (props?.value?.length) {
      setEmails(props?.value);
    } else {
      setEmails([]);
    }
  }, [props?.value]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          border: error ? '1px solid red' : '1px solid #ccc',
          borderRadius: '7px',
          padding: '7px',
        }}
        className={props?.disabled ? 'disabled' : ''}
        onClick={() => inputRef.current?.focus()}>
        {emails.map((email, index) => (
          <>
            {!props?.disabled ? (
              <Chip
                key={email}
                label={email}
                variant="outlined"
                onDelete={() => {
                  removeEmail(index);
                }}
                sx={{ margin: '2px' }}
              />
            ) : (
              <Chip key={email} label={email} variant="outlined" sx={{ margin: '2px' }} />
            )}
          </>
        ))}
        {
          <TextField
            inputRef={inputRef}
            type="email"
            placeholder={props.placeholder}
            value={inputValue}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            sx={{ minWidth: '150px' }}
            className={`asdf ${props?.disabled ? 'disabled' : ''}`}
            disabled={props?.disabled || false}
            InputProps={{
              endAdornment: (
                <>
                  {!props?.disabled && (
                    <IconButton onClick={addEmail}>
                      <AddIcon />
                    </IconButton>
                  )}
                </>
              ),
            }}
            style={{
              flex: 1,
              margin: '2px',
            }}
          />
        }
      </div>
      {error && <span style={{ color: '#d32f2f' }}>{error}</span>}
    </>
  );
}

export default MultiEmail;
