import React, { useState } from "react";
import { Input } from "@windmill/react-ui";
import { HiEye, HiEyeOff } from "react-icons/hi";

const PasswordInput = ({
  disabled,
  register,
  defaultValue,
  required,
  name,
  label,
  autoComplete,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Input
        disabled={disabled}
        {...register(`${name}`, {
          required: required ? `${label} is required!` : false,
        })}
        defaultValue={defaultValue}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        name={name}
        autoComplete={autoComplete}
        className="mr-2 h-12 p-2 pr-12"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        ) : (
          <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
