// import React, { useEffect, useState } from "react";
// import CategoryServices from "@/services/CategoryServices";
// import SearchableDropdown from "@/pages/SearchableDropdown"; 

// const SelectCategory = ({ register, name, label, setValue }) => {
//   const [options, setOptions] = useState([]);

//   // Fetch category data on mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await CategoryServices.getActiveCategory();
//         if (res) {
//           const formatted = res.map((cat) => ({
//             value: cat._id,
//             label: cat.name,
//           }));
//           setOptions(formatted);
//         }
//       } catch (err) {
//         console.error("Error fetching categories", err);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleCategoryChange = (value) => {
//     // Sets the selected category value into react-hook-form
//     if (setValue) {
//       setValue(name, value);
//     }
//   };

//   return (
//     <SearchableDropdown
//       options={options}
//       onChange={handleCategoryChange}
//       placeholder="Select Category"
//     />
//   );
// };

// export default SelectCategory;




import React, { useState, useEffect } from "react";
import CategoryServices from "@/services/CategoryServices";
import SearchableDropdown from "@/pages/SearchableDropdown";

const SelectCategory = ({ setRole, register, name, label, setValue, value, required = true }) => {
  const [options, setOptions] = useState([]);

  const getCategories = async () => {
    try {
      const res = await CategoryServices.getActiveCategory();
      console.log("Categories loaded:", res);
      if (res) {
        const formatted = res.map((category) => ({
          value: category._id,
          label: category.name,
        }));
        setOptions(formatted);
      }
    } catch (err) {
      console.log("Error loading categories:", err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleSelect = (selectedOption) => {
    console.log("Category selected:", selectedOption);
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
        placeholder="Select Category"
        value={selectedOption}
      />

      <input
        type="hidden"
        {...(register ? register(name, required ? { required: `${label} is required!` } : {}) : {})}
      />
    </>
  );
};

export default SelectCategory;




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
