import React, { useState, useEffect } from "react";
import CategoryServices from "@/services/CategoryServices";
import SearchableDropdown from "@/pages/SearchableDropdown";

const SelectCategoryFilter = ({ setRole, value }) => {
  const [options, setOptions] = useState([]);

  const getCategories = async () => {
    try {
      const res = await CategoryServices.getActiveCategory();
      if (res) {
        const formatted = res.map((category) => ({
          value: category._id,
          label: category.name,
        }));
        setOptions(formatted);
      }
    } catch (err) {
      console.log("Error loading categories:", err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleSelect = (selectedOption) => {
    if (setRole) {
      setRole(selectedOption);
    }
  };

  // Find the selected option for display - handle both ID and object formats
  let selectedOption = null;
  if (value) {
    if (typeof value === 'object' && value.value && value.label) {
      // Already formatted correctly
      selectedOption = value;
    } else {
      // Find by label name and create the proper object
      const foundOption = options.find(option => option.label === value);
      selectedOption = foundOption || null;
    }
  }

  return (
    <SearchableDropdown
      options={options}
      onChange={handleSelect}
      placeholder="Select Category"
      value={selectedOption}
    />
  );
};

export default SelectCategoryFilter;