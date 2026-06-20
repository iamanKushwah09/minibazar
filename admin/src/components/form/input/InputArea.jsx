import React from "react";
import { Input } from "@windmill/react-ui";

const InputArea = ({
  disabled,
  register,
  defaultValue,
  required,
  name,
  label,
  type,
  autoComplete,
  placeholder,
  step,
  min,
  max,
  onChange,
  onBlur,
  value,
}) => {
  // For number inputs, ensure decimals are allowed
  const inputProps = {
    disabled,
    ...register(`${name}`, {
      required: required ? `${label} is required!` : false,
      ...(type === 'number' && {
        valueAsNumber: true,
        setValueAs: (value) => {
          if (value === '' || value === null || value === undefined) return undefined;
          const numValue = parseFloat(value);
          return isNaN(numValue) ? undefined : numValue;
        }
      })
    }),
    defaultValue,
    type,
    placeholder,
    name,
    autoComplete,
    className: "mr-2 h-12 p-2",
    ...(type === 'number' && {
      step: step || "any", // Allow any decimal precision
      ...(min !== undefined && { min }),
      ...(max !== undefined && { max }),
    }),
    ...(onChange && { onChange }),
    ...(onBlur && { onBlur }),
    ...(value !== undefined && { value }),
  };

  return (
    <>
      <Input {...inputProps} />
    </>
  );
};

export default InputArea;
