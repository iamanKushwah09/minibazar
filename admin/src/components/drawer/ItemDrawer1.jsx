import React, { Fragment, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Input, Textarea, Button, Select } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
// Internal imports
import Error from "@/components/form/others/Error";
import useAsync from "@/hooks/useAsync";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import DrawerButton from "@/components/form/button/DrawerButton";
import LabelArea from "@/components/form/selectOption/LabelArea";
import ActiveButton from "@/components/form/button/ActiveButton";
import SelectUnit from "../form/selectOption/SelectUnit";
import SelectBrand from "../form/selectOption/SelectBrand";
import SelectItemGroup from "../form/selectOption/SelectItemGroup";
import SelectCategory from "../form/selectOption/SelectCategory";
import useItemSubmit from "@/hooks/useItemSubmit";
import AttributeGroupServices from "@/services/AttributeGroupServices";
import AttributeValueServices from "@/services/AttributeValueServices";
import CategoryUploader from "@/components/image-uploader/CategoryUploader";
import { FiPlusCircle, FiTrash } from "react-icons/fi";
import { notifyError } from "@/utils/toast";
import AttributeUploader from "../image-uploader/AttributeUploader";


const ItemDrawer = ({ id }) => {

  const {
    itemInfo,
    register,
    handleSubmit,
    infoSubmit,
    attributeSubmit,
    errors,
    imageUrl,
    setImageUrl,
    setNewImage,
    isSubmitting,
    selectedDate,
    setSelectedDate,
    handleSelectLanguage,
    setCheckedState,
    // handleIsCombination,
    handleProductTap,
    setTapValue,
    tapValue,
    checkedState,
    watch,
    setNextBtn,
    nextBtn,
    // createAndUpdate,
    setValue,
    setGSTData, gstData,
    // setFullData, fullData
    setCheckedItems, checkedItems,
    newImage,
    hasAttributes, setHasAttributes
  } = useItemSubmit(id);
  const { t } = useTranslation();

  const { data } = useAsync(() => AttributeGroupServices.getAllAttributeGroup());
  const { data: attributeData } = useAsync(() => AttributeValueServices.getByAttributeValueByValue())
  const variant = watch("variant", [{ attribute_image: [], price: "", selling_price: "", stock: "", groupArrSelections: {} }]);
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
    setValue("variant", [...variant, { attribute_image: [], price: "", selling_price: "", stock: "", groupArrSelections: {} }]);
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
  const handleAttributeImage = (index, image) => {
    const updatedVariant = [...variant];
    updatedVariant[index] = {
      ...updatedVariant[index],
      attribute_image: image,
    };
    setValue("variant", updatedVariant);
  };


  // useEffect(() => {
  //   // index not defined
  //   const updatedVariant = [...variant];  
  //   updatedVariant[index] = {
  //     ...updatedVariant[index],
  //     attribute_image: imageUrl,
  //   };
  //   setValue("variant", updatedVariant);
  // }, [imageUrl]);
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
  const checkItemAttr = () => notifyError("Filled all required fields.")
  // console.log("itemInfo : ", itemInfo);
  // console.log("InfoSubmit : ", infoSubmit);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          register={register}
          handleSelectLanguage={handleSelectLanguage}
          title={id ? t("Update Item") : t("Add Item")}
        />
      </div>

      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <ActiveButton
              tapValue={tapValue}
              activeValue="Item Info"
              handleProductTap={handleProductTap}
            />
          </li>

          <li className="mr-2">
            <ActiveButton
              tapValue={nextBtn ? "" : tapValue}
              activeValue="Item Attribute"
              handleProductTap={nextBtn ? checkItemAttr : handleProductTap}
            />
          </li>
        </ul>
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          <CardBody>
            {tapValue === "Item Info" ? <form onSubmit={itemInfo.handleSubmit(infoSubmit)}>
              <div className="px-6 flex-grow scrollbar-hide w-full max-h-full pb-40">

                {/* Row 1 */}
                <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  {/* Name */}
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="Name" status />
                    <InputArea
                      required
                      register={itemInfo?.register}
                      label="Name"
                      name="name"
                      type="text"
                      autoComplete="username"
                      placeholder="Name"
                    />
                    <Error errorName={itemInfo.errors?.name} />
                  </div>

                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="Alias" />
                    <InputArea
                      register={itemInfo?.register}
                      label="Alias"
                      name="alias"
                      type="text"
                      autoComplete="alias"
                      placeholder="Alias"
                    />
                    <Error errorName={errors?.alias} />
                  </div>

                  {/* Category */}
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="Category" />
                    <SelectCategory register={itemInfo?.register} setValue={setValue} label="Category" name="category_id" />
                    {/* <Error errorName={itemInfo.errors.category_id} /> */}
                  </div>

                  {/* Item Group */}
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="Item group" />
                    <SelectItemGroup register={itemInfo?.register} label="Item group"
                      setValue={setValue} name="item_group_id" />
                    {/* <Error errorName={itemInfo.errors.item_group_id} /> */}
                  </div>
                </div>
                {/* Row 2 */}
                <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  {/* Brand */}
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="Brand" />
                    <SelectBrand register={itemInfo?.register} setValue={setValue} label="Brand" name="brand_id" />
                    {/* <Error errorName={itemInfo.errors.brand_id} /> */}
                  </div>
                  {/* Unit */}
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="Unit" />
                    <SelectUnit register={itemInfo?.register} setValue={setValue} label="Unit" name="unit_id" />
                    {/* <Error errorName={itemInfo.errors.unit_id} /> */}
                  </div>
                  {/* Alternate Unit */}
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="Alternate unit" />
                    <InputArea
                      // required
                      register={itemInfo?.register}
                      label="Alternate unit"
                      name="alternate_unit"
                      type="text"
                      placeholder="Alternate unit"
                    />
                    {/* <Error errorName={itemInfo.errors.alternate_unit} /> */}
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="Conversion factor" />
                    <InputArea
                      // required
                      register={itemInfo?.register}
                      label="Conversion factor"
                      name="conversion_factor"
                      type="number"
                      placeholder="Conversion factor"
                    />
                    {/* <Error errorName={itemInfo.errors.conversion_factor} /> */}
                  </div>
                </div>
                {/* Row 3 */}
                <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  {/* Tax GST */}
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="Tax GST" />
                    <InputArea
                      // required
                      register={itemInfo?.register}
                      label="Tax GST"
                      name="tax_gst"
                      type="text"
                      placeholder="Tax GST"
                    />
                    {/* <Error errorName={itemInfo.errors.tax_gst} /> */}
                  </div>
                  {/* HSN Code */}
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="HSN Code" />
                    <InputArea
                      // required
                      register={itemInfo?.register}
                      label="HSN Code"
                      name="hsn_code"
                      type="text"
                      placeholder="HSN Code"
                    />
                    {/* <Error errorName={itemInfo.errors.hsn_code} /> */}
                  </div>

                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="Sale Price" />
                    <InputArea
                      // required
                      register={itemInfo?.register}
                      label="Sale Price"
                      name="sale_price"
                      type="number"
                      placeholder="Sale Price"
                    />
                    {/* <Error errorName={itemInfo.errors.sale_price} /> */}
                  </div>

                    {/* MRP */}
                    <div className="col-span-12 md:col-span-3">
                      <LabelArea label="MRP" />
                      <InputArea
                        // required
                        register={itemInfo?.register}
                        label="MRP"
                        name="mrp"
                        type="number"
                        placeholder="MRP"
                      />
                      {/* <Error errorName={itemInfo.errors.mrp} /> */}
                    </div>
                    {/* Stock */}
                    <div className="col-span-12 md:col-span-3">
                      <LabelArea label="Stock" />
                      <InputArea
                        register={itemInfo?.register}
                        label="Stock"
                        name="stock"
                        type="number"
                        placeholder="Stock"
                      />
                    </div>
                  </div>
                {/* Row 5 */}
                <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">

                  {/* Discount */}
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="Discount" />
                    <InputArea
                      // required
                      register={itemInfo?.register}
                      label="Discount"
                      name="discount"
                      type="number"
                      placeholder="Discount"
                    />
                    {/* <Error errorName={itemInfo.errors.discount} /> */}
                  </div>
                  {/* Vendor Discount */}
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="Vendor Discount" />
                    <InputArea
                      // required
                      register={itemInfo?.register}
                      label="Vendor Discount"
                      name="vendor_discount"
                      type="number"
                      placeholder="Vendor Discount"
                    />
                    {/* <Error errorName={itemInfo.errors.vendor_discount} /> */}
                  </div>

                  {/* Short Description */}
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="Short description" />
                    <Textarea
                      className="border text-sm block w-full bg-gray-100 border-gray-200"
                      {...register("short_description", {
                        required: false,
                      })}
                      register={itemInfo?.register}
                      name="short_description"
                      placeholder="Short description"
                      rows="1"
                      spellCheck="false"
                    />
                    {/* <Error errorName={itemInfo.errors.short_description} /> */}
                  </div>
                  {/* Specification */}
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="Specification" />
                    <InputArea
                      // required
                      register={itemInfo?.register}
                      label="Specification"
                      name="specification"
                      type="text"
                      placeholder="Specification"
                    />
                    {/* <Error errorName={itemInfo.errors.specification} /> */}
                  </div>
                </div>
                {/* Row 6 */}
                <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">

                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label="Long description" />
                    <Textarea
                      {...itemInfo.register("long_description")}
                      className="border text-sm block w-full bg-gray-100 border-gray-200"
                      name="long_description"
                      placeholder="Long description"
                      rows="5"
                      spellCheck="false"
                    />
                    {/* <Error errorName={itemInfo.errors.long_description} /> */}
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <LabelArea label="Image" />
                    <CategoryUploader
                      folder="admin"
                      setNewImage={setNewImage}
                      initialImages={newImage}
                    />
                  </div>
                </div>
              </div>
              <DrawerButton id={id} title="Item" onClick={console.log("Item clicked")} isSubmitting={isSubmitting} nextBtn={nextBtn} setNextBtn={setNextBtn} setTapValue={setTapValue} tapValue={tapValue} flag={true} />
            </form> : null}

            {tapValue === "Item Attribute" ? <form onSubmit={handleSubmit(attributeSubmit)}>
              <div className="px-6 flex-grow scrollbar-hide w-full max-h-full pb-40">

                  <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                    <div className="col-span-12 md:col-span-12">
                      <LabelArea label="Enable Item Attributes ?" />
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Input
                            type="checkbox"
                            className="mr-2"
                            checked={hasAttributes}
                            onChange={(e) => setHasAttributes(e.target.checked)}
                          />
                          <span className="ml-0">Yes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {hasAttributes && (
                  <>
                <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <div className="col-span-12 md:col-span-12">
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
                  </div>

                  {gstData === "No" ? <div className="col-span-12 md:col-span-12">
                    <LabelArea label="GST" />
                    <InputArea
                      register={register}
                      label="GST"
                      name="gst"
                      type="text"
                      autoComplete="gst"
                      placeholder="GST"
                    />
                    <Error errorName={errors.gst} />
                  </div> : null}

                  <div className="col-span-12 md:col-span-12">
                    <LabelArea label="Offer" />
                    <InputArea
                      register={register}
                      label="Offer"
                      name="offer"
                      type="text"
                      autoComplete="offer"
                      placeholder="Offer"
                    />
                    <Error errorName={errors.offer} />
                  </div>

                  <div className="col-span-12 md:col-span-12">
                    <LabelArea label="Attribute" />
                    
                    {attributeData?.map((group, i) => (
                      group.groupArr?.map((item, j) => {
                        const attrId = item?.attribute_id;
                        return (
                          <Fragment key={`${i}-${j}`}>
                            <Input
                              type="checkbox"
                              checked={!!checkedItems && !!attrId && !!checkedItems[attrId]}
                              className="mr-2 ml-3"
                              onChange={(ev) => handleCheckboxChange(ev, attrId)}
                            />
                            <span className="ml-0">{item.name}</span>
                          </Fragment>
                        );
                      })
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  {variant?.map((x, index) => (
                    <React.Fragment key={index}>
                      {/* Form fields on the left side (spanning 10 columns) */}
                      <div className="col-span-6 space-y-4">
                        <div className="col-span-8">
                          <label htmlFor={`variant[${index}].quantity`} className="block text-sm font-medium text-gray-700">
                            Quantity / Weight
                          </label>
                          <Input
                            className="border text-sm block w-full bg-gray-100 border-gray-200"
                            {...register(`variant.${index}.quantity`, {
                              required: false,
                            })}
                            name={`quantity`}
                            placeholder="e.g., 100gm, 500gm"
                            spellCheck="false"
                            value={x.quantity || ""}
                            onChange={(e) => handleChange(e, index, x._id)}
                          />
                          {errors?.quantity?.[index]?.quantity && (
                            <p className="text-red-500">{errors.quantity[index].quantity.message}</p>
                          )}
                        </div>

                        <div className="col-span-8">
                          <label htmlFor={`variant[${index}].price`} className="block text-sm font-medium text-gray-700">
                            Price
                          </label>
                          <Input
                            className="border text-sm block w-full bg-gray-100 border-gray-200"
                            {...register(`variant.${index}.price`, {
                              required: false,
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
                        </div>

                        <div className="col-span-8">
                          <label htmlFor={`variant[${index}].selling_price`} className="block text-sm font-medium text-gray-700">
                            Selling Price
                          </label>
                          <Input
                            className="border text-sm block w-full bg-gray-100 border-gray-200"
                            {...register(`variant.${index}.selling_price`, {
                              required: false,
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
                        </div>

                        <div className="col-span-8">
                          <label htmlFor={`variant[${index}].stock`} className="block text-sm font-medium text-gray-700">
                            Stock
                          </label>
                          <Input
                            className="border text-sm block w-full bg-gray-100 border-gray-200"
                            {...register(`variant.${index}.stock`, {
                              required: false,
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
                        <div className="col-span-8">
                          {console.log("attributeData", attributeData)}
                          {attributeData?.map(
                            (item) => {
                              return checkedItems[item.id] && (
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
                                    {console.log("item.groupArr", item.groupArr)}
                                    {item.groupArr?.map((groupItem, idx) => {
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
                        </div>
                      </div>

                      <div className="col-span-3">
                        <LabelArea label="Image" />
                        <AttributeUploader folder="admin" initialImages={x.attribute_image || []} index={index} handleAttributeImage={handleAttributeImage} />
                      </div>

                      {/* Remove Button */}
                      {variant.length > 1 && (
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
                      )}
                      <div className="col-span-12 my-4 border-t border-gray-300"></div>
                      {/* Image uploader on the right side (spanning 2 columns) */}

                    </React.Fragment>
                  ))}

                  {/* Add New Variant Button */}
                  {variant.length < 5 && (
                    <div className="col-span-2 flex items-center justify-center">
                      <Button
                        layout="outline"
                        onClick={handleAddField}
                        className="flex items-center text-green-500 border-green-500 hover:bg-green-100 mt-4"
                      >
                        Add Variant <FiPlusCircle className="ml-1 w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                </>
                )}
              </div>
              <DrawerButton id={id} title="Item" isSubmitting={isSubmitting} nextBtn={nextBtn} setNextBtn={setNextBtn} setTapValue={setTapValue} tapValue={tapValue} flag={false} />
            </form> : null}
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default ItemDrawer;
