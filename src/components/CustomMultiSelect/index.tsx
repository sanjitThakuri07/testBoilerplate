import { useEffect, useRef, useState } from "react";
import styles from "./select.module.css";

export type SelectOption = {
  label: string;
  value: string | number;
};

type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value?: any) => void;
};

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

function MultiSelect({ multiple, value, onChange, options, duplicate, placeholder }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }

  function selectOption(option: SelectOption) {
    if (multiple) {
      if (duplicate) {
        let newValues = [...value, option];
        let updatedNewValues = newValues.map((data: any, index?: number) => {
          return { ...data, id: index };
        });
        onChange(updatedNewValues);
      } else {
        if (value?.includes(option)) {
          onChange(value?.filter((o: any) => o !== option));
        } else {
          onChange([...value, option]);
        }
      }
    } else {
      if (option !== value) onChange(option);
    }
  }

  function deleteOption(index: number) {
    let newValues = [...value];
    newValues?.splice(index, 1);
    onChange(newValues);
  }

  function isOptionSelected(option: any) {
    return multiple ? value?.includes(option) : option === value;
  }

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < options?.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex, options]);

  return (
    <div
      ref={containerRef}
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      tabIndex={0}
      className={styles.container}
    >
      <span className={styles.value}>
        {/* {
          place holder logic
        } */}
        {multiple
          ? value?.map((v: any, index: number) => (
              <button
                // key={v?.value}
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteOption(index);
                }}
                className={styles["option-badge"]}
              >
                {v?.label}
                <span className={styles["remove-btn"]}>&times;</span>
              </button>
            ))
          : value?.label
          ? value?.label
          : placeholder}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          clearOptions();
        }}
        className={styles["clear-btn"]}
      >
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {options?.map((option: any, index: any) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
              setIsOpen(false);
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
            key={option.value}
            className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ""} ${
              index === highlightedIndex ? styles.highlighted : ""
            }`}
          >
            {option?.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MultiSelect;
