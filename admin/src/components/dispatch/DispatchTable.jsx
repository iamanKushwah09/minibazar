import { TableBody, TableCell, TableRow, Button } from "@windmill/react-ui";
import React from "react";
// internal import
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ShowHideButton from "@/components/table/ShowHideButton";
import DispatchDrawer from "@/components/drawer/DispatchDrawer";
import DispatchRealDrawer from "../drawer/DispatchRealDrawer";
import dayjs from "dayjs";

// import ShowDrawer from "../drawer/ShowDrawer";
// import ShowModal from "../modal/ShowModal";

const DispatchTable = ({ dataTable, lang }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedData, setSelectedData] = React.useState(null); // To store the selected row data
    const [visible, setVisible] = React.useState(false);

    const {
        title,
        serviceId,
        handleModalOpen,
        handleUpdate,
        isSubmitting,
        handleResetPassword,
    } = useToggleDrawer();

    // Function to handle click on the first cell
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
    // console.log(selectedData);


    return (
        <>
            {/* <DeleteModal id={serviceId} title={title} /> */}
            <MainDrawer>
                <DispatchDrawer id={serviceId} />
            </MainDrawer>
            <TableBody>
                {dataTable?.map((e, i) => (
                    <TableRow key={i + 1}>
                        {/* First cell (order_no) now clickable */}
                        <TableCell
                            className="cursor-pointer  text-lg font-bold bg-slate-100 text-center hover:text-green-600"
                            onClick={() => handleOpen(e)}

                        >
                            {e?.voucherNo}
                        </TableCell>
                        <TableCell>{dayjs(e?.date).format("YYYY-MM-DD")}</TableCell>
                        <TableCell>Credit</TableCell>
                        <TableCell>{e?.customer?.name}</TableCell>
                        <TableCell>{e?.netAmount}</TableCell>
                        <TableCell>{e?.totalQuantity}</TableCell>
                        <TableCell>{e?.status}</TableCell>
                        <TableCell className="bg-slate-100 flex justify-center items-center">
                            <EditDeleteButton
                                id={e._id}
                                role={e}
                                isSubmitting={isSubmitting}
                                handleUpdate={handleUpdate}
                                handleModalOpen={handleModalOpen}
                                handleResetPassword={handleResetPassword}
                                title={""}
                                flag={true}
                            />
                        </TableCell>

                    </TableRow>
                ))}
            </TableBody>

            {/* Conditionally render the modal or component if the modal is open */}
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

export default DispatchTable;
