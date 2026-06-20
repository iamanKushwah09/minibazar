import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";

//internal import
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import PromoCodeServices from "@/services/PromoCodeServices";
import { notifyError, notifySuccess } from "@/utils/toast";
// import useTranslationValue from "./useTranslationValue";

const usePromoCodeSubmit = (id) => {
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
    }; 1

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            const roleData = {
                coupon_code: data.coupon_code,
                discount_percentage: data.discount_percentage,
                max_discount_price: data.max_discount_price,
                use_per_user: data.use_per_user,
                expiry_date: data.expiry_date,
                is_active: 1
            };
            if (id) {
                const res = await PromoCodeServices.updatePromoCode(id, roleData);
                setIsUpdate(true);
                setIsSubmitting(false);
                notifySuccess(res.message);
                closeDrawer();
            } else {
                const res = await PromoCodeServices.addPromoCode(roleData);
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
            const res = await PromoCodeServices.getPromoCodeById(id, {
                email: adminInfo.email,
            });
        if (res) {
                setResData(res);
                setValue("coupon_code", res.coupon_code);
                setValue("discount_percentage", res.discount_percentage);
                setValue("use_per_user", res.use_per_user);
                setValue("max_discount_price", res.max_discount_price);
                let dateExp = res.expiry_date?.split("T")[0]
                setValue("expiry_date", dateExp);
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
            setValue("coupon_code");
            setValue("discount_percentage");
            setValue("use_per_user");
            setValue("max_discount_price");
            setValue("expiry_date");

            clearErrors("coupon_code");
            clearErrors("discount_percentage");
            clearErrors("use_per_user");
            clearErrors("max_discount_price");
            clearErrors("expiry_date");

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
        checkedState
    };
};

export default usePromoCodeSubmit;
