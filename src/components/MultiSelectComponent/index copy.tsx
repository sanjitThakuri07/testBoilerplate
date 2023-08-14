import { useEffect, useRef, useState } from 'react';
import styles from './select.module.css';

export type SelectOption = {
  // label: string;
  // value: string | number;
  [key: string]: any;
};

type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

type FieldKey = {
  label: string;
  value: string;
};

type SelectProps = {
  options: SelectOption[];
  fieldKey: FieldKey;
  name?: string;
} & (SingleSelectProps | MultipleSelectProps);

export function MultiSelectComponent({
  multiple,
  value,
  onChange,
  options,
  fieldKey = { label: 'label', value: 'value' },
  name,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropdownOptions, setDropdownOptions] = useState(options || []);
  const [searchMode, setIsSearchMode] = useState(false);
  const [isSearchInput, setIsSearchInput] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef: any = useRef(null);

  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }

  const optionsKey: any = fieldKey?.label ? fieldKey.label : fieldKey;

  function selectOption({ type, option }: SelectOption) {
    if (multiple) {
      if (type !== 'all') {
        if (value.includes(option)) {
          onChange(value.filter((o) => o !== option));
        } else {
          onChange([...value, option]);
        }
      } else {
        if (value?.length === options?.length) {
          onChange([]);
        } else {
          onChange(dropdownOptions);
        }
      }
    } else {
      if (option !== value) onChange(option);
    }
  }

  function isOptionSelected(option: SelectOption) {
    return multiple ? value.includes(option) : option === value;
  }

  function searchOptions(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;
    if (value?.length) {
      setIsSearchMode(true);
    } else {
      setIsSearchMode(false);
    }

    const searchValueOptions = options?.filter((it: SelectOption) => {
      return (
        it?.[optionsKey]?.toString().toLowerCase().indexOf(value?.toString()?.toLowerCase()) !== -1
      );
    });

    setDropdownOptions(searchValueOptions);
  }

  useEffect(() => {
    if (!options?.length) return;
    setDropdownOptions(options);
  }, [options]);

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  const closeDropdown = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        // case 'Enter':
        // case 'Space':
        //   setIsOpen((prev) => !prev);
        //   if (isOpen) selectOption(options[highlightedIndex]);
        //   break;
        case 'ArrowUp':
        case 'ArrowDown': {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case 'Escape':
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener('keydown', handler);
    inputRef && inputRef.current.focus();
    return () => {
      containerRef.current?.removeEventListener('keydown', handler);
    };
  }, [isOpen, highlightedIndex, options]);

  const handleClickOutsideInput = (event: any) => {
    if (inputRef.current && !(inputRef?.current?.name === event?.target?.name)) {
      // Handle the case when the click occurred outside the input
      // Your logic here
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideInput);
    return () => {
      document.removeEventListener('click', handleClickOutsideInput);
    };
  }, []);

  // useEffect(() => {
  //   inputRef && inputRef.current.focus();
  // }, [inputRef]);

  return (
    // <div className={main__container}>
    <div
      ref={containerRef}
      onBlur={() => {
        inputRef && inputRef.current.blur();
        setIsOpen(false);
        // !isSearchInput && setIsOpen(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        // inputRef?.current?.focus();
        setIsSearchInput(false);
        setIsOpen((prev) => !prev);
      }}
      tabIndex={0}
      className={'custom__container'}>
      {/* options => selected value */}
      <span className={'value'}>
        {multiple
          ? value?.map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption({ type: '', option: v });
                }}
                className={'custom__option-badge'}>
                {v?.[optionsKey]}
                <span className={'remove-btn'}>&times;</span>
              </button>
            ))
          : value?.[optionsKey]}

        {/* <input
          type="text"
          name={name}
          ref={inputRef}
          onChange={searchOptions}
          autoComplete={'off'}
          onClick={(e) => {
            e.stopPropagation();
            // setIsSearchInput(true);
            setIsOpen(true);
          }}
          onBlur={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          placeholder=""
        /> */}
      </span>
      {/* clear button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          clearOptions();
        }}
        className={'clear-btn'}>
        &times;
      </button>
      <div className={'divider'}></div>
      <div className={'caret'}></div>
      {/* list of options */}
      <div className={`options__container ${isOpen ? 'show' : ''}`}>
        <ul
          className={`${'custom__options'} ${isOpen ? 'show' : ''}`}
          onBlur={(e) => {
            setIsOpen(false);
          }}>
          <li
            onClick={(e) => {
              e.stopPropagation();
              setIsSearchInput(true);
            }}
            key={'input--element'}
            className={`${'custom__option input-key'}`}>
            <input
              type="text"
              className="input__search"
              name={name}
              ref={inputRef}
              onChange={searchOptions}
              autoComplete={'off'}
              autoFocus={true}
              onClick={(e) => {
                e.stopPropagation();
                setIsSearchInput(true);
              }}
              onBlur={(e) => {
                e.stopPropagation();
                setIsOpen(true);
                // setIsSearchInput(false);
              }}
              placeholder="Search Options"
            />
          </li>
          {!searchMode && multiple && (
            <li
              onClick={(e) => {
                e.stopPropagation();
                selectOption({ type: 'all' });
              }}
              key={'select__all'}
              className={`${'custom__option select__all'}`}

              // ${index === highlightedIndex ? highlighted : ''}
            >
              <input type="checkbox" checked={value?.length === options?.length} />
              <span>Select All</span>
            </li>
          )}
          {dropdownOptions?.map((option: { [key: string]: any }, index: number) => (
            <li
              onClick={(e) => {
                e.stopPropagation();
                selectOption({ type: 'one', option });
                inputRef?.current?.focus();
                if (!multiple) {
                  setIsOpen(false);
                } else {
                  setIsOpen(true);
                }
              }}
              // onMouseEnter={() => setHighlightedIndex(index)}
              key={option?.[fieldKey?.value]}
              className={`custom__option ${isOptionSelected(option) ? 'selected' : ''}`}
              // ${index === highlightedIndex ? highlighted : ''}
            >
              {multiple && <input type="checkbox" checked={isOptionSelected(option)} />}
              {/* {JSON.stringify(option)} */}
              <span>{option?.[optionsKey]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    // </div>
  );
}
