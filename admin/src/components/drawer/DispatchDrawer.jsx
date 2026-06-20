import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Textarea, Select } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import SelectOrder from "@/components/form/selectOption/SelectOrder";
import DrawerButton from "@/components/form/button/DrawerButton";
import LabelArea from "@/components/form/selectOption/LabelArea";
import useCatalogValueSubmit from "@/hooks/useCatalogValueSubmit";
import useDispatchSubmit from "@/hooks/useDispatchSubmit";
import MultiSelectDropdown from "../form/selectOption/MultiSelectItem";
// import SelectItem from "@/components/form/selectOption/SelectItem";
import Uploader from "@/components/image-uploader/Uploader";
import SwitchToggleForCombination from "@/components/form/switch/SwitchToggleForCombination";
import SelectVendorGroup from "../form/selectOption/SelectVendorGroup";
import useOrderSubmit from "@/hooks/useOrderSubmit";
import CategoryUploader from "@/components/image-uploader/CategoryUploader";

const DispatchDrawer = ({ id, selectedData }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    language,
    errors,
    isSubmitting,
    handleSelectLanguage,
    setSelectedOptions,
    isCombination1,
    isCombination2,
    isCombination3,
    handleIsCombination1,
    handleIsCombination2,
    handleIsCombination3,
    setImageUrl,
    setNewImage,
    newImage,
    selectedOptions,
  } = useDispatchSubmit(id);
  // } = useCatalogValueSubmit(id)
  // console.log(selectedData);
  // console.log(id);

  const { t } = useTranslation();

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          register={register}
          handleSelectLanguage={handleSelectLanguage}
          title={id ? t("Update Dispatch") : t("Add Dispatch")}
        />
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Status" />
                  <div className="col-span-8 sm:col-span-4">
                    <Select
                      name="status"
                      {...register(`status`, {
                        required: `Status is required!`,
                      })}
                      className="border text-sm block w-full bg-gray-100 border-gray-200"
                    >
                      <option value="" defaultValue hidden>
                        Status{" "}
                      </option>
                      <option value="Processing">Processing</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </Select>
                    <Error errorName={errors.status} />
                  </div>
                </div>
                {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
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
                                </div> */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Gr No" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      className="border text-sm block w-full bg-gray-100 border-gray-200"
                      register={register}
                      name="grNo"
                      type="String"
                      placeholder="Gr No"
                      spellCheck="false"
                    />
                    <Error errorName={errors.grNo} />
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Lot" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      className="border text-sm block w-full bg-gray-100 border-gray-200"
                      register={register}
                      name="lot"
                      type="String"
                      placeholder="Lot"
                      spellCheck="false"
                    />
                    <Error errorName={errors.lot} />
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Description" />
                  <div className="col-span-8 sm:col-span-4">
                    <Textarea
                      className="border text-sm block w-full bg-gray-100 border-gray-200"
                      {...register("updateDescription", {
                        required: false,
                      })}
                      name="updateDescription"
                      placeholder="Description"
                      rows="2"
                      spellCheck="false"
                    />
                    <Error errorName={errors.updateDescription} />
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <div className="col-span-12 md:col-span-4">
                    <LabelArea label="Image" />
                    <Uploader
                      folder="admin"
                      setNewImage={setNewImage}
                      initialImages={newImage}
                    />
                  </div>
                </div>
              </div>
              <DrawerButton
                id={id}
                title="Dispatch"
                isSubmitting={isSubmitting}
              />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default DispatchDrawer;
