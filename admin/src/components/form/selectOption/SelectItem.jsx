// import React, { useState, useEffect } from "react";
// import ItemServices from "@/services/ItemServices";
// import SearchableDropdown from "@/components/SearchableDropdown"; // adjust path if needed

// const SelectItem = ({ register, name, label, setValue }) => {
//   const [options, setOptions] = useState([]);

//   useEffect(() => {
//     const getItems = async () => {
//       try {
//         const res = await ItemServices.getActiveItem();
//         if (res && Array.isArray(res)) {
//           const formatted = res.map((item) => ({
//             value: item._id,
//             label: item.name,
//           }));
//           setOptions(formatted);
//         }
//       } catch (err) {
//         console.error("Error fetching items: ", err);
//       }
//     };

//     getItems();
//   }, []);

//   const handleSelect = (value) => {
//     setValue(name, value);
//   };

//   return (
//     <>
//       <SearchableDropdown
//         options={options}
//         onChange={handleSelect}
//         placeholder="Select Item"
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

// export default SelectItem;





// import React, { useState, useEffect } from "react";
// import { Select } from "@windmill/react-ui";
// import ItemServices from "@/services/ItemServices";


// const SelectItem = ({ setRole, register, name, label }) => {
//   const [data, setData] = useState([])
//   const getStaffData = async () => {
//     try {
//       const res = await ItemServices.getActiveItem();
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
//           Select Item
//         </option>
//         {data?.map(e => <option value={e._id}>{e.name}</option>)}
//       </Select>
//     </>
//   );
// };

// export default SelectItem;


// import React, { useState } from 'react';
// import Select from 'react-select';

// const ReactSelectExample = () => {
//   const [selectedOptions, setSelectedOptions] = useState([]);

//   const options = [
//     { value: 'Option 1', label: 'Option 1' },
//     { value: 'Option 2', label: 'Option 2' },
//     { value: 'Option 3', label: 'Option 3' },
//     { value: 'Option 4', label: 'Option 4' },
//     { value: 'Option 5', label: 'Option 4' },
//     { value: 'Option 6', label: 'Option 4' },
//     { value: 'Option 7', label: 'Option 4' },
//     { value: 'Option 8', label: 'Option 4' },
//   ];

//   const handleChange = (selected) => {
//     setSelectedOptions(selected || []);
//   };

//   return (
//     <div>
//       <label htmlFor="multi-select">Choose options:</label>
//       <Select
//         id="multi-select"
//         isMulti
//         options={options}
//         value={selectedOptions}
//         onChange={handleChange}
//       />
//       <div>
//         Selected: {selectedOptions.map((opt) => opt.label).join(', ')}
//       </div>
//     </div>
//   );
// };

// export default ReactSelectExample;
