import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";

//internal import
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import AttributeValueServices from "@/services/AttributeValueServices";
import { notifyError, notifySuccess } from "@/utils/toast";
// import useTranslationValue from "./useTranslationValue";

const useAttributeValueSubmit = (id) => {
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

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            //   const permissions = [checkedState]?.map(item => Object.values(item))
            const roleData = {
                name: data.name,
                description: data.description,
                attribute_id: data.attribute_id,
                is_active: 1
            };
            if (id) {
                const res = await AttributeValueServices.updateAttributeValue(id, roleData);
                setIsUpdate(true);
                setIsSubmitting(false);
                notifySuccess(res.message);
                closeDrawer();
            } else {
                const res = await AttributeValueServices.addAttributeValue(roleData);
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
            const res = await AttributeValueServices.getAttributeValueById(id, {
                email: adminInfo.email,
            });
            console.log(res,'res1234567890')
            if (res) {
                setResData(res);
                setValue("name", res.name);
                setValue("code", res.code);
                setValue("attribute_id", res.attribute_id);
                setValue("description", res.description);
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
            setValue("name");
            setValue("code");
            setValue("attribute_id");

            clearErrors("name");
            clearErrors("code");
            clearErrors("attribute_id");
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
        setValue,
        watch,
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

export default useAttributeValueSubmit;
