import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
//internal import
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import { notifyError, notifySuccess } from "@/utils/toast";
import SaleOrderServices from "@/services/SaleOrderServices";
// import useTranslationValue from "./useTranslationValue";

const useDispatchSubmit = (id) => {
    const { state } = useContext(AdminContext);
    const { adminInfo } = state;

    const { isDrawerOpen, closeDrawer, setIsUpdate, lang } = useContext(SidebarContext);
    const [imageUrl, setImageUrl] = useState("");
    const [selectedDate, setSelectedDate] = useState(
        dayjs(new Date()).format("YYYY-MM-DD")
    );
    const [language, setLanguage] = useState(lang || "en");
    const [resData, setResData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkedState, setCheckedState] = useState([]);
    const [newImage, setNewImage] = useState([]);
    const location = useLocation();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        clearErrors,
        formState: { errors },
    } = useForm({
        defaultValues: {
            status: "", description: "", grNo: "", lot: "", updateDescription: "", images: newImage,
        },
    });


    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            if (id) {
                const res = await SaleOrderServices.dispatchUpdate(id, {
                    status: data.status,
                    description: data.updateDescription,
                    grNo: data.grNo,
                    lotNo: data.lot,
                    images: newImage,
                });
                setIsUpdate(true);
                setIsSubmitting(false);
                notifySuccess(res.message);
                closeDrawer();
                setNewImage([{ base64File: "", fileName: "" }])
            } else {
                notifySuccess("Something went wrong.");
            }
        } catch (err) {
            notifyError(err ? err?.response?.data?.message : err?.message);
            setIsSubmitting(false);
            closeDrawer();
        }
    };

    const getRoleData = async () => {
        try {
            const res = await SaleOrderServices.getSaleOrderById(id);
            if (res) {
                setValue("status", res.status);
                // setValue("updateDescription", '');
                // setValue("updateDescription", res.updateDescription);
                setValue("grNo", res.grNo);
                setValue("lot", res.lotNo);
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
            setValue("status");
            setValue("description");
            setValue("updateDescription")
            setValue("grNo");
            setValue("lot");

            clearErrors("status");
            clearErrors("description");
            clearErrors("updateDescription")
            clearErrors("grNo");
            clearErrors("lot");
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
        watch,
        setValue,
        setNewImage,
        newImage,
    };
};

export default useDispatchSubmit;
