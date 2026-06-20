// import dayjs from "dayjs";
// import Cookies from "js-cookie";
// import { useContext, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useLocation } from "react-router";

// //internal import
// import { AdminContext } from "@/context/AdminContext";
// import { SidebarContext } from "@/context/SidebarContext";
// import OrderServices from "@/services/OrderServices";
// import { notifyError, notifySuccess } from "@/utils/toast";
// // import useTranslationValue from "./useTranslationValue";

// const useShowSubmit = (id) => {
//     const { state } = useContext(AdminContext);
//     const { adminInfo } = state;

//     const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
//         useContext(SidebarContext);
//     const [imageUrl, setImageUrl] = useState("");
//     const [selectedDate, setSelectedDate] = useState(
//         dayjs(new Date()).format("YYYY-MM-DD")
//     );
//     const [language, setLanguage] = useState(lang || "en");
//     const [resData, setResData] = useState({});
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [checkedState, setCheckedState] = useState([]);
//     const location = useLocation();

//     const {
//         register,
//         handleSubmit,
//         setValue,
//         watch,
//         clearErrors,
//         formState: { errors },
//     } = useForm({
//         defaultValues: {
//             status: "", description: ""
//         },
//     });


//     const onSubmit = async (data) => {
//         setIsSubmitting(true);
//         try {
//             const roleData = {
//                 status: data.status,
//                 description: data.description,
//             };
//             if (id) {
//                 const res = await OrderServices.updateOrder(id, roleData);
//                 setIsUpdate(true);
//                 setIsSubmitting(false);
//                 notifySuccess(res.message);
//                 closeDrawer();
//             } else {
//                 notifySuccess("Something went wrong.");
//             }
//         } catch (err) {
//             notifyError(err ? err?.response?.data?.message : err?.message);
//             setIsSubmitting(false);
//             closeDrawer();
//         }
//     };

//     const getRoleData = async () => {
//         try {
//             const res = await OrderServices.getOrderById(id, {
//                 email: adminInfo.email,
//             });
//             if (res) {
//                 setValue("status", res.status);
//                 setValue("description", res.description);
//             }
//         } catch (err) {
//             notifyError(err ? err?.response?.data?.message : err?.message);
//         }
//     };

//     const handleSelectLanguage = (lang) => {
//         setLanguage(lang);

//         if (Object.keys(resData).length > 0) {
//             setValue("name", resData.name[lang ? lang : "en"]);
//         }
//     };

//     useEffect(() => {
//         if (!isDrawerOpen) {
//             setResData({});
//             setValue("status");
//             setValue("description");

//             clearErrors("status");
//             clearErrors("description");
//             setLanguage(lang);
//             setValue("language", language);
//             return;
//         }
//         if (id) {
//             getRoleData();
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [id, setValue, isDrawerOpen, adminInfo.email, clearErrors]);

//     useEffect(() => {
//         if (location.pathname === "/edit-profile" && Cookies.get("adminInfo")) {
//             getRoleData();
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [location.pathname, setValue]);

//     return {
//         register,
//         handleSubmit,
//         onSubmit,
//         language,
//         errors,
//         setImageUrl,
//         imageUrl,
//         selectedDate,
//         setSelectedDate,
//         isSubmitting,
//         handleSelectLanguage,
//         setCheckedState,
//         checkedState,
//         watch,
//         setValue,
//     };
// };

// export default useShowSubmit;
