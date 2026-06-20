import React, { useState, useEffect } from "react";
import CountryStateCityServices from "@/services/CountryStateCityServices";
import SearchableDropdown from "@/pages/SearchableDropdown";

const SelectCountry = ({ setCountry, register, name, label, setValue, value, required = true }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("SelectCountry component rendered with value:", value);

  const getCountryData = async () => {
    try {
      const res = await CountryStateCityServices.getCountry();
      if (res) {
        console.log("Fetched countries:", res);
        const formatted = res.map((country) => ({
          value: country.id || country._id,
          label: country.name,
        }));
        setOptions(formatted);
        console.log("Formatted countries:", formatted);
      }
    } catch (err) {
      console.error("Error fetching countries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCountryData();
  }, []);

  const handleSelect = (selectedValue) => {
    console.log("Country selected:", selectedValue);
    if (setValue) {
      setValue(name, selectedValue?.value || selectedValue);
    }
    if (setCountry) {
      setCountry(selectedValue?.value || selectedValue);
    }
  };

  return (
    <>
      <SearchableDropdown
        options={options}
        onChange={handleSelect}
        value={value ? options.find(opt => opt.value === value) : null}
        placeholder={loading ? "Loading countries..." : "Select Country"}
        disabled={loading}
      />

      <input
        type="hidden"
        {...register(name, required ? {
          required: `${label} is required!`,
        } : {})}
      />
    </>
  );
};

export default SelectCountry;
