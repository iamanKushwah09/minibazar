import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";

//internal import

import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import OfferDrawer from "@/components/drawer/OfferDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ActiveInActiveButton from "@/components/table/ActiveInActiveButton";
import ShowHideButton from "@/components/table/ShowHideButton";

const offerTable = ({ dataTable, lang }) => {
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
                <OfferDrawer id={serviceId} />
            </MainDrawer>

            <TableBody>
                {dataTable?.map((e) => (
                    <TableRow key={e._id}>
                        <TableCell>
                            {e?.item?.map(item => item.label).join(',') || ''}
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{e.discount}</span>{" "}
                        </TableCell>
                        <TableCell className="text-center">
                            <ShowHideButton id={e._id} status={e.is_active} />
                        </TableCell>
                        <TableCell>
                            <EditDeleteButton
                                id={e._id}
                                role={e}
                                isSubmitting={isSubmitting}
                                handleUpdate={handleUpdate}
                                handleModalOpen={handleModalOpen}
                                handleResetPassword={handleResetPassword}
                                title={""}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </>
    );
};

export default offerTable;
