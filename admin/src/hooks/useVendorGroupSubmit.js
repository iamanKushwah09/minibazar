import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import swal from "sweetalert";

//internal import
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import VendorGroupServices from "@/services/VendorGroupServices";
import { notifyError, notifySuccess } from "@/utils/toast";
// import useTranslationValue from "./useTranslationValue";

const useVendorGroupSubmit = (id) => {
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
    return obj;
  };

  // handle notification for combination and extras
  const handleIsCombination = () => {
        setIsCombination(!isCombination);
        if (isCombination) setValue("parent_id", "");
    };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const roleData = {
        name: data.name,
        discount: data.discount,
        is_active: 1,
        is_parent_group: isCombination,
        parent_id: isCombination ? data.parent_id : null,
        salesman_id: data.salesman_id
      };
      if (id) {
        const res = await VendorGroupServices.updateVendorGroup(id, roleData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {
        const res = await VendorGroupServices.addVendorGroup(roleData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        setIsCombination(false)
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setIsSubmitting(false);
      closeDrawer();
    }
  };

  const getRoleData = async () => {
    try {
      const res = await VendorGroupServices.getVendorGroupById(id, {
        email: adminInfo.email,
      });
      if (res) {
        setResData(res);
        
        // Set form values immediately
        setValue("name", res.name);
        setValue("discount", res.discount);
        setValue("salesman_id", res.salesman_id);
        setValue("parent_id", res.parent_id);
        setIsCombination(!!res.parent_id);
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
      setValue("discount");
      setValue("parent_id");
      setValue("salesman_id");
      clearErrors("name");
      clearErrors("discount");
      clearErrors("parent_id");
      clearErrors("salesman_id");
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
    isCombination,
    handleIsCombination,
    // tapValue,
    // setTapValue,
    setImageUrl,
    setValue,
    imageUrl,
    selectedDate,
    setSelectedDate,
    isSubmitting,
    handleSelectLanguage,
    setCheckedState,
    checkedState,
    resData
  };
};

export default useVendorGroupSubmit;
