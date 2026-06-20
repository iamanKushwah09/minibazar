import React, { useState, useEffect } from "react";
import { Select } from "@windmill/react-ui";
import CategoryServices from "@/services/CategoryServices";


const SelectCategoryGroup = ({ setRole, register, name, label }) => {
  const [data, setData] = useState([])
  const getStaffData = async () => {
    try {
      const res = await CategoryServices.getActiveCategory();
      if (res) {
        setData(res)
      }
    } catch (err) {
      console.log({ err })
    }
  };
  useEffect(() => {
    getStaffData();
  }, [])

  return (
    <>
      <Select
        onChange={(e) => setRole(e.target.value)}
        name={name}
        {...register(`${name}`, {
          required: `${label} is required!`,
        })}
      >
        <option value="" defaultValue hidden>
          Select Item Group
        </option>
        {data?.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
      </Select>
    </>
  );
};

export default SelectCategoryGroup;
