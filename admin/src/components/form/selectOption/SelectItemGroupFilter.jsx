import React, { useState, useEffect } from "react";
import ItemGroupServices from "@/services/ItemGroupServices";
import SearchableDropdown from "@/pages/SearchableDropdown";

const SelectItemGroupFilter = ({ setRole, value }) => {
  const [options, setOptions] = useState([]);

  const getItemGroups = async () => {
    try {
      const res = await ItemGroupServices.getActiveItemGroup();
      if (res) {
        const formatted = res.map((group) => ({
          value: group._id,
          label: group.name,
        }));
        setOptions(formatted);
      }
    } catch (err) {
      console.log("Error loading item groups:", err);
    }
  };

  useEffect(() => {
    getItemGroups();
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
      placeholder="Select Item Group"
      value={selectedOption}
    />
  );
};

export default SelectItemGroupFilter;