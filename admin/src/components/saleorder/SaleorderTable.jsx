import { TableBody, TableCell, TableRow, Button } from "@windmill/react-ui";
import React, { useState, useContext } from "react";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ShowHideButton from "@/components/table/ShowHideButton";
import SaleOrderDrawer from "../drawer/SaleOrderDrawer";
import SaleOrderServices from "@/services/SaleOrderServices";
import { notifySuccess, notifyError } from "@/utils/toast";
import CustomerDetailsModal from "@/components/modal/CustomerDetailsModal";
import PrintSaleOrder from "./PrintSaleOrder";
import { FiEye } from "react-icons/fi";
import { SidebarContext } from "@/context/SidebarContext";

const SaleOrderTable = ({ dataTable }) => {
    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const { setIsUpdate } = useContext(SidebarContext);

    const {
        title,
        serviceId,
        handleModalOpen,
        handleUpdate,
        handleView,
        isViewOnly,
        handleEdit,
        isSubmitting,
        handleResetPassword,
    } = useToggleDrawer();

    const { showDateFormat, showingTranslateValue } = useUtilsFunction();

    const handleViewCustomerDetails = (customer) => {
        setSelectedCustomer(customer);
        setCustomerModalOpen(true);
    };

    const handleProcess = async (id) => {
        try {
            const response = await SaleOrderServices.processSaleOrder(id);
            if (response.status) {
                notifySuccess(response.message || "Sale order processed successfully");
                console.log(`Sale order ${id} processed successfully`);
                // Refresh the data to show updated busyApiStatus
                setIsUpdate(true);
            } else {
                notifyError(response.message || "Failed to process sale order");
            }
        } catch (error) {
            console.error("Error processing sale order:", error);
            notifyError(error?.response?.data?.message || "Error processing sale order");
        }
    };

    const handlePrint = (id) => {
        setSelectedOrderId(id);
        setPrintModalOpen(true);
    };

    const handleClosePrintModal = () => {
        setPrintModalOpen(false);
        setSelectedOrderId(null);
    };

    return (
        <>
            <DeleteModal id={serviceId} title={title} />
            <MainDrawer product={true}>
                <SaleOrderDrawer id={serviceId} isViewOnly={isViewOnly} />
            </MainDrawer>
            <CustomerDetailsModal
                isOpen={customerModalOpen}
                onClose={() => {
                    setCustomerModalOpen(false);
                    setSelectedCustomer(null);
                }}
                customer={selectedCustomer}
            />
            <PrintSaleOrder
                isOpen={printModalOpen}
                onClose={handleClosePrintModal}
                orderId={selectedOrderId}
            />
            <TableBody>
                {dataTable?.map((e) => (

                    <TableRow key={e._id}>
                        <TableCell
                            onClick={() => handleView(e._id)}
                            className="cursor-pointer  text-lg font-bold bg-slate-100 text-center hover:text-green-600"
                        >
                            {e?.voucherNo}
                        </TableCell>
                        <TableCell
                            onClick={() => handleView(e._id)}
                            className="cursor-pointer  text-lg font-bold bg-slate-100 text-center hover:text-green-600"
                        >
                            {e?.customer?.group_type}
                        </TableCell>
                        <TableCell
                            onClick={() => handleView(e._id)}
                            className="cursor-pointer  text-lg font-bold bg-slate-100 text-center hover:text-green-600"
                        >
                            {e?.netAmount}
                        </TableCell>
                        <TableCell>
                            <h2 className="text-sm font-medium">
                                {e?.date?.split("T")[0]}
                            </h2>
                        </TableCell>
                        <TableCell>
                            <h2 className="text-sm font-medium">
                                {e?.saleType?.name}
                            </h2>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">
                                    {e?.customer?.name || "N/A"}
                                </div>
                                {(e?.customer?.is_guest || e?.directCustomer) && (
                                    <Button
                                        layout="outline"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleViewCustomerDetails(e.directCustomer || e.customer);
                                        }}
                                        className="ml-2 p-2 h-8 w-8"
                                        title="View Customer Details"
                                    >
                                        <FiEye className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            <h2 className="text-sm font-medium">
                                {e?.salesman?.name}
                            </h2>
                        </TableCell>
                        <TableCell className="text-center">
                            <ShowHideButton
                                id={e._id}
                                status={e.isActive}
                                disabled={e.busyApiStatus === 'SUCCESS'}
                            />
                        </TableCell>
                        <TableCell>
                            <EditDeleteButton
                                id={e._id}
                                role={e}
                                isSubmitting={isSubmitting}
                                handleUpdate={handleEdit}
                                handleModalOpen={handleModalOpen}
                                handleResetPassword={handleResetPassword}
                                handleProcess={handleProcess}
                                handlePrint={handlePrint}
                                title={""}
                                busyApiStatus={e.busyApiStatus}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </>
    );
};

export default SaleOrderTable;
