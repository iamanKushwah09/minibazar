import React from "react";
import { TableCell, TableBody, TableRow } from "@windmill/react-ui";

//internal import
import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import SelectStatus from "@/components/form/selectOption/SelectStatus";
import DispatchRealDrawer from "@/components/drawer/DispatchRealDrawer";

// import Status from '../table/Status';
// import SelectStatus from '../form/SelectStatus';





const CustomerOrderTable = ({ orders, dataTable }) => {
  const { showDateTimeFormat, getNumberTwo, currency } = useUtilsFunction();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState(null);
  const [visible, setVisible] = React.useState(false);

  const handleOpen = (order) => {
    setSelectedData(order);
    setIsModalOpen(true);
    setVisible(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setVisible(false);
  };

  const displayOrders = orders || dataTable;

  return (
    <>
      <TableBody>
        {displayOrders?.map((order) => (
          <TableRow key={order._id}>
            <TableCell
              className="cursor-pointer text-lg font-bold bg-slate-100 text-center hover:text-green-600"
              onClick={() => handleOpen(order)}
            >
              {order?._id?.substring(20, 24)}
            </TableCell>
            <TableCell>
              <span className="text-sm">{showDateTimeFormat(order.createdAt)}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{order?.user_info?.address}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{order.user_info?.contact}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-semibold">{order.paymentMethod}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-semibold">
                {currency}
                {getNumberTwo(order.total)}
              </span>
            </TableCell>
            <TableCell className="text-center">
              <Status status={order.status} />
            </TableCell>
            <TableCell className="text-right">
              <SelectStatus id={order._id} order={order} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      {/* Conditionally render the drawer if open */}
      {isModalOpen && selectedData && (
        <DispatchRealDrawer
          visible={visible}
          setVisible={setVisible}
          data={selectedData}
          handleClose={handleClose}
        />
      )}
    </>
  );
};

export default CustomerOrderTable;
