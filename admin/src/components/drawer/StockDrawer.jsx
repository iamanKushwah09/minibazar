import React, { Fragment } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Input, Button, Select } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
// Internal imports
import Error from "@/components/form/others/Error";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import DrawerButton from "@/components/form/button/DrawerButton";
import LabelArea from "@/components/form/selectOption/LabelArea";
import useItemSubmit from "@/hooks/useItemSubmit";
import AttributeGroupServices from "@/services/AttributeGroupServices";
import AttributeValueServices from "@/services/AttributeValueServices";
import CategoryUploader from "@/components/image-uploader/CategoryUploader";
import { FiPlusCircle, FiTrash } from "react-icons/fi";
import { notifyError } from "@/utils/toast";

const StockDrawer = ({ id }) => {
  const {
    register,
    errors,
    handleSubmit,
    attributeSubmit,
    setNewImage,
    isSubmitting,
    handleSelectLanguage,
    setTapValue,
    tapValue,
    watch,
    setNextBtn,
    nextBtn,
    setValue,
    setGSTData, gstData,
    setCheckedItems, checkedItems
  } = useItemSubmit(id);
  const { t } = useTranslation();

  const { data: attributeData } = useAsync(() => AttributeValueServices.getByAttributeValueByValue())
  const variant = watch("variant", [{ price: "", selling_price: "", stock: "", groupArrSelections: {} }]);

  const handleCheckboxChange = (e, _id) => {
    setCheckedItems((prev) => {
      const updatedCheckedItems = {
        ...prev,
        [_id]: !prev[_id],  // Toggle state manually
      };
      return updatedCheckedItems;
    });
  };

  const handleAddField = () => {
    setValue("variant", [...variant, { price: "", selling_price: "", stock: "", groupArrSelections: {} }]);
  }
  const handleRemoveField = (index) => {
    const updatedAddresses = variant.filter((_, idx) => idx !== index);
    setValue("variant", updatedAddresses);
  };
  // handleChange
  const handleChange = (e, index, _id) => {
    const { name, value } = e.target;
    const updatedVariant = [...variant];
    updatedVariant[index] = {
      ...updatedVariant[index],
      [name]: value,
      _id
    };
    setValue("variant", updatedVariant);
  };
  // Handle Change for Group Dropdown Selections
  const handleGroupChange = (e, index, groupName) => {
    const { value } = e.target;
    const updatedVariant = [...variant];
    updatedVariant[index] = {
      ...updatedVariant[index],
      groupArrSelections: {
        ...updatedVariant[index].groupArrSelections,
        [groupName]: value, // Update the selected group value dynamically
      },
    };
    setValue("variant", updatedVariant);
  };

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          register={register}
          handleSelectLanguage={handleSelectLanguage}
          title={id ? t("Update Stock") : t("Add Stock")}
        />
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          <CardBody>
            <form onSubmit={handleSubmit(attributeSubmit)}>
              <div className="px-6 flex-grow scrollbar-hide w-full max-h-full pb-40">

                <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  {/* <div className="col-span-12 md:col-span-12">
                    <LabelArea label="Including GST ?" />
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Input {...register("gst_check")} type="radio" value="Yes" className="mr-2" onChange={(e) => setGSTData(e.target?.value)} />
                        <span className="ml-0">Yes</span>
                      </div>
                      <div className="flex items-center ml-4">
                        <Input {...register("gst_check")} type="radio" value="No" className="mr-2" onChange={(e) => setGSTData(e.target?.value)} />
                        <span className="ml-0">No</span>
                      </div>
                    </div>
                  </div> */}

                  {/* {gstData === "No" ? <div className="col-span-12 md:col-span-12">
                    <LabelArea label="GST" status />
                    <InputArea
                      required
                      register={register}
                      label="GST"
                      name="gst"
                      type="text"
                      autoComplete="gst"
                      placeholder="GST"
                    />
                    <Error errorName={errors.gst} />
                  </div> : null} */}

                  {/* <div className="col-span-12 md:col-span-12">
                    <LabelArea label="Offer" status />
                    <InputArea
                      required
                      register={register}
                      label="Offer"
                      name="offer"
                      type="text"
                      autoComplete="offer"
                      placeholder="Offer"
                    />
                    <Error errorName={errors.offer} />
                  </div> */}

                  {/* <div className="col-span-12 md:col-span-12">
                    <LabelArea label="Attribute" />
                    {attributeData?.map((e, i) => {
                      return (
                        <Fragment key={i}>
                          <Input type="checkbox" checked={!!checkedItems?.[e.id]} className="mr-2 ml-3" onChange={(ev) => handleCheckboxChange(ev, e.id)} />
                          <span className="ml-0">{e.name}</span>
                        </Fragment>
                      )
                    })}
                  </div> */}

                </div>

                <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  {variant?.map((x, index) => (
                    <React.Fragment key={index}>
                      {/* Form fields on the left side (spanning 10 columns) */}
                      <div className="col-span-6 space-y-4">
                        {/* <div className="col-span-8">
                          <label htmlFor={`variant[${index}].price`} className="block text-sm font-medium text-gray-700">
                            Price <span style={{ color: "red" }}>*</span>
                          </label>
                          <Input
                            className="border text-sm block w-full bg-gray-100 border-gray-200"
                            {...register(`variant.${index}.price`, {
                              required: "Price is required!",
                            })}
                            name={`price`}
                            placeholder="Price"
                            spellCheck="false"
                            value={x.price || ""}
                            onChange={(e) => handleChange(e, index, x._id)}
                          />
                          {errors?.price?.[index]?.price && (
                            <p className="text-red-500">{errors.price[index].price.message}</p>
                          )}
                        </div> */}

                        {/* <div className="col-span-8">
                          <label htmlFor={`variant[${index}].selling_price`} className="block text-sm font-medium text-gray-700">
                            Selling Price <span style={{ color: "red" }}>*</span>
                          </label>
                          <Input
                            className="border text-sm block w-full bg-gray-100 border-gray-200"
                            {...register(`variant.${index}.selling_price`, {
                              required: "Selling Price is required!",
                            })}
                            name="selling_price"
                            placeholder="Selling Price"
                            value={x?.selling_price || ""}
                            spellCheck="false"
                            onChange={(e) => handleChange(e, index)}
                          />
                          {errors?.selling_price?.[index]?.selling_price && (
                            <p className="text-red-500">{errors.selling_price[index].selling_price.message}</p>
                          )}
                        </div> */}

                        <div className="col-span-8">
                          <label htmlFor={`variant[${index}].stock`} className="block text-sm font-medium text-gray-700">
                            Stock <span style={{ color: "red" }}>*</span>
                          </label>
                          <Input
                            className="border text-sm block w-full bg-gray-100 border-gray-200"
                            {...register(`variant.${index}.stock`, {
                              required: "Stock is required!",
                            })}
                            name="stock"
                            placeholder="Stock"
                            spellCheck="false"
                            value={x?.stock || ""}
                            onChange={(e) => handleChange(e, index)}
                          />
                          {errors?.stock?.[index]?.stock && (
                            <p className="text-red-500">{errors.stock[index].stock.message}</p>
                          )}
                        </div>

                        {/* Attribute Selection */}
                        {/* <div className="col-span-8">
                          {attributeData.map(
                            (item) => {
                              return checkedItems?.[item.id] && (
                                <div key={item.id}>
                                  <label
                                    htmlFor={`group-select-${item.name}`}
                                    className="mt-2 block text-sm font-medium text-gray-700"
                                  >
                                    Attribute for {item.name}
                                  </label>
                                  <Select
                                    id={`group-select-${item.name}`}
                                    value={x.groupArrSelections?.[item.id] || ""}
                                    onChange={(e) => handleGroupChange(e, index, item.id)}
                                  >
                                    <option value="" defaultValue>
                                      Select
                                    </option>
                                    {item.groupArr.map((groupItem, idx) => {
                                      return (
                                        <option key={idx} value={groupItem.attribute_id}>
                                          {groupItem.name}
                                        </option>
                                      )
                                    })}
                                  </Select>
                                </div>
                              )
                            }
                          )}
                        </div> */}
                      </div>

                      {/* <div className="col-span-3">
                        <LabelArea label="Image" />
                        <CategoryUploader folder="admin" setNewImage={setNewImage} />
                      </div> */}

                      {/* Remove Button */}
                      {/* {variant.length > 1 && (
                        <div className="col-span-1 flex items-center justify-center">
                          <Button
                            layout="outline"
                            size="small"
                            className="text-red-500 border-red-500 hover:bg-red-100 mt-4"
                            onClick={() => handleRemoveField(index)}
                          >
                            <FiTrash className="w-4 h-4" />
                          </Button>
                        </div>
                      )} */}
                      <div className="col-span-12 my-4 border-t border-gray-300"></div>
                      {/* Image uploader on the right side (spanning 2 columns) */}

                    </React.Fragment>
                  ))}

                  {/* Add New Variant Button */}
                  {/* {variant.length < 5 && (
                    <div className="col-span-2 flex items-center justify-center">
                      <Button
                        layout="outline"
                        onClick={handleAddField}
                        className="flex items-center text-green-500 border-green-500 hover:bg-green-100 mt-4"
                      >
                        Add Variant <FiPlusCircle className="ml-1 w-4 h-4" />
                      </Button>
                    </div>
                  )} */}
                </div>


              </div>
              <DrawerButton id={id} title="Stock" isSubmitting={isSubmitting} nextBtn={false} setNextBtn={setNextBtn} setTapValue={setTapValue} tapValue={"Item Attribute"} flag />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default StockDrawer;
