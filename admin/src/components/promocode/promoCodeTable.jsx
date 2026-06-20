import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";

//internal import

import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import PromoCodeDrawer from "@/components/drawer/PromoCodeDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ActiveInActiveButton from "@/components/table/ActiveInActiveButton";
import ShowHideButton from "@/components/table/ShowHideButton";

const promoCodeTable = ({ dataTable, lang }) => {
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
                <PromoCodeDrawer id={serviceId} />
            </MainDrawer>

            <TableBody>
                {dataTable?.map((role) => (
                    <TableRow key={role._id}>
                        <TableCell>
                            <span className="text-sm">{role.coupon_code}</span>{" "}
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{role.discount_percentage}</span>{" "}
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{role.max_discount_price}</span>{" "}
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{role.use_per_user}</span>{" "}
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{role.expiry_date}</span>{" "}
                        </TableCell>
                        <TableCell className="text-center">
                            <ShowHideButton id={role._id} status={role.is_active} />
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

export default promoCodeTable;
