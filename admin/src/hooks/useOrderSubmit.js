import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";

//internal import
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import OrderServices from "@/services/OrderServices";
import { notifyError, notifySuccess } from "@/utils/toast";
// import useTranslationValue from "./useTranslationValue";

const useOrderSubmit = (id) => {
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
  const [selectedItem, setSelectedItem] = useState([]); // State for selected options
  const [totalAmount, setTotalAmount] = useState(0)

  // const { handlerTextTranslateHandler } = useTranslationValue();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      variant: [{ item_id: "", price: "", amount: "", qty: "", tax: "", discount: "" }],
    },
  });


  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // console.log("form Data", data)
    try {
      const roleData = {
        "variant": data.variant,
        "order_date": data.order_date,
        "order_no": data.order_no,
        "status": "Start",
        "payment_mode": data.payment_mode,
        "shipping_charge": data.shipping_charge,
        "total_amount": totalAmount,
        "total_qty": data.variant?.map((x) => x.qty * 1)?.reduce((a, b) => a + b, 0),
        "customers_id": data.customers_id,
        "customers_type": data.customers_type,
        
      };
      // console.log(roleData)

      if (id) {
        const res = await OrderServices.updateOrder(id, roleData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {
        const res = await OrderServices.addOrder(roleData);
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
      const res = await OrderServices.getOrderById(id, {
        email: adminInfo.email,
      });
      console.log({ res })
      if (res) {
        setValue("order_date", res.order_date);
        setValue("order_no", res.order_no);
        setValue("payment_mode", res.payment_mode);
        setValue("shipping_charge", res.shipping_charge);
        setValue("variant", res.variant);
        setTotalAmount(res.total_amount)
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

      clearErrors("name");
      clearErrors("code");
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
    setSelectedItem,
    watch,
    setValue,
    selectedItem,
    totalAmount, setTotalAmount
  };
};

export default useOrderSubmit;
