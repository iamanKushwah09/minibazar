import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SidebarContext } from "@/context/SidebarContext";
import CustomerServices from "@/services/CustomerServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import { AdminContext } from "@/context/AdminContext";

const useCustomerSubmit = (id) => {
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeDrawer, setIsUpdate } = useContext(SidebarContext);
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const [isCombination, setIsCombination] = useState(false);

  // handle notification for combination and extras
  const handleIsCombination = () => setIsCombination(!isCombination);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "Vendor", // Set default value here
      shipping_address: [{ shipping_address: "" }],
      country_id: "",
      state_id: "",
      city_id: ""
    },
  });


  const [country_id, setCountry] = useState("");
  const [state_id, setState] = useState("");
  const [city_id, setCity] = useState("");

  useEffect(() => {
    if (!id && adminInfo?.salesman_id) {
      setValue("salesman_id", adminInfo.salesman_id);
    }
  }, [id, adminInfo, setValue]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log("Form data before processing:", data);

      const customerData = {
        name: data.name,
        email: data.email || null,
        mobile: data.phone || null,
        address: data.address || null,
        shipping_address: data.shipping_address ? JSON.stringify(data.shipping_address) : null,
        password: data.password || null,
        group_type: data.type || "Vendor",
        gst_no: data.gst_no || null,
        aadhaar_no: data.aadhaar_no || null,
        tel_no: data.tel_no || null,
        contact_person: data.contact_person || null,
        bank_detail: data.bank_detail || null,
        discount: data.discount || null,
        gst_type: data.gst_type || "Registered",
        country_id: data.country_id || null,
        state_id: data.state_id || null,
        city_id: data.city_id || null,
        pincode: data.pincode || null,
        vendor_group_id: data.vendor_group_id ? String(data.vendor_group_id) : null,
        salesman_id: data.salesman_id ? String(data.salesman_id) : null,
        is_credit_limit: isCombination,
        amount: isCombination ? data.amount : null,
        days: isCombination ? data.days : null,
      };

      console.log("Customer data being sent:", customerData);
      if (id) {
        const res = await CustomerServices.updateCustomer(id, customerData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {
        const res = await CustomerServices.addCustomer(customerData);
        setIsUpdate(true);
        setIsSubmitting(false);
        setIsCombination(false)
        notifySuccess(res.message);
        closeDrawer();
      }
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
      setIsSubmitting(false);
      closeDrawer();
    }
  };

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await CustomerServices.getCustomerById(id);
          console.log({ res })
          if (res) {
            setValue("name", res.name);
            setValue("phone", res.mobile);
            setValue("email", res.email);
            setValue("address", res.address);
            setValue("shipping_address", res.shipping_address);
            setValue("password", res.password);
            setValue("type", res.group_type);
            setValue("gst_no", res.gst_no);
            setValue("aadhaar_no", res.aadhaar_no);
            setValue("tel_no", res.tel_no);
            setValue("contact_person", res.contact_person);
            setValue("bank_detail", res.bank_detail);
            setValue("discount", res.discount);
            setValue("gst_type", res.gst_type);
            setValue("pincode", res.pincode);
            setValue("vendor_group_id", res.vendor_group_id);
            setValue("salesman_id", res.salesman_id);
            setCountry(res.country_id)
            setState(res.state_id)
            setCity(res.city_id)
            setIsCombination(res.is_credit_limit)
            setTimeout(() => {
              setValue("amount", res.amount)
              setValue("days", res.days)
            }, 100);
            // setValue("country_id", res.country_id);
            // setValue("country_id", res.country_id);
            // setValue("state_id", res.state_id);
            // setValue("city_id", res.city_id);
          }
        } catch (err) {
          notifyError(err?.response?.data?.message || err?.message);
        }
      })();
    }
  }, [id, setValue]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    setImageUrl,
    imageUrl,
    watch,
    setValue,
    isSubmitting,
    setCountry,
    setState,
    setCity,
    country_id,
    state_id,
    city_id,
    isCombination,
    handleIsCombination,
  };
};

export default useCustomerSubmit;
