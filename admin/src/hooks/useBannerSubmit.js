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
import BannerServices from "@/services/BannerServices";
// import useTranslationValue from "./useTranslationValue";

const useBannerSubmit = (id) => {
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
    const [newImage, setNewImage] = useState({ base64File: "", fileName: "" });
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
        console.log({ data })
        try {
            setIsSubmitting(true);
            const roleData = {
                name: data.name,
                image: newImage.base64File ? newImage : data?.image,
                is_active: 1
            };

            if (id) {
                const res = await BannerServices.updateBanner(id, roleData);
                setIsUpdate(true);
                setIsSubmitting(false);
                notifySuccess(res.message);
                closeDrawer();
            } else {
                const res = await BannerServices.addBanner(roleData);
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
            const res = await BannerServices.getBannerById(id, {
                name: adminInfo.name,
            });
            if (res) {
                setResData(res);
                setValue("name", res.name);
                setValue("image", res.image);
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
            // setValue("discount");
            // setValue("code");
            //   setValue("phone");
            //   setValue("role");
            //   setValue("joiningDate");
            //   setImageUrl("");
            clearErrors("name");
            // clearErrors("discount");
            // clearErrors("code");
            //   clearErrors("phone");
            //   clearErrors("role");
            //   clearErrors("joiningDate");
            //   setImageUrl("");
            //   setLanguage(lang);
            //   setValue("language", language);
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
        setNewImage,
        selectedDate,
        setSelectedDate,
        isSubmitting,
        handleSelectLanguage,
        setCheckedState,
        checkedState
    };
};

export default useBannerSubmit;
