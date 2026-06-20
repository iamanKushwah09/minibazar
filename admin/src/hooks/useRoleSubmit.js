import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";

//internal import
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import RoleServices from "@/services/RoleServices";
import { notifyError, notifySuccess } from "@/utils/toast";
// import useTranslationValue from "./useTranslationValue";

const useRoleSubmit = (id) => {
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
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const permissions = [checkedState]?.map(item => Object.values(item))
      const roleData = {
        name: data.name,
        description: data.description,
        permission: permissions[0].filter(e => e != false),
        is_active: 1
      };
      if (id) {
        const res = await RoleServices.updateRole(id, roleData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {
        const res = await RoleServices.addRole(roleData);
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
      const res = await RoleServices.getRoleById(id, {
        email: adminInfo.email,
      });
      if (res) {
        setResData(res);
        setValue("name", res.name);
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
      setValue("description");
      // setValue("permission");

      clearErrors("name");
      clearErrors("description");
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
    checkedState
  };
};

export default useRoleSubmit;
