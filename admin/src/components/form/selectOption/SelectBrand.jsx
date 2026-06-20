// import React, { useState, useEffect } from "react";
// import brandServices from "@/services/BrandServices";
// import SearchableDropdown from "@/pages/SearchableDropdown"; 
// const SelectBrand = ({ register, name, label, setValue }) => {
//   const [options, setOptions] = useState([]);

//   useEffect(() => {
//     const getBrands = async () => {
//       try {
//         const res = await brandServices.getActiveBrand();
//         if (res) {
//           const formatted = res.map((brand) => ({
//             value: brand._id,
//             label: brand.name,
//           }));
//           setOptions(formatted);
//         }
//       } catch (err) {
//         console.log("Error fetching brands:", err);
//       }
//     };

//     getBrands();
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

//       <input
//         type="hidden"
//         {...register(name, {
//           required: `${label} is required!`,
//         })}
//       />
//     </>
//   );
// };

// export default SelectBrand;




import React, { useState, useEffect } from "react";
import BrandServices from "@/services/BrandServices";
import SearchableDropdown from "@/pages/SearchableDropdown";

const SelectBrand = ({ setRole, register, name, label, setValue, value }) => {
  const [options, setOptions] = useState([]);

  const getBrands = async () => {
    try {
      const res = await BrandServices.getActiveBrand();
      console.log("Brands loaded:", res);
      if (res) {
        const formatted = res.map((brand) => ({
          value: brand._id,
          label: brand.name,
        }));
        setOptions(formatted);
      }
    } catch (err) {
      console.log("Error loading brands:", err);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  const handleSelect = (selectedOption) => {
    console.log("Brand selected:", selectedOption);
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
        placeholder="Select Brand"
        value={selectedOption}
      />

      <input
        type="hidden"
        {...register(name)}
      />
    </>
  );
};

export default SelectBrand;
