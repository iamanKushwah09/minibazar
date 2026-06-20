import React, { useState, useEffect } from "react";
import RoleServices from "@/services/RoleServices";
import SearchableDropdown from "@/pages/SearchableDropdown";

const SelectRole = ({ setRole, register, name, label, setValue, value }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const getRoles = async () => {
      try {
        const res = await RoleServices.getActiveRole();
        if (res) {
          const formatted = res.map((role) => ({
            value: role._id,
            label: role.name,
          }));
          setOptions(formatted);
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    getRoles();
  }, []);

  const handleSelect = (selectedOption) => {
    const valueToSet = selectedOption?.value || selectedOption;
    console.log("valueToSet", valueToSet);
    if (setValue) {
      setValue(name, valueToSet);
    }
    if (setRole) {
      setRole(valueToSet);
    }
  };

  // Find the selected option for display
  const selectedOption = options.find((option) => option.value === value);

  return (
    <>
      <SearchableDropdown
        options={options}
        onChange={handleSelect}
        placeholder="Select Role"
        value={selectedOption}
      />

      <input
        type="hidden"
        {...register(name, {
          required: `${label} is required!`,
        })}
      />
    </>
  );
};

export default SelectRole;



// import React, { useState, useEffect } from "react";
// import { Select } from "@windmill/react-ui";
// import RoleServices from "@/services/RoleServices";


// const SelectRole = ({ setRole, register, name, label }) => {
//   const [data, setData] = useState([])
//   const getStaffData = async () => {
//     try {
//       const res = await RoleServices.getActiveRole();
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
//         onChange={(e) => setRole(e.target.value)}
//         name={name}
//         {...register(`${name}`, {
//           required: `${label} is required!`,
//         })}
//       >
//         <option value="" defaultValue hidden>
//           Select Role
//         </option>
        
//         {data?.map((e,i) => <option key={i} value={e._id}>{e.name}</option>)}
//       </Select>
//     </>
//   );
// };

// export default SelectRole;
