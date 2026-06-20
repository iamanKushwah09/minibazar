import React, { useState, useEffect } from "react";
import SearchableDropdown from "@/pages/SearchableDropdown";

const SelectVendor = ({ register, name, onChange, value, setValue }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const vendorOptions = [
      { value: "Vendor", label: "Vendor" },
      { value: "Customer", label: "Customer" }
    ];
    setOptions(vendorOptions);
  }, []);

  const handleSelect = (selectedOption) => {
    console.log("Vendor type selected:", selectedOption);
    const valueToSet = selectedOption?.value || selectedOption;
    if (onChange) {
      onChange({ target: { value: valueToSet } });
    }
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
        placeholder="Select Vendor Type"
        value={selectedOption}
      />

      <input
        type="hidden"
        {...register("customers_type")}
      />
    </>
  );
};

export default SelectVendor;
