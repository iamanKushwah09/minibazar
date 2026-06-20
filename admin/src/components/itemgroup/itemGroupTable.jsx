import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";

//internal import

import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import ItemGroupDrawer from "@/components/drawer/ItemGroupDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ActiveInActiveButton from "@/components/table/ActiveInActiveButton";
import ShowHideButton from "@/components/table/ShowHideButton";

const itemGroupTable = ({ dataTable, lang }) => {
    const {
        title,
        serviceId,
        handleModalOpen,
        handleUpdate,
        isSubmitting,
        handleResetPassword,
    } = useToggleDrawer();
    
    console.log("DataTable :--", dataTable)
    console.log(" default image :--", `${import.meta.env.VITE_APP_API_BASE_URL}`)



    const { showDateFormat, showingTranslateValue } = useUtilsFunction();

    return (
        <>
            <DeleteModal id={serviceId} title={title} />

            <MainDrawer>
                <ItemGroupDrawer id={serviceId} />
            </MainDrawer>

            <TableBody>
                {dataTable?.map((e) => (
                    <TableRow key={e._id}>
                        <TableCell>
                            <img
                                src={e?.image ? `${import.meta.env.VITE_APP_API_SOCKET_URL}${e.image}` : "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"}
                                alt="Image"
                                className="w-16 h-16 object-cover rounded"
                            />
                        </TableCell>
                        <TableCell>
                            {e?.name}
                        </TableCell>

                        <TableCell>
                            <span className="text-sm">{e.alias}</span>{" "}
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{e.moq}</span>{" "}
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{e.discount}</span>{" "}
                        </TableCell>
                        <TableCell>
                            <span className="text-sm">{e.parent_name}</span>
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
                                title={showingTranslateValue(e?.name)}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </>
    );
};

export default itemGroupTable;
