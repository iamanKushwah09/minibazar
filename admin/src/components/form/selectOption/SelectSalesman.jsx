import React, { useState, useEffect } from "react";
import Salesman from "@/services/SalesmanServices";
import SearchableDropdown from "@/pages/SearchableDropdown"; 
const SelectSalesman = ({ register, name, label, setValue, defaultValue, value, required = true }) => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(defaultValue || value || "");

  useEffect(() => {
    const getSalesmen = async () => {
      try {
        const res = await Salesman.activeAllSaleman();
        if (res) {
          const formatted = res.map((salesman) => ({
            value: salesman._id,
            label: salesman.name,
          }));
          setOptions(formatted);

          // If we have a defaultValue and options are loaded, set the value
          if ((defaultValue || value) && formatted.length > 0) {
            const valueToUse = defaultValue || value;
            setSelectedValue(valueToUse);
            setValue(name, valueToUse);
          }
        }
      } catch (err) {
        console.log("Error fetching salesmen:", err);
      }
    };

    getSalesmen();
  }, []);

  // Update selected value when defaultValue or value changes
  useEffect(() => {
    const valueToUse = defaultValue || value;
    if (valueToUse && options.length > 0) {
      setSelectedValue(valueToUse);
      setValue(name, valueToUse);
    }
  }, [defaultValue, value, options, setValue, name]);

  const handleSelect = (selectedOption) => {
    console.log("Salesman selected:", selectedOption);
    const valueToSet = selectedOption?.value || selectedOption;
    const stringValue = valueToSet ? String(valueToSet) : "";
    console.log("Setting salesman value:", stringValue, "type:", typeof stringValue);
    setValue(name, stringValue);
    setSelectedValue(stringValue);
  };

  // Find the selected option for display
  const selectedOption = options.find(option => option.value === selectedValue);

  return (
    <>
      <SearchableDropdown
        options={options}
        onChange={handleSelect}
        value={selectedOption}
        placeholder="Select Salesman"
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

export default SelectSalesman;





// import React, { useState, useEffect } from "react";
// import { Select } from "@windmill/react-ui";
// import SalesmanServices from "@/services/SalesmanServices";

// const SelectSalesman = ({ setRole, register, name, label }) => {
//   const [data, setData] = useState([])
//   const getSalesmanData = async () => {
//     try {
//       const res = await SalesmanServices.getAllSalesman();
//       if (res) {
//         setData(res)
//       }
//     } catch (err) {
//       console.log({ err })
//     }
//   };
//   useEffect(() => {
//     getSalesmanData();
//   }, [])

//   return (
//     <>
//       <Select
//         onChange={(e) => setRole(e.target.value)}
//         name={name}
//         {...register(`${name}`, {
//           required: `${label} is required!`,
//         })}
//       >
//         <option value="" defaultValue hidden>
//           Select Sales Person
//         </option>
//         {data?.map(e => <option value={e._id} key={e._id}>{e.name}</option>)}
//       </Select>
//     </>
//   );
// };

// export default SelectSalesman;
