import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import ItemServices from '@/services/ItemServices';

const MultiSelectItem = ({
  label = 'Choose options:',
  placeholder = 'Select...',
  isMulti = true,
  name,
  value,
  setSelectedOptions,
  selectedOptions
}) => {
  const [options, setOptions] = useState([]); // State for fetched options
  const [loading, setLoading] = useState(true); // Loading state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const selectRef = useRef(null);

  // API call to fetch options
  const getStaffData = async () => {
    try {
      const res = await ItemServices.getActiveItem();
      if (res) {
        // Map the fetched data to the format react-select requires
        const formattedOptions = res.map((item) => ({
          value: item._id,
          label: item.name,
        }));
        setOptions(formattedOptions);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStaffData(); // Fetch data when the component mounts
  }, []);

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

  const handleChange = (selected) => {
    setSelectedOptions(selected || []);
  };

  return (
    <div ref={selectRef}>
      {/* <label htmlFor="multi-select" style={{ display: 'block', marginBottom: '8px' }}>
        {label}
      </label> */}
      {loading ? (
        <p>Loading options...</p> // Show a loading message while fetching data
      ) : (
        <Select
          ref={selectRef}
          id="multi-select"
          isMulti={isMulti}
          options={options}
          value={selectedOptions}
          onChange={handleChange}
          placeholder={placeholder}
          name={name}
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
      )}
      {/* <div style={{ marginTop: '10px' }}>
        <strong>Selected:</strong>{' '}
        {selectedOptions.length > 0
          ? selectedOptions.map((opt) => opt.label).join(', ')
          : 'None'}
      </div> */}
    </div>
  );
};

export default MultiSelectItem;
