import { Avatar, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";

//internal import

import Status from "@/components/table/Status";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import ItemDrawer from "@/components/drawer/ItemDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ActiveInActiveButton from "@/components/table/ActiveInActiveButton";
import ShowHideButton from "@/components/table/ShowHideButton";
import Tooltip from "@/components/tooltip/Tooltip";
import Stock from "@/components/common/Stock";
import ItemImgUpdateDrawer from "@/components/drawer/ItemImgUpdateDrawer";

const getImageUrl = (image) => {
    if (!image) return 'https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png';
    let rawImage = Array.isArray(image) ? image[0] : image;
    if (typeof rawImage === 'object') {
        const extractedPath = rawImage.url || rawImage.path || rawImage.image_url;
        if (!extractedPath || Object.keys(rawImage).length === 0) return 'https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png';
        rawImage = extractedPath;
    }
    if (!rawImage) return 'https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png';
    if (rawImage.startsWith('http')) return rawImage;
    return `${import.meta.env.VITE_APP_API_SOCKET_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
};

const itemTable = ({ dataTable, isShow = true  }) => {
    console.log("dataTable in itemTable: ", dataTable);

    const {
        title,
        serviceId,
        handleModalOpen,
        handleUpdate,
        handleItemImgUpdate,
        isSubmitting,
        handleResetPassword,
        isImgUpdate
    } = useToggleDrawer();

    const { showDateFormat, showingTranslateValue } = useUtilsFunction();

    console.log(serviceId , 'serviceId')

    return (
        <>
            <DeleteModal id={serviceId} title={title} />
            <MainDrawer product={true}>
                {serviceId ? (
                    isImgUpdate ? (
                        <ItemImgUpdateDrawer id={serviceId} />
                    ) : (
                        <ItemDrawer id={serviceId} />
                    )
                ) : <ItemDrawer id={serviceId} />}
            </MainDrawer>
            <TableBody>
                {dataTable?.map((role) => {
                    return (
                        <TableRow key={role._id}>
                            <TableCell>
                                <img 
                                    onClick={() => handleItemImgUpdate(role._id)}
                                    src={getImageUrl(role?.image)}
                                    alt="Image"
                                    className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                                />
                            </TableCell>
                            <TableCell>
                                <h2 className="text-sm font-medium">{role?.name}</h2>
                            </TableCell>
                            <TableCell><span className="text-sm">{role.alias}</span></TableCell>
                            <TableCell><span className="text-sm">{role.category_id?.name}</span></TableCell>
                            {/* <TableCell><span className="text-sm">{role.brand_id?.name}</span></TableCell> */}
                            <TableCell><span className="text-sm">{role.item_group_id?.name}</span></TableCell>
                            <TableCell><span className="text-sm">{role.unit_id?.name}</span></TableCell>
                            {/* <TableCell><span className="text-sm">{role.alternate_unit}</span></TableCell> */}
                            {/* <TableCell><span className="text-sm">{role.conversion_factor}</span></TableCell> */}
                            {/* <TableCell><span className="text-sm">{role.tax_gst}</span></TableCell> */}
                            {/* <TableCell><span className="text-sm">{role.hsn_code}</span></TableCell> */}
                            <TableCell><span className="text-sm">{role.sale_price}</span></TableCell>
                            <TableCell><span className="text-sm">{role.mrp}</span></TableCell>
                            <TableCell>
                                <Stock stock={role.stock || 0} />
                            </TableCell>
                            {/* <TableCell><span className="text-sm">{role.discount}</span></TableCell> */}
                            {/* <TableCell><span className="text-sm">{role.vendor_discount}</span></TableCell> */}
                            {/* <TableCell><span className="text-sm">{role.specification}</span></TableCell>
                            <TableCell><span className="text-sm">{role.short_description}</span></TableCell>
                            <TableCell><span className="text-sm">{role.long_description}</span></TableCell> */}
                            {/* <TableCell><span className="text-sm">{role.specification && role.specification.length > 30 ? `${role.specification.slice(0, 30)}...` : role.specification}</span></TableCell>
                            <TableCell><span className="text-sm">{role.short_description && role.short_description.length > 30 ? `${role.short_description.slice(0, 30)}...` : role.short_description}</span></TableCell>
                            <TableCell><span className="text-sm">{role.long_description && role.long_description.length > 30 ? `${role.long_description.slice(0, 30)}...` : role.long_description}</span></TableCell> */}
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

export default itemTable;
