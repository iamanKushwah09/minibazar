import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Input , Textarea } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
// Internal imports
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import SelectAttributeGroup from "@/components/form/selectOption/SelectAttributeGroup";
import DrawerButton from "@/components/form/button/DrawerButton";
import LabelArea from "@/components/form/selectOption/LabelArea";
import Uploader from "@/components/image-uploader/Uploader";
import CheckBox from "@/components/form/others/CheckBox";
import useAttributeValueSubmit from "@/hooks/useAttributeValueSubmit";
const AttributeValueDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    setValue,
    watch,
    errors,
    imageUrl,
    setImageUrl,
    isSubmitting,
    selectedDate,
    setSelectedDate,
    handleSelectLanguage,
    setCheckedState,
    checkedState,
  } = useAttributeValueSubmit(id);
  const { t } = useTranslation();

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          register={register}
          handleSelectLanguage={handleSelectLanguage}
          title={id ? t("Update Attribute Value") : t("Add Attribute Value")}
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
                {/* Name */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Name" status/>
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
                
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Attribute Group" status />
                  <div className="col-span-8 sm:col-span-4">
                    <SelectAttributeGroup
                      register={register}
                      label="Attribute Group"
                      name="attribute_id"
                      setValue={setValue}
                      value={watch("attribute_id")}
                    />
                    <Error errorName={errors.attribute_id} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Description" />
                  <div className="col-span-8 sm:col-span-4">
                    <Textarea
                      className="border text-sm block w-full bg-gray-100 border-gray-200"
                      {...register("description", {
                        required: false,
                      })}
                      name="description"
                      placeholder="Description"
                      rows="2"
                      spellCheck="false"
                    />
                    <Error errorName={errors.description} />
                  </div>
                </div>
              </div>
              <DrawerButton
                id={id}
                title="Attribute Value"
                isSubmitting={isSubmitting}
              />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default AttributeValueDrawer;
