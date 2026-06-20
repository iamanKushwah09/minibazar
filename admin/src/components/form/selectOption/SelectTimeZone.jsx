import React, { useState, useEffect } from "react";
import SearchableDropdown from "@/pages/SearchableDropdown";

//internal import
import { timeZones } from "@/utils/timezones";

const SelectTimeZone = ({ register, name, label, required, setValue, value }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const formatted = timeZones.map((timeZone) => ({
      value: timeZone.tzCode,
      label: timeZone.label,
    }));
    setOptions(formatted);
  }, []);

  const handleSelect = (selectedOption) => {
    console.log("TimeZone selected:", selectedOption);
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
        placeholder="Select Time Zone"
        value={selectedOption}
      />

      <input
        type="hidden"
        {...register(`${name}`, {
          required: required ? `${label} is required!` : false,
        })}
      />
    </>
  );
};

export default SelectTimeZone;
