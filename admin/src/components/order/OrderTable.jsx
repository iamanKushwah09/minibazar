import { TableBody, TableCell, TableRow } from "@windmill/react-ui";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";

//internal import

import Status from "@/components/table/Status";
import Tooltip from "@/components/tooltip/Tooltip";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import DeleteModal from "@/components/modal/DeleteModal";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import PrintReceipt from "@/components/form/others/PrintReceipt";
import SelectStatus from "@/components/form/selectOption/SelectStatus";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import OrderDrawer from "../drawer/OrderDrawer";
import MainDrawer from "../drawer/MainDrawer";
import EditDeleteButtonTwo from "../table/EditDeleteButtonTwo";
import SaleOrderViewDrawer from "../drawer/SaleOrderViewDrawer";
import dayjs from "dayjs";
const OrderTable = ({ orders }) => {
  // console.log('globalSetting',globalSetting)
  const { t } = useTranslation();
  const { showDateTimeFormat, currency, getNumberTwo } = useUtilsFunction();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null); // To store the selected row data
  const [visible, setVisible] = useState(false);

  // console.log('orders',orders)

  const {
    title,
    serviceId,
    handleModalOpen,
    handleUpdate,
    isSubmitting,
    handleResetPassword,
  } = useToggleDrawer();

  const handleOpen = (e) => {
    setSelectedData(e); // Store selected row data
    setIsModalOpen(true); // Open modal or drawer
    setVisible(true)
    // handleUpdate(e.id);

  }
  const handleClose = (e) => {
    setSelectedData(e); // Store selected row data
    // setIsModalOpen(true); // Open modal or drawer
    setVisible(false)
    // handleUpdate(e.id);

  }

  return (
    <>
      <DeleteModal id={serviceId} title={title} />

      <MainDrawer product>
        <OrderDrawer id={serviceId} />
      </MainDrawer>

      <TableBody className="dark:bg-gray-900">
        {orders?.map((e, i) => (
          <TableRow key={i + 1}>
            <TableCell
              className="cursor-pointer  text-lg font-bold bg-slate-100 text-center hover:text-green-600"
              onClick={() => handleOpen(e)}

            >
              {e?.order_no}
            </TableCell>
            <TableCell>{ dayjs(e?.order_date).format("YYYY-MM-DD")}</TableCell>
            <TableCell>{e?.payment_mode}</TableCell>
            <TableCell>{e?.shipping_charge}</TableCell>
            <TableCell>{e?.total_amount}</TableCell>
            <TableCell>{e?.total_qty}</TableCell>

            <TableCell>
              <EditDeleteButtonTwo
                id={e._id}
                role={e}
                isSubmitting={isSubmitting}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                handleResetPassword={handleResetPassword}
                title={e?.name}
              />
            </TableCell>
          </TableRow>
        ))}
        {/* <TableCell className="text-right flex justify-end">
          <div className="flex justify-between items-center">
            <PrintReceipt orderId={order._id} />

            <span className="p-2 cursor-pointer text-gray-400 hover:text-blue-600">
              <Link to={`/order/${order._id}`}>
                <Tooltip
                  id="view"
                  Icon={FiZoomIn}
                  title={t("ViewInvoice")}
                  bgColor="#059669"
                />
              </Link>
            </span>
          </div>
        </TableCell> */}
      </TableBody>
      {isModalOpen && selectedData && (
        // <ShowModal
        //      // Pass the selected row data to the modal
        // closeModal={closeModal}
        //             isSubmitting={isSubmitting}
        //             handleUpdate={handleUpdate}
        //             handleModalOpen={handleModalOpen}
        //             handleResetPassword={handleResetPassword}
        //             title={""}
        //             flag={true}
        // />
        <SaleOrderViewDrawer
          visible={visible}
          setVisible={setVisible}
          data={selectedData}
          handleClose={handleClose}
        />
      )}
    </>
  );
};

export default OrderTable;
