// import React, { useState, useEffect } from "react";
// import UnitServices from "@/services/UnitServices";
// import SearchableDropdown from "@/pages/SearchableDropdown"; 
// const SelectUnit = ({ register, name, label, setValue }) => {
//   const [options, setOptions] = useState([]);

//   useEffect(() => {
//     const getUnits = async () => {
//       try {
//         const res = await UnitServices.getActiveUnit();
//         if (res) {
//           const formatted = res.map((unit) => ({
//             value: unit._id,
//             label: unit.name,
//           }));
//           setOptions(formatted);
//         }
//       } catch (err) {
//         console.log("Error fetching units:", err);
//       }
//     };

//     getUnits();
//   }, []);

//   const handleSelect = (value) => {
//     console.log({name,value})
//     setValue(name, value); 
//   };

//   return (
//     <>
//       <SearchableDropdown
//         options={options}
//         onChange={handleSelect}
//         placeholder="Select Unit"
//       />

//       <input
//         type="hidden"
//         {...register(name, {
//           required: `${label} is required!`,
//         })}
//       />
//     </>
//   );
// };

// export default SelectUnit;






import React, { useState, useEffect } from "react";
import UnitServices from "@/services/UnitServices";
import SearchableDropdown from "@/pages/SearchableDropdown";

const SelectUnit = ({ setRole, register, name, label, setValue, value, required = false }) => {
  const [options, setOptions] = useState([]);

  const getUnits = async () => {
    try {
      const res = await UnitServices.getActiveUnit();
      console.log("Units loaded:", res);
      if (res) {
        const formatted = res.map((unit) => ({
          value: unit._id,
          label: unit.name,
        }));
        setOptions(formatted);
      }
    } catch (err) {
      console.log("Error loading units:", err);
    }
  };

  useEffect(() => {
    getUnits();
  }, []);

  const handleSelect = (selectedOption) => {
    console.log("Unit selected:", selectedOption);
    const valueToSet = selectedOption?.value || selectedOption;
    if (setRole) {
      setRole(valueToSet);
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
        placeholder="Select Unit"
        value={selectedOption}
      />

      <input
        type="hidden"
        {...register(name, {
          required: required ? `${label} is required!` : false,
        })}
      />
    </>
  );
};

export default SelectUnit;
