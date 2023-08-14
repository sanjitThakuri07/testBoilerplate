import React from 'react';

interface ShortTextProps {
  value: string;
  length: number | undefined;
}

export const GetShorterText = ({ value, length = 50 }: ShortTextProps) => {
  const newValue =
    value?.toString()?.length >= length
      ? value?.toString().slice(0, length ? length : value?.length) + '...'
      : value;
  return newValue;
};
