import React, { useState, useEffect } from "react";
import SearchableDropdown from "@/pages/SearchableDropdown";

const SelectPayment = ({ register, name, label, setValue, value }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const paymentOptions = [
      { value: "Cash", label: "Cash" },
      { value: "Online", label: "Online" }
    ];
    setOptions(paymentOptions);
  }, []);

  const handleSelect = (selectedOption) => {
    console.log("Payment selected:", selectedOption);
    const valueToSet = selectedOption?.value || selectedOption;
    if (setValue) {
      setValue(name, valueToSet);
    }
  };

  // Find the selected option for display
  const selectedOption = options.find(option => option.value === value);

  return (
    <>
      <SearchableDropdown
        options={options}
        onChange={handleSelect}
        placeholder="Select Payment Type"
        value={selectedOption}
      />

      <input
        type="hidden"
        {...register(`${name}`, {
          required: `${label} is required!`,
        })}
      />
    </>
  );
};

export default SelectPayment;
