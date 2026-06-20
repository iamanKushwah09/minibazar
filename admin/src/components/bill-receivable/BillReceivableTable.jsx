import React from "react";
import { TableCell, TableRow } from "@windmill/react-ui";
import { formatDateToMDY } from "@/utils/dateFormatter"; // optional formatter


const BillsReceivableTable = ({ data }) => {

    const totalBillAmt = data?.reduce(
    (acc, item) => acc + (item?.BillAmt || 0),
    0
  );

  const totalPendingAmt = data?.reduce(
    (acc, item) => acc + (item?.PendingAmt || 0),
    0
  );
    console.log("BillsReceivableTable data: in table", data);
  return (
    <tbody>
      {data?.map((item, index) => (
        <TableRow key={`${item.Name}-${index}`}>
          <TableCell className="text-sm">{item.Name || "-"}</TableCell>
          <TableCell className="text-sm">{item.VchNo || "-"}</TableCell>
          <TableCell className="text-sm">{item.VchDate || "-"}</TableCell>
          <TableCell className="text-sm">
            ₹{(item.BillAmt ?? 0).toFixed(2)}
          </TableCell>
          <TableCell className="text-sm">
            ₹{(item.PendingAmt ?? 0).toFixed(2)}
          </TableCell>
          <TableCell className="text-sm">{item.Days}</TableCell>
        </TableRow>
      ))}
      <TableRow className="bg-gray-100 dark:bg-gray-700 font-semibold">
        <TableCell colSpan={3} className="text-right">
          Total
        </TableCell>
        <TableCell>₹{totalBillAmt.toFixed(2)}</TableCell>
        <TableCell>₹{totalPendingAmt.toFixed(2)}</TableCell>
        <TableCell></TableCell>
      </TableRow>
    </tbody>
  );
};

export default BillsReceivableTable;
