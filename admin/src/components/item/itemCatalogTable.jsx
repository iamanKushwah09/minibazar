import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";

//internal import
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ShowHideButton from "@/components/table/ShowHideButton";
import CatalogDrawer from "@/components/drawer/CatalogDrawer";
// import PdfSenderDrawer from "../drawer/PdfSenderDrawer";
import SendPdf from "@/components/table/SendPdf";

const CatalogValueTable = () => {

    // const [openDrawer, setOpenDrawer] = useState(null);
    // const {
    //     title,
    //     serviceId,
    //     handleModalOpen,
    //     handleUpdate,
    //     isSubmitting,
    //     handleResetPassword,
    //     toggleDrawer,
    // } = useToggleDrawer();

    return (
        <>
            {/* <PageTitle>
                <button onClick={toggleDrawer}>Add Catalog</button>
            </PageTitle>
            <MainDrawer>
                <CatalogDrawer />
            </MainDrawer> */}
            {/* <TableBody>
                {dataTable?.map((e) => {
                    return (
                        <TableRow key={e._id}>
                            <TableCell>
                                <h2 className="text-sm font-medium">
                                    {e?.catalog_name || 'N/A'}
                                </h2>
                            </TableCell>
                            <TableCell>
                                <h2 className="text-sm font-medium">
                                    {e?.item_group_id?.map((item) => item.name).join(', ') || ''}
                                </h2>
                            </TableCell>
                            <TableCell>
                                <h2 className="text-sm font-medium">
                                    {e?.category_id?.map((item) => item.name).join(', ') || ''}
                                </h2>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm">{e.stock_quantity}</span>{" "}
                            </TableCell>
                            <TableCell>
                                <span className="text-sm">{e.sale_price}</span>{" "}
                            </TableCell>
                            <TableCell>
                                <span className="text-sm">{e.description}</span>{" "}
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
                                    title={e?.name}
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                <SendPdf catalogData={e} />
                            </TableCell>
                            <TableCell className="text-center">
                                {e.pdfUrl ? (
                                    <a
                                        href={e.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Catalog PDF
                                    </a>
                                ) : (
                                    <span className="text-gray-400">No PDF</span>
                                )}
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody> */}
        </>
    );
};

export default CatalogValueTable;
