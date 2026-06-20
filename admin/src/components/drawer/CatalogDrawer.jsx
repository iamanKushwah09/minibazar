import React, { useState } from "react";
import { Card, CardBody, Textarea } from "@windmill/react-ui";
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import useCatalogValueSubmit from "@/hooks/useCatalogValueSubmit";
import MultiSelectFetch from "../form/selectOption/MultiSelectFetch";
import CategoryServices from "@/services/CategoryServices";
import ItemGroupServices from "@/services/ItemGroupServices";
import SendPdf from "../table/SendPdf";
import SwitchToggleForCatalog from "../form/switch/SwitchToggleForCatalog";
import CatalogModel from "../modal/CatalogModel";

const CatalogDrawer = () => {
  // Modal will be opened after successful submit via hook

  const { register, setValue, errors, onSubmit, handleSubmit, clearErrors } =
    useCatalogValueSubmit();

  const [isStockGreater, setIsStockGreater] = useState(true); // true = '>', false = '<'
  const [isPriceGreater, setIsPriceGreater] = useState(true);
  const [formForPdf, setFormForPdf] = useState({
    catalogName: "",
  });
  const [componentKey, setComponentKey] = useState(0); // For forcing re-render of MultiSelectFetch
  const [selectedGroupLabels, setSelectedGroupLabels] = useState("");
  const [selectedCategoryLabels, setSelectedCategoryLabels] = useState("");

  // Initialize form with clean state
  React.useEffect(() => {
    // Clear all form errors and set default values
    clearErrors();
    setValue('catalog_name', '');
    setValue('stock_quantity', '');
    setValue('sale_price', '');
    setValue('description', '');
    setValue('item_group_id', []);
    setValue('category_id', []);
  }, [clearErrors, setValue]);





  return (
    <>
      <CatalogModel />
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title register={register} title={"Catalog"} />
        {/* Removed Category/Group selection toggle as both are now enabled */}
      </div>
      <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
        <CardBody>
          <form
            onSubmit={handleSubmit((data) => {
              onSubmit(data, isStockGreater, isPriceGreater);
            })}
          >
            <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
              {/* Catalog Name Field */}
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Catalog Name" status />
                <div className="col-span-8 md:col-span-4">
                  <InputArea
                    register={register}
                    label="Catalog Name"
                    name="catalog_name"
                    type="text"
                    disabled
                    placeholder="Catalog name will be auto-filled"
                  />
                  <Error errorName={errors.catalog_name} />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Item group" status />
                <div className="col-span-8 md:col-span-4">
                  <MultiSelectFetch
                    key={`item-group-${componentKey}`}
                    name="item_group_id"
                    label="Item group"
                    fetchOptions={ItemGroupServices.getActiveItemGroup}
                    setValue={setValue}
                    register={register}
                    errors={errors}
                    required={false}
                    defaultValue={[]}
                    onSelectionChange={(selected) => {
                      const labels = selected.map(item => item.label).join(' - ');
                      setSelectedGroupLabels(labels);
                      const combined = [labels, selectedCategoryLabels].filter(Boolean).join(' | ');
                      setValue('catalog_name', combined);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Item Category" status />
                <div className="col-span-8 md:col-span-4">
                  <MultiSelectFetch
                    key={`category-${componentKey}`}
                    name="category_id"
                    label="Category"
                    fetchOptions={CategoryServices.getActiveCategory}
                    setValue={setValue}
                    register={register}
                    errors={errors}
                    required={false}
                    defaultValue={[]}
                    onSelectionChange={(selected) => {
                      const labels = selected.map(item => item.label).join(' - ');
                      setSelectedCategoryLabels(labels);
                      const combined = [selectedGroupLabels, labels].filter(Boolean).join(' | ');
                      setValue('catalog_name', combined);
                    }}
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
                      className={`ml-2 px-2 py-1 rounded ${isStockGreater
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                        }`}
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
                      className={`ml-2 px-2 py-1 rounded ${isPriceGreater
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                        }`}
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
              <div className="mt-2 md:mt-0 flex items-center justify-end xl:gap-x-4 gap-x-1 flex-grow-0">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-md bg-blue-500 text-white dark:bg-blue-900/40 dark:text-blue-200 font-medium"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};

export default CatalogDrawer;
