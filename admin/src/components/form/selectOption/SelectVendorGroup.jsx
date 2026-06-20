import React, { useState, useEffect } from "react";
import VendorGroupServices from "@/services/VendorGroupServices";
import SearchableDropdown from "@/pages/SearchableDropdown"; 
const SelectVendorGroup = ({ register, name, label, setValue, defaultValue, setVendorGroup, required = true }) => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");

  console.log("defaultValue", defaultValue)
  console.log("selectedValue", selectedValue)

  useEffect(() => {
    const getVendorGroups = async () => {
      try {
        const res = await VendorGroupServices.getActiveVendorGroup();
        if (res) {
          const formatted = res.map((group) => ({
            value: group._id,
            label: group.name,
          }));
          setOptions(formatted);
          
          // If we have a defaultValue and options are loaded, set the value
          if (defaultValue && formatted.length > 0) {
            setSelectedValue(defaultValue);
            setValue(name, defaultValue);
          }
        }
      } catch (err) {
        console.log("Error fetching vendor groups:", err);
      }
    };

    getVendorGroups();
  }, []);

  // Update selected value when defaultValue changes
  useEffect(() => {
    if (defaultValue && options.length > 0) {
      // Handle case where defaultValue might be an object or string
      const valueToSet = typeof defaultValue === 'object' ? defaultValue._id || defaultValue.value : defaultValue;
      setSelectedValue(valueToSet);
      setValue(name, valueToSet);
      if (setVendorGroup) {
        setVendorGroup(valueToSet);
      }
    }
  }, [defaultValue, options, setValue, name, setVendorGroup]);

  const handleSelect = (selectedOption) => {
    console.log("VendorGroup selected:", selectedOption);
    const valueToSet = selectedOption?.value || selectedOption;
    const stringValue = valueToSet ? String(valueToSet) : "";
    console.log("Setting vendor group value:", stringValue, "type:", typeof stringValue);
    setValue(name, stringValue);
    setSelectedValue(stringValue);
    if (setVendorGroup) {
      setVendorGroup(stringValue);
    }
  };

  // Find the label for the selected value
  const selectedOption = options.find(option => option.value === selectedValue);

  return (
    <>
      <SearchableDropdown
        options={options}
        onChange={handleSelect}
        placeholder="Select Vendor Group"
        value={selectedOption}
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

export default SelectVendorGroup;





// import React, { useState, useEffect } from "react";
// import { Select } from "@windmill/react-ui";
// import VendorGroupServices from "@/services/VendorGroupServices";

// const SelectVendorGroup = ({ setVendorGroup , register, name, label }) => {
//   const [data, setData] = useState([])
//   const getStaffData = async () => {
//     try {
//       const res = await VendorGroupServices.getActiveVendorGroup();
//       if (res) {
//         setData(res)
//       }
//     } catch (err) {
//       console.log({ err })
//     }
//   };
//   useEffect(() => {
//     getStaffData();
//   }, [])


//   return (
//     <>
//       <Select
//         onChange={(e) => { setVendorGroup(e.target.value) }}
//         name={name}
//         {...register(`${name}`, {
//           required: `${label} is required!`,
//         })}
//       >
//         <option value="" defaultValue hidden>
//           Select Group
//         </option>
//         {data?.map(e => <option value={e._id}>{e.name}</option>)}
//       </Select>
//     </>
//   );
// };

// export default SelectVendorGroup;
