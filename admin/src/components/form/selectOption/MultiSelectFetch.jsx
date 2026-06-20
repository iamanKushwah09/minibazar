import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";

const MultiSelectFetch = ({
  name,
  label,
  placeholder = "Select...",
  fetchOptions, // async function to fetch options
  setValue, // from react-hook-form
  register, // from react-hook-form
  errors,
  required = false,
  defaultValue = [],
  onSelectionChange, // optional callback for selection changes
}) => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(defaultValue);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    // Fetch options on mount
    const fetchData = async () => {
      try {
        // console.log(`MultiSelectFetch - Fetching data for ${name}`);
      const res = await fetchOptions();
        // console.log(`MultiSelectFetch - Raw response for ${name}:`, res);
      if (res) {
        const formatted = res.map((item) => ({
          value: item._id,
          label: item.name,
        }));
          //  console.log(`MultiSelectFetch - Formatted options for ${name}:`, formatted);
        setOptions(formatted);
        }
      } catch (error) {
        console.error(`MultiSelectFetch - Error fetching options for ${name}:`, error);
      }
    };
    fetchData();
  }, [fetchOptions, name]);

  // Register the field with react-hook-form
  useEffect(() => {
    // Unregister first to clean up any existing registration
    // Then register with new requirements
    const cleanup = register(name, { required });
    
    // Cleanup function to unregister the field when component unmounts or key changes
    return () => {
      // Unregister the field to prevent conflicts
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [register, name, required]);

  // Update react-hook-form value when selection changes
  useEffect(() => {
    setValue(name, selected.map((item) => item.value));
    if (onSelectionChange) {
      onSelectionChange(selected);
    }
  }, [selected, setValue, name, onSelectionChange]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef}>
      {label && <label className="block mb-1 font-semibold">{label}</label>}
      <Select
        ref={selectRef}
        isMulti
        name={name}
        options={options}
        value={selected}
        onChange={setSelected}
        placeholder={placeholder}
        className="basic-multi-select"
        classNamePrefix="select"
        menuIsOpen={isMenuOpen}
        onMenuOpen={() => setIsMenuOpen(true)}
        onMenuClose={() => setIsMenuOpen(false)}
        onBlur={() => setIsMenuOpen(false)}
        blurInputOnSelect={true}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        styles={{
          control: (provided, state) => ({
            ...provided,
            minHeight: '38px',
            border: state.isFocused ? '1px solid #10b981' : '1px solid #d1d5db',
            boxShadow: state.isFocused ? '0 0 0 1px #10b981' : 'none',
            '&:hover': {
              border: '1px solid #10b981'
            }
          }),
          menu: (provided) => ({
            ...provided,
            zIndex: 9999,
            position: 'absolute',
            width: '100%',
            maxHeight: '200px',
            overflow: 'hidden'
          }),
          menuList: (provided) => ({
            ...provided,
            maxHeight: '200px',
            overflow: 'auto'
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#10b981',
            color: 'white',
            margin: '2px'
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: 'white'
          }),
          multiValueRemove: (provided) => ({
            ...provided,
            color: 'white',
            '&:hover': {
              backgroundColor: '#059669',
              color: 'white'
            }
          }),
          container: (provided) => ({
            ...provided,
            position: 'relative'
          })
        }}
      />
      {errors && errors[name] && (
        <div className="text-red-500 text-xs mt-1">{errors[name].message}</div>
      )}
    </div>
  );
};

export default MultiSelectFetch;