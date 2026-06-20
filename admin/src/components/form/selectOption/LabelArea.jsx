import React from "react";
import { Label } from "@windmill/react-ui";

const LabelArea = ({ label, status = false }) => {
  return (
    <Label className="col-span-4 sm:col-span-2 font-medium text-sm">
      {label}{status && <span style={{ color: 'red' }}>*</span>}
    </Label>
  );
};

export default LabelArea;
