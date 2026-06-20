import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";

//internal import
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import OfferServices from "@/services/OfferServices";
import { notifyError, notifySuccess } from "@/utils/toast";
// import useTranslationValue from "./useTranslationValue";

const useOfferSubmit = (id) => {
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
    const [selectedOptions, setSelectedOptions] = useState([]); // State for selected options
    const location = useLocation();
    // const { handlerTextTranslateHandler } = useTranslationValue();

    const {
        register,
        handleSubmit,
        setValue,
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

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const roleData = {
                discount: data.discount,
                item_id: data.item_id,
                is_active: 1,
                item: selectedOptions
            };
            if (id) {
                const res = await OfferServices.updateOffer(id, roleData);
                setIsUpdate(true);
                setIsSubmitting(false);
                notifySuccess(res.message);
                closeDrawer();
            } else {
                const res = await OfferServices.addOffer(roleData);
                setIsUpdate(true);
                setIsSubmitting(false);
                notifySuccess(res.message);
                closeDrawer();
            }
        } catch (err) {
            notifyError(err ? err?.response?.data?.message : err?.message);
            setIsSubmitting(false);
            closeDrawer();
        }
    };

    const getRoleData = async () => {
        try {
            const res = await OfferServices.getOfferById(id, {
                email: adminInfo.email,
            });
            if (res) {
                setResData(res);
                setValue("discount", res.discount);
                setSelectedOptions(res.item)
                // setValue("item_id", res.item_id?._id);
                // setValue("description", res.description);
                setCheckedState(res.permission[0])
            }
        } catch (err) {
            notifyError(err ? err?.response?.data?.message : err?.message);
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
            setValue("discount");
            setValue("item");
            // setValue("item_id");
            //   setValue("description");
            // setValue("permission");

            clearErrors("discount");
            clearErrors("item");
            // clearErrors("item_id");
            //   clearErrors("description");
            // clearErrors("permission");
            setLanguage(lang);
            setValue("language", language);
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
        selectedDate,
        setSelectedDate,
        isSubmitting,
        handleSelectLanguage,
        setCheckedState,
        checkedState,
        setSelectedOptions,
        selectedOptions
    };
};

export default useOfferSubmit;
