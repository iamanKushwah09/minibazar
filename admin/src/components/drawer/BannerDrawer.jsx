import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Input } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
// Internal imports
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import SelectRole from "@/components/form/selectOption/SelectRole";
import DrawerButton from "@/components/form/button/DrawerButton";
import LabelArea from "@/components/form/selectOption/LabelArea";
import Uploader from "@/components/image-uploader/Uploader";
import CheckBox from "@/components/form/others/CheckBox";
import useBannerSubmit from "@/hooks/useBannerSubmit";
const BannerDrawer = ({ id }) => {

  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    setNewImage,
    isSubmitting,
    selectedDate,
    setSelectedDate,
    handleSelectLanguage,
    setCheckedState,
    checkedState
  } = useBannerSubmit(id);
  const { t } = useTranslation();

  const handleClick = (event) => {
    const { name, checked } = event.target;
    setCheckedState((prev) => {    // If checked, store the object value; if unchecked, just return false
      if (checked) {
        return {
          ...prev,
          [name]: JSON.parse(event.target.value), // Store the actual object value when checked
        };
      } else {
        return {
          ...prev,
          [name]: false, // Set to false when unchecked
        };
      }
    });
  };

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          register={register}
          handleSelectLanguage={handleSelectLanguage}
          title={id ? t("Update Banner") : t("Add Banner")}
        //   description={
        //     id ? t("UpdateRoledescription") : t("AddRoledescription")
        //   }
        />
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Image" />
                  <div className="col-span-8 sm:col-span-4">
                    <Uploader
                      folder="admin"
                      setNewImage={setNewImage}
                      setImageUrl={setImageUrl}
                      />
                  </div>
                </div>
                {/* Name */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Name" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required
                      register={register}
                      label="Name"
                      name="name"
                      type="text"
                      autoComplete="username"
                      placeholder="Name"
                    />
                    <Error errorName={errors.name} />
                  </div>
                </div>

              </div>
              <DrawerButton id={id} title="Banner" isSubmitting={isSubmitting} />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default BannerDrawer;
