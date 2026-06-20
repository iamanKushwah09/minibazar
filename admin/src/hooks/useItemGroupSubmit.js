import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";

//internal import
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
// import AdminServices from "@/services/AdminServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import ItemGroupServices from "@/services/ItemGroupServices";
// import useTranslationValue from "./useTranslationValue";

const useItemGroupSubmit = (id) => {

    const { state } = useContext(AdminContext);
    const { adminInfo } = state;
    const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
        useContext(SidebarContext);
    const [imageUrl, setImageUrl] = useState("");
    const [selectedDate, setSelectedDate] = useState(
        dayjs(new Date()).format("YYYY-MM-DD")
    );
    const [language, setLanguage] = useState(lang || "en");
    const [resData, setResData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkedState, setCheckedState] = useState([]);
    const [isCombination, setIsCombination] = useState(false);
    const [newImage, setNewImage] = useState([]);
    const location = useLocation();
    // const { handlerTextTranslateHandler } = useTranslationValue();
    // const [imageUrl, setImageUrl] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        clearErrors,
        formState: { errors },
    } = useForm();

    const handleRemoveEmptyKey = (obj) => {
        for (const key in obj) {
            if (obj[key].trim() === "") {
                delete obj[key];
            }
        }
        // console.log("obj", obj);
        return obj;
    };
    const handleIsCombination = () => {
        setIsCombination(!isCombination);
        if (isCombination) setValue("parent_id", "");
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            const roleData = {
                name: data.name,
                alias: data.alias,
                moq: data.moq || 6, 
                discount: data.discount,
                image: newImage,
                is_active: 1,
                is_parent_group: isCombination,
                parent_id: isCombination ? data.parent_id : null
            };
            if (id) {
                const res = await ItemGroupServices.updateItemGroup(id, roleData);
                setIsUpdate(true);
                setIsSubmitting(false);
                notifySuccess(res.message);
                closeDrawer();
                setNewImage([])
            } else {
                const res = await ItemGroupServices.addItemGroup(roleData);
                setIsUpdate(true);
                setIsSubmitting(false);
                notifySuccess(res.message);
                setIsCombination(false)
                closeDrawer();
                setNewImage([])
            }
        } catch (err) {
            notifyError(err ? err?.response?.data?.message : err?.message);
            setIsSubmitting(false);
            closeDrawer();
        }
    };

    const getRoleData = async () => {
        try {
            console.log("Fetching item group data for ID:", id);
            const res = await ItemGroupServices.getItemGroupById(id);
            console.log("Item group data received:", res);
            
            if (res) {
                setResData(res);
                setValue("name", res.name);
                setValue("alias", res.alias || "");
                setValue("moq", res.moq || 6);
                setValue("discount", res.discount || "");
                setValue("parent_id", res.parent_id || "");
                setIsCombination(!!res.parent_id);
                
                // Handle image data properly
                if (res.image) {
                    setImageUrl(res.image);
                    // If we have base64 data, use it, otherwise use the image URL
                    if (res.base64File) {
                        setNewImage([{
                            base64File: res.base64File,
                            fileName: res.fileName || res.image.split('/').pop()
                        }]);
                    } else if (res.url) {
                        setNewImage([{
                            base64File: res.url,
                            fileName: res.fileName || res.image.split('/').pop()
                        }]);
                    } else {
                        // Fallback to just the image path
                        setNewImage([{
                            base64File: res.image,
                            fileName: res.image.split('/').pop()
                        }]);
                    }
                } else {
                    setNewImage([]);
                }
                console.log("Form populated with data:", {
                    name: res.name,
                    alias: res.alias,
                    discount: res.discount,
                    parent_id: res.parent_id,
                    isCombination: res.is_parent_group,
                    newImage: res.image ? "Image set" : "No image"
                });
            }
        } catch (err) {
            console.error("Error fetching item group data:", err);
            notifyError(err?.response?.data?.message || err?.message || "Failed to load item group data");
        }
    };

    const handleSelectLanguage = (lang) => {
        setLanguage(lang);

        if (Object.keys(resData).length > 0) {
            setValue("name", resData.name[lang ? lang : "en"]);
        }
    };

    useEffect(() => {
        if (!isDrawerOpen) {
            setResData({});
            setValue("name", "");
            setValue("moq", 6);
            setValue("discount", "");
            setValue("alias", "");
            setValue("parent_id", "");
            setImageUrl("");
            setNewImage([]);
            setIsCombination(false);
            clearErrors("name");
            clearErrors("moq");
            clearErrors("discount");
            clearErrors("alias");
            clearErrors("parent_id");
            return;
        }
        if (id) {
            getRoleData();
        }
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
        setImageUrl,
        imageUrl,
        isCombination,
        handleIsCombination,
        selectedDate,
        setNewImage,
        setSelectedDate,
        isSubmitting,
        handleSelectLanguage,
        setCheckedState,
        setValue,
        checkedState,
        newImage,
        watch
    };
};

export default useItemGroupSubmit;
