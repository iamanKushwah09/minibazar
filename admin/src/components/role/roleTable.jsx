import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";

//internal import

import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import RoleDrawer from "@/components/drawer/RoleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ActiveInActiveButton from "@/components/table/ActiveInActiveButton";
import ShowHideButton from "@/components/table/ShowHideButton";

const RoleTable = ({ roles, lang }) => {
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
                <RoleDrawer id={serviceId} />
            </MainDrawer>

            <TableBody>
                {roles?.map((role) => (
                    <TableRow key={role._id}>
                        <TableCell>
                            <h2 className="text-sm font-medium">
                                {role?.name}
                            </h2>
                        </TableCell>

                        <TableCell>
                            <span className="text-sm">{role.description}</span>{" "}
                        </TableCell>
                        <TableCell className="text-center">
                            <ShowHideButton id={role?._id} status={role?.is_active} />
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

export default RoleTable;
