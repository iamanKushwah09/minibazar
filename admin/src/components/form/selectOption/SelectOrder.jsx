import React, { useState, useEffect } from "react";
import { Select } from "@windmill/react-ui";
import VendorGroupServices from "@/services/VendorGroupServices";


const SelectOrder = ({ setRole, register, name, label }) => {
  const [data, setData] = useState([])
  const getStaffData = async () => {
    try {
      const res = await VendorGroupServices.getActiveVendorGroup();
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
          Select Group
        </option>
        {data?.map(e => <option value={e._id}>{e.name}</option>)}
      </Select>
    </>
  );
};

export default SelectOrder;
