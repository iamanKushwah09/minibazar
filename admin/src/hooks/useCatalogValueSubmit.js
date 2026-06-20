import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";

//internal import
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import CatalogValueServices from "@/services/CatalogValueServices";
import { notifyError, notifySuccess } from "@/utils/toast";
// import useTranslationValue from "./useTranslationValue";

const useCatalogValueSubmit = (id) => {

    const { state } = useContext(AdminContext);
    const { adminInfo } = state;
    const { isDrawerOpen, closeDrawer, setIsUpdate, lang, setModalData, toggleModal } = useContext(SidebarContext);
    const [language, setLanguage] = useState(lang || "en");
    const [resData, setResData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const location = useLocation();
    const [isCombination1, setIsCombination1] = useState(false);
    const [isCombination2, setIsCombination2] = useState(false);
    const [isCombination3, setIsCombination3] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]); // State for selected options

    const [newImage, setNewImage] = useState({ base64File: "", fileName: "" });
    const [imageUrl, setImageUrl] = useState([]);
    // const { handlerTextTranslateHandler } = useTranslationValue();

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm();

    // handle notification for combination and extras
    const handleIsCombination1 = () => {
        setIsCombination1(!isCombination1);
        setIsCombination2(false); // Uncheck other combinations
        setIsCombination3(false); // Uncheck other combinations
    };

    const handleIsCombination2 = () => {
        setIsCombination2(!isCombination2);
        setIsCombination1(false); // Uncheck other combinations
        setIsCombination3(false); // Uncheck other combinations
    };

    const handleIsCombination3 = () => {
        setIsCombination3(!isCombination3);
        setIsCombination1(false); // Uncheck other combinations
        setIsCombination2(false); // Uncheck other combinations
    };

    const onSubmit = async (data, isStockGreater, isPriceGreater) => {
        setIsSubmitting(true);
        console.log("Submitted data:", data);
        try {
            // Helper to normalize value(s) to ID array or single ID
            const extractIds = (value) => {
                if (Array.isArray(value)) {
                    return value.map((v) => v?._id || v?.id || v?.value || v);
                }
                return value?._id || value?.id || value?.value || value;
            };

            // Normalize IDs for API
            const normalizedCategory = extractIds(data.category_id);
            const normalizedItemGroup = extractIds(data.item_group_id);

            // Preserve full selections for sharing UI in modal
            const originalCatalogData = {
                is_active: 1,
                catalog_name: data.catalog_name,
                category_id: data.category_id,
                description: data.description,
                item_group_id: data.item_group_id,
                sale_price: data.sale_price,
                sale_price_operator: isPriceGreater ? '>' : '<=',
                stock_quantity: data.stock_quantity,
                stock_quantity_operator: isStockGreater ? '>' : '<=',
                vendor_id: data.vendor_id,
                customer_id: data.customer_id,
                vendor_group_id: data.vendor_group_id,
                is_vendor_group: isCombination1,
                is_vendor: isCombination2,
                is_customer: isCombination3,
                image: newImage.base64File ? newImage : data?.image,
                folder_name: "catalog",
            };

            const catalogData = {
                is_active: 1,
                catalog_name: data.catalog_name,
                category_id: normalizedCategory.length > 0 ? normalizedCategory : undefined,
                description: data.description,
                item_group_id: normalizedItemGroup.length > 0 ? normalizedItemGroup : undefined,
                sale_price: data.sale_price,
                sale_price_operator: isPriceGreater ? '>' : '<=',
                stock_quantity: data.stock_quantity,
                stock_quantity_operator: isStockGreater ? '>' : '<=',
                vendor_id: data.vendor_id,
                customer_id: data.customer_id,
                vendor_group_id: data.vendor_group_id,
                is_vendor_group: isCombination1,
                is_vendor: isCombination2,
                is_customer: isCombination3,
                image: newImage.base64File ? newImage : data?.image,
                folder_name: "catalog",
            };

            console.log("catalogData (API payload) :- ", catalogData);
            if (id) {
                const res = await CatalogValueServices.updateCatalogValue(id, catalogData);
                setIsUpdate(true);
                setIsSubmitting(false);
                notifySuccess(res.message);
                closeDrawer();
            } else {
                const res = await CatalogValueServices.addCatalogValue(catalogData);
                setIsUpdate(true);
                setIsSubmitting(false);
                notifySuccess(res.message);
                // Open modal with options using returned pdfUrl
                setModalData({
                    pdfUrl: res?.pdfUrl,
                    catalogData: originalCatalogData,
                });
                toggleModal();
                closeDrawer();
            }
        } catch (err) {
            console.log({ err })
            notifyError(err ? err?.response?.data?.message : err?.message);
            setIsSubmitting(false);
            closeDrawer();
        }
    };

    // const getCatalogData = async () => {
    //     try {
    //         const res = await CatalogValueServices.getCatalogValueById(id, {
    //             email: adminInfo.email,
    //         });
    //         if (res) {
    //             setValue("catalog_name", res.catalog_name)
    //             setValue("category_id", res.category_id)
    //             setValue("description", res.description)
    //             setValue("item_group_id", res.item_group_id)
    //             setValue("sale_price", res.sale_price)
    //             setValue("sale_price_operator", res.sale_price_operator || "<=")
    //             setValue("stock_quantity", res.stock_quantity)
    //             setValue("stock_quantity_operator", res.stock_quantity_operator || "<=");
    //             setTimeout(() => {
    //                 setValue("vendor_id", res.vendor_id)
    //                 setValue("customer_id", res.customer_id)
    //                 setValue("vendor_group_id", res.vendor_group_id)
    //             }, 500);
    //             setIsCombination1(res.is_vendor_group)
    //             setIsCombination2(res.is_vendor)
    //             setIsCombination3(res.is_customer)
    //             setResData(res);
    //         }
    //         console.log("Catalog data fetched successfully", res);
    //     } catch (err) {
    //         notifyError(err ? err?.response?.data?.message : err?.message);
    //     }
    // };

    const handleSelectLanguage = (lang) => {
        setLanguage(lang);

        if (Object.keys(resData).length > 0) {
            setValue("name", resData.name[lang ? lang : "en"]);
        }
    };

    useEffect(() => {
        if (!isDrawerOpen) {
            setResData({});
            setValue("description");
            setValue("item");
            clearErrors("description");
            clearErrors("item");
            setLanguage(lang);
            setValue("language", language);
            return;
        }
        // if (id) {
        //     getCatalogData();
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, setValue, isDrawerOpen, adminInfo.email, clearErrors]);

    useEffect(() => {
        if (location.pathname === "/edit-profile" && Cookies.get("adminInfo")) {
            getRoleData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, setValue]);

    return {
        register,
        handleSubmit,
        onSubmit,
        language,
        errors,
        isSubmitting,
        setValue,
        clearErrors,
        handleSelectLanguage,
        setSelectedOptions,
        isCombination1,
        isCombination2,
        isCombination3,
        handleIsCombination1,
        handleIsCombination2,
        handleIsCombination3,
        setImageUrl,
        setNewImage,
        selectedOptions
    };
};

export default useCatalogValueSubmit;
