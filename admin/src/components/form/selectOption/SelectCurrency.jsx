import React, { useState, useEffect } from "react";
import SearchableDropdown from "@/pages/SearchableDropdown";

//internal import
import useAsync from "@/hooks/useAsync";
import CurrencyServices from "@/services/CurrencyServices";

const SelectCurrency = ({
  register,
  name,
  label,
  required,
  setValue,
  value
}) => {
  const { data, loading } = useAsync(CurrencyServices.getShowingCurrency);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const formatted = data.map((currency) => ({
        value: currency.symbol,
        label: currency.name,
      }));
      setOptions(formatted);
    }
  }, [data]);

  const handleSelect = (selectedOption) => {
    console.log("Currency selected:", selectedOption);
    const valueToSet = selectedOption?.value || selectedOption;
    if (setValue) {
      setValue(name, valueToSet);
    }
  };

  // Find the selected option for display
  const selectedOption = options.find(option => option.value === value);

  return (
    <>
      {loading ? (
        <div>Loading currencies...</div>
      ) : (
        <>
          <SearchableDropdown
            options={options}
            onChange={handleSelect}
            placeholder="Select Currency"
            value={selectedOption}
          />

          <input
            type="hidden"
            {...register(`${name}`, {
              required: required ? `${label} is required!` : false,
            })}
          />
        </>
      )}
    </>
  );
};
export default SelectCurrency;
