import React, { useState, useEffect } from "react";
import CountryStateCityServices from "@/services/CountryStateCityServices";
import SearchableDropdown from "@/pages/SearchableDropdown"; 

const SelectCity = ({ register, name, label, setValue, setCity, state_id, country_id, value, required = true }) => {
  const [options, setOptions] = useState([]);
  console.log("SelectCity component rendered with state_id:", state_id, "country_id:", country_id);

  useEffect(() => {
    const getCities = async () => {
      console.log("Fetching cities for state_id:", state_id, "country_id:", country_id);
      if (!state_id || !country_id) {
        setOptions([]);
        console.log("No state_id or country_id provided, skipping city fetch.");
        return;
      }
      try {
        const res = await CountryStateCityServices.getCity(country_id, state_id);
        console.log("Fetched cities for state_id", state_id, res);
        if (res) {
          const formatted = res.map((city) => ({
            value: city.id || city._id,
            label: city.name,
          }));
          setOptions(formatted);
          console.log("Formatted cities:", formatted);
        }
      } catch (err) {
        console.log("Error fetching cities:", err);
      }
    };

    getCities();
  }, [state_id, country_id]);

  const handleSelect = (selectedValue) => {
    console.log("City selected:", selectedValue);
    if (setValue) {
      setValue(name, selectedValue?.value || selectedValue);
    }
    if (setCity) {
      setCity(selectedValue?.value || selectedValue);
    }
  };

  return (
    <>
      <SearchableDropdown
        options={options}
        onChange={handleSelect}
        value={value ? options.find(opt => opt.value === value) : null}
        placeholder="Select City"
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

export default SelectCity;







// import React, { useState, useEffect } from "react";
// import { Select } from "@windmill/react-ui";
// import CountryStateCityServices from "@/services/CountryStateCityServices";


// const SelectCity = ({ setCity, register, name, label, country_id, state_id,value }) => {
//     const [data, setData] = useState([])
//     const getStaffData = async (country_id, state_id) => {
//         try {
//             if (!(country_id && state_id)) return;
//             const res = await CountryStateCityServices.getCity(country_id, state_id);
//             if (res) {
//                 setData(res)
//             }
//         } catch (err) {
//             console.log({ err })
//         }
//     };
//     useEffect(() => {
//         getStaffData(country_id, state_id);
//     }, [country_id, state_id])

//     return (
//         <>
//             <Select
//                 onChange={(e) => setCity(e.target.value)}
//                 name={name}
//                 value={value}
//             >
//                 <option value="" defaultValue hidden>
//                     Select City
//                 </option>
//                 {data?.map((e, i) => <option key={i} value={e.id}>{e.name}</option>)}
//             </Select>
//         </>
//     );
// };

// export default SelectCity;
