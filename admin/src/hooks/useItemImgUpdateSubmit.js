import { SidebarContext } from "@/context/SidebarContext";
import ItemServices from "@/services/ItemServices";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { notifyError, notifySuccess } from "@/utils/toast";

const useItemImgUpdateSubmit = (id, data) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate } = useContext(SidebarContext);
  const [resData, setResData] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [children, setChildren] = useState([]);
  const [checked, setChecked] = useState("");
  const [published, setPublished] = useState(true);
  const [newImage, setNewImage] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const itemData = {
        image: newImage,
      };
      if (id) {
        const res = await ItemServices.updateItem(id, itemData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        reset();
        setNewImage([{ base64File: "", fileName: "" }])
      } else {
        const res = await ItemServices.addItem(itemData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        setNewImage([{ base64File: "", fileName: "" }]);
      }
    } catch (err) {
      setIsSubmitting(false);
      notifyError(err ? err?.response?.data?.message : err?.message);
      closeDrawer();
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setImageUrl("");
      setPublished(true);
      if (data !== undefined && data[0]?._id !== undefined) {
        setChecked(data[0]._id);
      }
      return;
    }
    if (id) {
      (async () => {
        try {
          const res = await ItemServices.getItemById(id);
          if (res) {
            setResData(res);
            setNewImage([
              // { base64File: res.base64File, fileName: res.fileName },
              ...res.images
            ]);
          }
        } catch (err) {
          notifyError(err ? err.response.data.message : err.message);
        }
      })();
    }
  }, [id, setValue, isDrawerOpen, clearErrors, data]);

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
  };
};

export default useItemImgUpdateSubmit;
