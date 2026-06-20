// import React, { useState, useEffect } from "react";
// import ItemGroupServices from "@/services/ItemGroupServices";
// import SearchableDropdown from "@/pages/SearchableDropdown"; 
// const SelectItemGroup = ({ register, name, label, setValue }) => {
//   const [options, setOptions] = useState([]);

//   useEffect(() => {
//     const getItemGroups = async () => {
//       try {
//         const res = await ItemGroupServices.getActiveItemGroup();
//         if (res) {
//           const formatted = res.map((group) => ({
//             value: group._id,
//             label: group.name,
//           }));
//           setOptions(formatted);
//         }
//       } catch (err) {
//         console.log("Error fetching item groups:", err);
//       }
//     };

//     getItemGroups();
//   }, []);

//   const handleSelect = (value) => {
//     setValue(name, value); 
//   };

//   return (
//     <>
//       <SearchableDropdown
//         options={options}
//         onChange={handleSelect}
//         placeholder="Select Item Group"
//       />

//       {/* <input
//         type="hidden"
//         {...register(name, {
//           required: `${label} is required!`,
//         })}
//       /> */}
//     </>
//   );
// };

// export default SelectItemGroup;



// import { Select } from "@windmill/react-ui";
// import React from "react";
// import { useTranslation } from "react-i18next";

// //internal import

// import useAsync from "@/hooks/useAsync";
// import CategoryServices from "@/services/CategoryServices";
// import useUtilsFunction from "@/hooks/useUtilsFunction";

// const SelectCategory = ({ setCategory }) => {
//   // console.log('data category',data)
//   const { t } = useTranslation();
//   const { data } = useAsync(CategoryServices.getAllCategories);
//   const { showingTranslateValue } = useUtilsFunction();

//   return (
//     <>
//       <Select onChange={(e) => setCategory(e.target.value)}>
//         <option value="All" defaultValue hidden>
//           {t("Category")}
//         </option>
//         {data?.map((cat) => (
//           <option key={cat._id} value={cat._id}>
//             {showingTranslateValue(cat?.name)}
//           </option>
//         ))}
//       </Select>
//     </>
//   );
// };

// export default SelectCategory;





import React, { useState, useEffect } from "react";
import ItemGroupServices from "@/services/ItemGroupServices";
import SearchableDropdown from "@/pages/SearchableDropdown";

const SelectItemGroup = ({ setRole, register, name, label, value, setValue }) => {
  const [options, setOptions] = useState([]);

  console.log("SelectItemGroup - Current value:", value, "Name:", name);

  const getItemGroups = async () => {
    try {
      const res = await ItemGroupServices.getActiveItemGroup();
      console.log("Item Groups loaded:", res);
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
    console.log("ItemGroup selected:", selectedOption);
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
        placeholder="Select Item Group"
        value={selectedOption}
      />

      <input
        type="hidden"
        {...register(name)}
      />
    </>
  );
};

export default SelectItemGroup;
