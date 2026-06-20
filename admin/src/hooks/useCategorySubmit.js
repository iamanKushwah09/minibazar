import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import CategoryServices from "@/services/CategoryServices";
import { notifyError, notifySuccess } from "@/utils/toast";
// import useTranslationValue from "./useTranslationValue";

const useCategorySubmit = (id, data) => {
  
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } = useContext(SidebarContext);
  const [resData, setResData] = useState({});
  const [checked, setChecked] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [children, setChildren] = useState([]);
  const [language, setLanguage] = useState(lang);
  const [published, setPublished] = useState(true);
  const [selectCategoryName, setSelectCategoryName] = useState("");
  const [isCombination, setIsCombination] = useState(false);
  const [newImage, setNewImage] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const { handlerTextTranslateHandler } = useTranslationValue();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
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

  const handleIsCombination = () => setIsCombination(!isCombination);

  // console.log("lang", lang, language);

  // console.log("resData", resData);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const categoryData = {
        name: data.name,
        description : data.description,
        image: newImage,
        is_active: 1,
        is_parent_category: isCombination,
        parent_id: isCombination ? data.parent_id : null
      };
      if (id) {
        const res = await CategoryServices.updateCategory1(id, categoryData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        reset();
        setNewImage([{ base64File: "", fileName: "" }])
      } else {
        const res = await CategoryServices.addCategory1(categoryData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        setNewImage([{ base64File: "", fileName: "" }])
      }
    } catch (err) {
      setIsSubmitting(false);
      notifyError(err ? err?.response?.data?.message : err?.message);
      closeDrawer();
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    if (Object.keys(resData).length > 0) {
      setValue("name", resData.name[lang ? lang : "en"]);
      setValue("description", resData.description[lang ? lang : "en"]);
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue("name");
      setValue("parentId");
      setValue("parentName");
      setValue("description");
      setValue("icon");
      setImageUrl("");
      setPublished(true);
      clearErrors("name");
      clearErrors("parentId");
      clearErrors("parentName");
      clearErrors("description");
      setSelectCategoryName("Home");
      setLanguage(lang);
      setValue("language", language);

      if (data !== undefined && data[0]?._id !== undefined) {
        setChecked(data[0]._id);
      }
      return;
    }
    if (id) {
      (async () => {
        try {
          const res = await CategoryServices.getCategoryById1(id);

          if (res) {
            setResData(res);
            setValue("name", res.name);
            setValue("description", res.description);
            setIsCombination(res.is_parent_category);
            setTimeout(() => {
              setValue("parent_id", res.parent_id);
            }, 100);
            setNewImage([{"base64File": res.base64File , "fileName": res.fileName}]);        

            // setValue("parentName", res.parent_name);
            // setValue("icon", res.icon);
            // setValue("image", res.image);

            // setValue("name", res.name[language ? language : "en"]);
            // setValue(
            //   "description",
            //   res.description[language ? language : "en"]
            // );

            // setValue("language", language);
            // setValue("parentId", res.parentId);
            // setValue("parentName", res.parentName);
            
            // setSelectCategoryName(res.parentName);
            // setChecked(res.parentId);
            // setImageUrl(res.icon);
            // setPublished(res.status === "show" ? true : false);
          }
        } catch (err) {
          notifyError(err ? err.response.data.message : err.message);
        }
      })();
    }
  }, [id, setValue, isDrawerOpen, language, clearErrors, data, lang]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    children,
    setChildren,
    published,
    setPublished,
    checked,
    setChecked,
    setNewImage,
    newImage,
    isSubmitting,
    selectCategoryName,
    setSelectCategoryName,
    handleSelectLanguage,
    handleIsCombination,
    isCombination,
  };
};

export default useCategorySubmit;
