import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";

//internal import
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import AdminServices from "@/services/AdminServices";
import { notifyError, notifySuccess } from "@/utils/toast";
// import useTranslationValue from "./useTranslationValue";

const useStaffSubmit = (id) => {

  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } = useContext(SidebarContext);
  const [imageUrl, setImageUrl] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [language, setLanguage] = useState(lang || "en");
  const [resData, setResData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkedState, setCheckedState] = useState([]);
  const location = useLocation();
  // const { handlerTextTranslateHandler } = useTranslationValue();
  const [newImage, setNewImage] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
    watch
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
    try {
      setIsSubmitting(true);
      const staffData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: typeof data.role === "object" ? data.role?.value : data.role,
        joiningDate: selectedDate ? selectedDate : dayjs(new Date()).format("YYYY-MM-DD"),
        image: newImage.length > 0 ? newImage[newImage.length - 1] : null,
        folder_name: "staff",
        salesman_id:data.salesman_id
        // lang: language
      };
      if (id) {
        const res = await AdminServices.updateStaff(id, staffData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {
        const res = await AdminServices.addStaff(staffData);
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

  const getStaffData = async () => {
    try {
      const res = await AdminServices.getStaffById(id, {
        email: adminInfo.email,
      });
      if (res) {
        console.log("res", res);
        setResData(res);
        setValue("name", res.name[language ? language : "en"]);
        setValue("email", res.email);
        setValue("password" , res.passwordView);
        setValue("phone", res.phone);
        setValue("role", res.role);
        setValue("image", res.image);
        setValue("salesman_id" , res.salesman_id);
        setNewImage([res.image]);
        setSelectedDate(dayjs(res.joiningData).format("YYYY-MM-DD"));
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
      setValue("email");
      setValue("password");
      setValue("phone");
      setValue("role");
      setValue("joiningDate");
      // setImageUrl("");
      clearErrors("name");
      clearErrors("email");
      clearErrors("password");
      clearErrors("phone");
      clearErrors("role");
      clearErrors("joiningDate");
      // setImageUrl("");
      setLanguage(lang);
      setValue("language", language);
      return;
    }
    if (id) {
      getStaffData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue, isDrawerOpen, adminInfo.email, clearErrors]);

  useEffect(() => {
    if (location.pathname === "/edit-profile" && Cookies.get("adminInfo")) {
      getStaffData();
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
    setValue,
    imageUrl,
    newImage,
    setNewImage,
    selectedDate,
    setSelectedDate,
    isSubmitting,
    handleSelectLanguage,
    setCheckedState,
    checkedState,
    watch,
  };
};

export default useStaffSubmit;
