import React, { useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Textarea } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import SelectAttributeGroup from "@/components/form/selectOption/SelectAttributeGroup";
import DrawerButton from "@/components/form/button/DrawerButton";
import LabelArea from "@/components/form/selectOption/LabelArea";
import useCatalogValueSubmit from "@/hooks/useCatalogValueSubmit";
import MultiSelectDropdown from "../form/selectOption/MultiSelectItem";
import SelectItemGroup from "../form/selectOption/SelectItemGroup";
import SelectCategory from "../form/selectOption/SelectCategory";
// import SelectItem from "@/components/form/selectOption/SelectItem";
import Uploader from "@/components/image-uploader/Uploader";
import SwitchToggleForCombination from "@/components/form/switch/SwitchToggleForCombination";
import SelectVendorGroup from "../form/selectOption/SelectVendorGroup";
import SelectVendor from "../form/selectOption/SelectVendor";
import { is } from "immutable";
import MultiSelectFetch from "../form/selectOption/MultiSelectFetch";
import CategoryServices from "@/services/CategoryServices";
import ItemGroupServices from "@/services/ItemGroupServices";

const PdfSenderDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    language,
    setValue,
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
    selectedOptions
  } = useCatalogValueSubmit(id);



  const { t } = useTranslation();
  const [isStockGreater, setIsStockGreater] = useState(true); // true = '>', false = '<'
  const [isPriceGreater, setIsPriceGreater] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedItemGroups, setSelectedItemGroups] = useState([]);


  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          register={register}
          handleSelectLanguage={handleSelectLanguage}
          title={id ? t("Update Catalog") : t("Add Catalog")}
        />
        {/* Removed Category/Group selection toggle as both are now enabled */}
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          <CardBody>
            <form onSubmit={handleSubmit((data) => {
              console.log('Form Data:', data, isStockGreater, isPriceGreater);
              onSubmit(data, isStockGreater, isPriceGreater);
            })}>
              <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Item group" status />
                  <div className="col-span-8 md:col-span-4">
                    <MultiSelectFetch
                      name="item_group_id"
                      label="Item group"
                      fetchOptions={ItemGroupServices.getActiveItemGroup}
                      setValue={setValue}
                      register={register}
                      errors={errors}
                      required={false}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Item Category" status />
                  <div className="col-span-8 md:col-span-4">
                    <MultiSelectFetch
                      name="category_id"
                      label="Category"
                      fetchOptions={CategoryServices.getActiveCategory}
                      setValue={setValue}
                      register={register}
                      errors={errors}
                      required={false}
                    />
                  </div>
                </div>


                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Stock Quantity" status />
                  <div className="col-span-8 md:col-span-4">
                    <div className="flex items-center">
                      <InputArea
                        required
                        register={register}
                        label="Stock Quantity"
                        name="stock_quantity"
                        type="number"
                        placeholder="Stock Quantity"
                      />
                      <button
                        type="button"
                        className={`ml-2 px-2 py-1 rounded ${isStockGreater ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setIsStockGreater(!isStockGreater)}

                      >
                        {isStockGreater ? ">" : "<="}
                      </button>
                    </div>
                    <Error errorName={errors.stock_quantity} />
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Sale price" status />
                  <div className="col-span-8 md:col-span-4">
                    <div className="flex items-center">
                      <InputArea
                        required
                        register={register}
                        label="Sale price "
                        name="sale_price"
                        type="number"
                        placeholder="Sale price "
                      />{" "}
                      <button
                        type="button"
                        className={`ml-2 px-2 py-1 rounded ${isPriceGreater ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setIsPriceGreater(!isPriceGreater)}
                      >
                        {isPriceGreater ? ">" : "<="}
                      </button>
                    </div>
                    <Error errorName={errors.sale_price} />
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

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="PDF" />
                  <div className="col-span-8 sm:col-span-4">
                    <Uploader
                      folder="admin"
                      setImageUrl={setImageUrl}
                      setNewImage={setNewImage}
                    />
                  </div>
                </div>

              </div>
              <DrawerButton
                id={id}
                title="Catalog"
                isSubmitting={isSubmitting}
              />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};
export default PdfSenderDrawer;
