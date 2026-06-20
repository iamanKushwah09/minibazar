import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";

//internal import

import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import ShippingDrawer from "@/components/drawer/ShippingDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ActiveInActiveButton from "@/components/table/ActiveInActiveButton";

const shippingTable = ({ dataTable, lang }) => {
    const {
        title,
        serviceId,
        handleModalOpen,
        handleUpdate,
        isSubmitting,
        handleResetPassword,
    } = useToggleDrawer();

    const { showDateFormat, showingTranslateValue } = useUtilsFunction();

    return (
        <>
            <DeleteModal id={serviceId} title={title} />

            <MainDrawer>
                <ShippingDrawer id={serviceId} />
            </MainDrawer>

            <TableBody>
                {dataTable?.map((role) => (
                    <TableRow key={role._id}>

                        <TableCell>
                            <span className="text-sm">{role.bill_amount}</span>{" "}
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{role.shipping_charge}</span>{" "}
                        </TableCell>

                        <TableCell>
                            <EditDeleteButton
                                id={role._id}
                                role={role}
                                isSubmitting={isSubmitting}
                                handleUpdate={handleUpdate}
                                handleModalOpen={handleModalOpen}
                                handleResetPassword={handleResetPassword}
                                title={showingTranslateValue(role?.name)}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </>
    );
};

export default shippingTable;
