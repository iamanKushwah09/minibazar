import React, { useState, useEffect } from "react";
import CountryStateCityServices from "@/services/CountryStateCityServices";
import SearchableDropdown from "@/pages/SearchableDropdown"; 

const SelectState = ({ register, name, label, setValue, setState, country_id, value, required = true }) => {
  const [options, setOptions] = useState([]);
  console.log("SelectState component rendered with country_id:", country_id);

  useEffect(() => {
    const getStates = async () => {
      console.log("Fetching states for country_id:", country_id);
      if (!country_id) {
        setOptions([]);
        console.log("No country_id provided, skipping state fetch.");
        return;
      }
      try {
        const res = await CountryStateCityServices.getState(country_id);
        console.log("Fetched states for country_id", country_id, res);
        if (res) {
          const formatted = res.map((state) => ({
            value: state.id || state._id,
            label: state.name,
          }));
          setOptions(formatted);
          console.log("Formatted states:", formatted);
        }
      } catch (err) {
        console.log("Error fetching states:", err);
      }
    };

    getStates();
  }, [country_id]);

  const handleSelect = (selectedValue) => {
    console.log("State selected:", selectedValue);
    if (setValue) {
      setValue(name, selectedValue?.value || selectedValue);
    }
    if (setState) {
      setState(selectedValue?.value || selectedValue);
    }
  };

  return (
    <>
      <SearchableDropdown
        options={options}
        onChange={handleSelect}
        value={value ? options.find(opt => opt.value === value) : null}
        placeholder="Select State"
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

export default SelectState;




// import React, { useState, useEffect } from "react";
// import { Select } from "@windmill/react-ui";
// import CountryStateCityServices from "@/services/CountryStateCityServices";


// const SelectState = ({ setState, register, name, label, country_id,value }) => {
//   const [data, setData] = useState([])
//   const getStaffData = async () => {
//     try {
//       if (!country_id) return;
//       const res = await CountryStateCityServices.getState(country_id);
//       if (res) {
//         setData(res)
//       }
//     } catch (err) {
//       console.log({ err })
//     }
//   };
//   useEffect(() => {
//     getStaffData(country_id);
//   }, [country_id])

//   return (
//     <>
//       <Select
//         onChange={(e) => setState(e.target.value)}
//         name={name}
//         value={value}
//       >
//         <option value="" defaultValue hidden>
//           Select State
//         </option>
//         {data?.map((e, i) => <option key={i} value={e.id}>{e.name}</option>)}
//       </Select>
//     </>
//   );
// };

// export default SelectState;
