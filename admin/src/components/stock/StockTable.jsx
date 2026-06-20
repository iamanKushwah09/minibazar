import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";

//internal import

import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import StockDrawer from "@/components/drawer/StockDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ActiveInActiveButton from "@/components/table/ActiveInActiveButton";
import ShowHideButton from "@/components/table/ShowHideButton";
import Tooltip from "@/components/tooltip/Tooltip";

const StockTable = ({ dataTable, lang, isShow = true }) => {
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

            <MainDrawer product={true}>
                <StockDrawer id={serviceId} />
            </MainDrawer>

            <TableBody>
                {dataTable?.map((role) => {
                    return (
                        <TableRow key={role._id}>
                            <TableCell>
                                <h2 className="text-sm font-medium">{role?.name}</h2>
                            </TableCell>
                            <TableCell><span className="text-sm font-semibold">{role.stock || 0}</span></TableCell>
                            <TableCell><span className="text-sm">{role.alias}</span></TableCell>
                            <TableCell><span className="text-sm">{role.category_id?.name}</span></TableCell>
                            <TableCell><span className="text-sm">{role.item_group_id?.name}</span></TableCell>
                            <TableCell><span className="text-sm">{role.brand_id?.name}</span></TableCell>
                            <TableCell><span className="text-sm">{role.unit_id?.name}</span></TableCell>
                            <TableCell><span className="text-sm">{role.alternate_unit}</span></TableCell>
                            {/* <TableCell><span className="text-sm">{role.conversion_factor}</span></TableCell> */}
                            {/* <TableCell><span className="text-sm">{role.tax_gst}</span></TableCell> */}
                            {/* <TableCell><span className="text-sm">{role.hsn_code}</span></TableCell> */}
                            <TableCell><span className="text-sm">{role.sale_price}</span></TableCell>
                            <TableCell><span className="text-sm">{role.mrp}</span></TableCell>
                            {/* <TableCell><span className="text-sm">{role.discount}</span></TableCell> */}
                            {/* <TableCell><span className="text-sm">{role.vendor_discount}</span></TableCell> */}
                            {/* <TableCell><span className="text-sm">{role.specification}</span></TableCell> */}
                            {/* <TableCell><span className="text-sm">{role.long_description}</span></TableCell> */}
                            {/* <TableCell><span className="text-sm">{role.short_description}</span></TableCell> */}
                            {isShow ? <>
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
                                </TableCell></> : <TableCell className="text-center">
                                <EditDeleteButton
                                    id={role._id}
                                    role={role}
                                    isSubmitting={isSubmitting}
                                    handleUpdate={handleUpdate}
                                    handleModalOpen={handleModalOpen}
                                    handleResetPassword={handleResetPassword}
                                    title={"View"}
                                    isShow
                                />
                            </TableCell>}
                        </TableRow>
                    )
                })}
            </TableBody>
        </>
    );
};

export default StockTable;
