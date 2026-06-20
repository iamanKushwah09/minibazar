import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";

//internal import
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import ItemServices from "@/services/ItemServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const useItemSubmit = (id) => {

    const { state } = useContext(AdminContext);
    const { adminInfo } = state;
    const { isDrawerOpen, closeDrawer, setIsUpdate, lang } = useContext(SidebarContext);
    const [imageUrl, setImageUrl] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).format("YYYY-MM-DD")
    );
    const [language, setLanguage] = useState(lang || "en");
    const [resData, setResData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [checkedState, setCheckedState] = useState([]);
    const [newImage, setNewImage] = useState([]);
    const [tapValue, setTapValue] = useState("Item Info");
    const [gstData, setGSTData] = useState("Yes");
    const [checkedItems, setCheckedItems] = useState({});
    const [hasAttributes, setHasAttributes] = useState(false);
    // const [fullData, setFullData] = useState({ gst: "", offer: "", variant: [] })
    const location = useLocation();
    const itemInfo = useForm({
        defaultValues: {
            gst_check: 'Yes', // Set default value to "Yes"
            variant: [{ price: "", selling_price: "", stock: "", quantity: "" }],
            has_attributes: false
        },
    });
    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        watch,
        formState: { errors },
    } = itemInfo


    const [nextBtn, setNextBtn] = useState(true);
    const [submitData, setSubmitData] = useState({})
    const infoSubmit = async (data) => {
        console.log("infoSubmit : ", data);
        setTapValue("Item Attribute");
        setNextBtn(false)
        setSubmitData(data);
    };
    const attributeSubmit = async (data) => {
        try {
            console.log({ "data: ": data });
            // setIsSubmitting(true);
            const roleData = {
                name: submitData.name,
                discount: submitData.discount,
                alias: submitData.alias,
                category_id: submitData.category_id,
                item_group_id: submitData.item_group_id,
                brand_id: submitData.brand_id,
                unit_id: submitData.unit_id,
                alternate_unit: submitData.alternate_unit,
                conversion_factor: submitData.conversion_factor,
                tax_gst: submitData.tax_gst,
                hsn_code: submitData.hsn_code,
                sale_price: submitData.sale_price,
                mrp: submitData.mrp,
                stock: submitData.stock,
                vendor_discount: submitData.vendor_discount,
                short_description: submitData.short_description,
                long_description: submitData.long_description,
                specification: submitData.specification,
                image: newImage,
                has_attributes: hasAttributes,
                item_attribute: hasAttributes ? {
                    gst_check: data.gst_check,
                    gst: data.gst,
                    offer: data.offer,
                    variant: data.variant,
                    groupArrSelections: data.groupArrSelections,
                    checkedItems: checkedItems,
                } : {
                    gst_check: "Yes",
                    gst: "",
                    offer: "",
                    variant: [{ price: submitData.sale_price || 0, selling_price: submitData.sale_price || 0, stock: 100, quantity: "" }],
                    groupArrSelections: {},
                    checkedItems: {},
                },
                is_active: true

            };
            console.log("roleData : ", roleData);
            if (id) {
                const res = await ItemServices.updateItem(id, roleData);
                console.log("API response for item:", res);
                setIsUpdate(true);
                setIsSubmitting(false);
                notifySuccess(res.message);
                closeDrawer();
                setNextBtn(true)
                setNewImage([])
                setTapValue("Item Info")
                handleProductTap("Item Info", true);
            } else {
                const res = await ItemServices.addItem(roleData);
                console.log("API response for item:", res);
                setIsUpdate(true);
                setIsSubmitting(false);
                notifySuccess(res.message);
                closeDrawer();
                setNextBtn(true)
                setTapValue("Item Info")
                handleProductTap("Item Info", true);
                setNewImage([])
            }
        } catch (err) {
            notifyError(err ? err?.response?.data?.message : err?.message);
            setIsSubmitting(false);
            closeDrawer();
        }
    };

    const getRoleData = async () => {
        try {
            const res = await ItemServices.getItemById(id, {
                email: adminInfo.email,
            });
            console.log({ "response : ": res });
            if (res) {
                setResData(res);
                itemInfo.setValue("name", res.name)
                itemInfo.setValue("discount", res.discount)
                itemInfo.setValue("alias", res.alias)
                itemInfo.setValue("category_id", res.category_id)
                itemInfo.setValue("item_group_id", res.item_group_id)
                itemInfo.setValue("brand_id", res.brand_id)
                itemInfo.setValue("unit_id", res.unit_id)
                itemInfo.setValue("alternate_unit", res.alternate_unit)
                itemInfo.setValue("conversion_factor", res.conversion_factor)
                itemInfo.setValue("tax_gst", res.tax_gst)
                itemInfo.setValue("hsn_code", res.hsn_code)
                itemInfo.setValue("sale_price", res.sale_price)
                itemInfo.setValue("mrp", res.mrp)
                itemInfo.setValue("stock", res.stock)
                itemInfo.setValue("vendor_discount", res.vendor_discount)
                itemInfo.setValue("short_description", res.short_description)
                itemInfo.setValue("long_description", res.long_description)
                itemInfo.setValue("specification", res.specification)
                setHasAttributes(res.has_attributes || false)
                if (res.item_attribute) {
                    setGSTData(res.item_attribute.gst_check)
                    setValue("gst", res.item_attribute.gst)
                    setValue("gst_check", res.item_attribute.gst_check)
                    setValue("offer", res.item_attribute.offer)
                    setValue("variant", res.item_attribute.variant)
                    setCheckedItems(res.item_attribute.checkedItems)
                }
                setNewImage(res?.images)
                // handleProductTap("Item Info", true);
            }
            console.log("resData : ", resData);
        } catch (err) {
            notifyError(err ? err?.response?.data?.message : err?.message);
        }
    };

    const handleProductTap = (e, value, name) => {
        // console.log({ e });

        // if (value) {
        //   if (!value)
        //     return notifyError(
        //       `${"Please save product before adding combinations!"}`
        //     );
        // } else {
        //   if (!isBasicComplete)
        //     return notifyError(
        //       `${"Please save product before adding combinations!"}`
        //     );
        // }
        setTapValue(e);
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
            itemInfo.reset({
                gst_check: 'Yes',
                variant: [{
                    attribute_image: [],
                    price: "",
                    selling_price: "",
                    stock: "",
                    quantity: "",
                    groupArrSelections: {},
                }],
                name: "",
                discount: "",
                alias: "",
                category_id: "",
                item_group_id: "",
                brand_id: "",
                unit_id: "",
                alternate_unit: "",
                conversion_factor: "",
                tax_gst: "",
                hsn_code: "",
                sale_price: "",
                mrp: "",
                stock: "",
                vendor_discount: "",
                short_description: "",
                long_description: "",
                specification: "",
                gst: "",
                offer: "",
                has_attributes: false
            });
            setNewImage([]);
            setImageUrl([]);
            setTapValue("Item Info");
            setGSTData("Yes");
            setCheckedItems({});
            setCheckedState([]);
            setNextBtn(true);
            setIsSubmitting(false);
            setSubmitData({});
            setHasAttributes(false);
            setLanguage(lang);
            setValue("language", lang);
            clearErrors();
            return;
        }
        if (id) {
            getRoleData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isDrawerOpen, adminInfo.email, clearErrors, lang]);

    useEffect(() => {
        if (location.pathname === "/edit-profile" && Cookies.get("adminInfo")) {
            getRoleData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, setValue]);

    return {
        itemInfo,
        register,
        handleSubmit,
        infoSubmit,
        attributeSubmit,
        language,
        errors,
        setImageUrl,
        imageUrl,
        setNewImage,
        newImage,
        selectedDate,
        setSelectedDate,
        isSubmitting,
        handleSelectLanguage,
        setCheckedState,
        // handleIsCombination,
        handleProductTap,
        tapValue,
        setTapValue,
        watch,
        setValue,
        setNextBtn,
        nextBtn,
        // createAndUpdate,
        checkedState,
        setGSTData, gstData,
        checkedItems, setCheckedItems,
        hasAttributes, setHasAttributes
        // fullData, setFullData
    };
};

export default useItemSubmit;
