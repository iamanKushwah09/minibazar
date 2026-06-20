import React from 'react';

const CheckBox = ({ id, name, type, handleClick, isChecked , value }) => {
  return (
    <>
      <input
        id={id}
        name={name}
        type={type}
        onChange={handleClick}
        checked={isChecked}
        value={value}
      />
    </>
  );
};

export default CheckBox;
