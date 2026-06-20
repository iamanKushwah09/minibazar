import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Select } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { Scrollbars } from "react-custom-scrollbars-2";

//internal import
import { Card, CardBody, Input, Button } from "@windmill/react-ui";
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import LabelArea from "@/components/form/selectOption/LabelArea";
import InputArea from "@/components/form/input/InputArea";
import DrawerButton from "@/components/form/button/DrawerButton";
import useOrderSubmit from "@/hooks/useOrderSubmit";
import SelectPayment from "../form/selectOption/SelectPayment";
import { FiPlusCircle, FiTrash } from "react-icons/fi";
import ItemServices from "@/services/ItemServices";
import SelectVendor from "../form/selectOption/SelectVendor";
import CustomerServices from "@/services/CustomerServices";
import SearchableDropdown from "@/pages/SearchableDropdown";


const OrderDrawer = ({ id }) => {
  const {
    handleSubmit,
    onSubmit,
    register,
    errors,
    variants,
    addVariant,
    isSubmitting,
    removeVariant,
    handleSelectLanguage,
    setSelectedItem,
    selectedItem,
    watch,
    setValue,
    totalAmount,
    setTotalAmount
  } = useOrderSubmit(id);

  const { t } = useTranslation();

  const variant = watch("variant", [{ item_id: "", price: "", amount: "", qty: "", tax: "", discount: "" }]);
  const handleAddField = () => {
    setValue("variant", [...variant, { item_id: "", price: "", amount: "", qty: "", tax: "", discount: "" }]);
  }
  const handleRemoveField = (index) => {
    const updatedInputList = variant.filter((_, idx) => idx !== index);
    setValue("variant", updatedInputList);

    const newTotalAmount = updatedInputList.reduce((total, item) => {
      const itemAmount = (item.qty || 0) * (item.price || 0);
      const itemDiscount = (itemAmount * item.discount) / 100;
      const itemTax = ((itemAmount - itemDiscount) * item.tax) / 100;
      const itemTotalAmount = itemAmount - itemDiscount + itemTax;
      return total + itemTotalAmount;
    }, 0);
    setTotalAmount(newTotalAmount);
  };

  // handleChange
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    // Create a copy of the `variant` array
    const list = [...variant];
    // Update the specific item at the given index
    const item = { ...list[index], [name]: value };
    // Convert fields to float or 0 if not available
    const qty = item.qty ? parseFloat(item.qty) : 0;
    const price = item.price ? parseFloat(item.price) : 0;
    const discount = item.discount ? parseFloat(item.discount) : 0;
    // console.log({qty,price,discount})
    const tax = item.tax ? parseFloat(item.tax) : 0;
    // Calculate the discount value
    let discount_val = qty * price - (qty * price * (discount / 100));
    const amount = discount_val + ((discount_val * tax) / 100);
    // Update the item and set it back in the list
    const updatedItem = { ...item, amount };
    list[index] = updatedItem;
    // Update the state with the new list
    setValue("variant", list);
    const totalAmounts = list.reduce((sum, item) => sum + (item.amount || 0), 0);
    setTotalAmount(totalAmounts);
  }
  const [data, setData] = useState([])
  const [apiData, setApiData] = useState([])
  const [selectedVendorType, setSelectedVendorType] = useState('');
  const [filteredData, setFilteredData] = useState([]);


  const [vendorList, setVendorList] = useState([]);
  const [isSearchingVendors, setIsSearchingVendors] = useState(false);
  const [vendorPage, setVendorPage] = useState(1);
  const [hasMoreVendors, setHasMoreVendors] = useState(false);
  const [loadingMoreVendors, setLoadingMoreVendors] = useState(false);

  // Fetch initial vendors
  const fetchInitialVendors = async () => {
    setIsSearchingVendors(true);
    try {
      const res = await CustomerServices.activeCustomer("", {
        params: {
          group_type: selectedVendorType,
          page: 1,
          limit: 100
        }
      });
      setVendorList(res.data || []);
      setHasMoreVendors(res.pagination?.hasNext || false);
      setVendorPage(1);
    } catch (error) {
      console.error("Error fetching initial vendors:", error);
    } finally {
      setIsSearchingVendors(false);
    }
  };

  const handleSearchVendors = useCallback(async (query) => {
    setIsSearchingVendors(true);
    try {
      const res = await CustomerServices.activeCustomer(
        query,
        {
          params: {
            group_type: selectedVendorType,
            page: 1,
            limit: 100
          }
        }
      );
      setVendorList(res.data || []);
      setHasMoreVendors(res.pagination?.hasNext || false);
      setVendorPage(1);
    } catch (error) {
      console.error("Error searching vendors:", error);
    } finally {
      setIsSearchingVendors(false);
    }
  }, [selectedVendorType]);

  const handleLoadMoreVendors = useCallback(async (query) => {
    if (loadingMoreVendors || !hasMoreVendors) return;
    setLoadingMoreVendors(true);
    try {
      const nextPage = vendorPage + 1;
      const res = await CustomerServices.activeCustomer(
        query,
        {
          params: {
            group_type: selectedVendorType,
            page: nextPage,
            limit: 100
          }
        }
      );
      setVendorList(prev => [...prev, ...(res.data || [])]);
      setHasMoreVendors(res.pagination?.hasNext || false);
      setVendorPage(nextPage);
    } catch (error) {
      console.error("Error loading more vendors:", error);
    } finally {
      setLoadingMoreVendors(false);
    }
  }, [selectedVendorType, vendorPage, hasMoreVendors, loadingMoreVendors]);

  const vendorOptions = useMemo(() => {
    return vendorList?.map((item) => ({
      value: item._id,
      label: item.name,
      code: item.code,
      print_name: item.print_name
    })) || [];
  }, [vendorList]);

  useEffect(() => {
    fetchInitialVendors();
  }, [selectedVendorType]);


  // useEffect(() => {
  //   filterData();
  // }, [selectedVendorType, apiData]);



  const getStaffData = async () => {
    try {
      const res = await ItemServices.getActiveItem();

      if (res) {
        setData(res)
      }
    } catch (err) {
      console.log({ err })
    }
  };
  useEffect(() => {

    getStaffData();
  }, [])


  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("Update Order")}

          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("AddOrder")}

          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full">
                <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label={"Vendor"} />
                    <SelectVendor
                      register={register}
                      name="customers_type"
                      label="Vendor Type"
                      setValue={setValue}
                      onChange={(e) => setSelectedVendorType(e.target.value)}
                      value={selectedVendorType}
                    />
                    <Error errorName={errors.payment_mode} />
                  </div>
                  <div className="col-span-12 md:col-span-3">

                    <React.Fragment >
                      <div className="col-span-3">
                        <LabelArea label={selectedVendorType ? selectedVendorType : "select the vendor type"} />
                        <SearchableDropdown
                          options={vendorOptions}
                          onSearch={handleSearchVendors}
                          onLoadMore={handleLoadMoreVendors}
                          hasMore={hasMoreVendors}
                          loading={isSearchingVendors}
                          loadingMore={loadingMoreVendors}
                          onChange={(selectedValue) => {
                            setValue("customers_id", selectedValue?.value || "");
                          }}
                          placeholder={`${selectedVendorType || "Vendor"} Name`}
                        />
                        <input type="hidden" {...register("customers_id")} />
                      </div>
                    </React.Fragment>


                  </div>
                </div>
                <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label={"Order date"} />
                    <InputArea
                      required={true}
                      register={register}
                      label="Order date"
                      name="order_date"
                      type="date"
                    />
                    <Error errorName={errors.order_date} />
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label={"Order no"} />
                    <InputArea
                      required={true}
                      register={register}
                      label="Order no"
                      name="order_no"
                      type="number"
                      placeholder={"Order no"}
                    />
                    <Error errorName={errors.order_no} />
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label={"Payment Mode"} />
                    <SelectPayment
                      register={register}
                      name="payment_mode"
                      label="Payment Mode"
                    />
                    <Error errorName={errors.payment_mode} />
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <LabelArea label={"Shipping charge"} />
                    <InputArea
                      required={true}
                      register={register}
                      label="Shipping charge"
                      name="shipping_charge"
                      type="number"
                      placeholder={"Shipping charge"}
                    />
                    <Error errorName={errors.shipping_charge} />
                  </div>
                </div>
              </div>
              <div className="px-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
                <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  {variant?.map((x, index) => (
                    <React.Fragment key={index}>
                      <div className="col-span-3">
                        <LabelArea label={"Item"} />
                        <SearchableDropdown
                          options={data.map((item) => ({
                            value: item._id,
                            label: item.name,
                          }))}
                          onChange={(selectedValue) => {
                            handleChange({ target: { name: "item_id", value: selectedValue } }, index);
                          }}
                          placeholder="Select Item"
                        />
                        <input
                          type="hidden"
                          {...register(`variant.${index}.item_id`, {
                            required: "Item is required!",
                          })}
                          value={x.item_id || ""}
                        />

                      </div>
                      <div className="col-span-1">
                        <label htmlFor={`variant[${index}].qty`} className="block text-sm font-medium text-gray-700">
                          Qty <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          className="border text-sm block w-full bg-gray-100 border-gray-200"
                          {...register(`variant.${index}.qty`, {
                            required: "qty is required!",
                          })}
                          name="qty"
                          value={variant[index]?.qty || ""}
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Qty"
                          spellCheck="false"
                        />
                        {errors?.qty?.[index]?.qty && (<p className="text-red-500">{errors.qty[index].qty.message}</p>)}
                      </div>
                      <div className="col-span-1">
                        <label htmlFor={`variant[${index}].price`} className="block text-sm font-medium text-gray-700">
                          Price <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          className="border text-sm block w-full bg-gray-100 border-gray-200"
                          {...register(`variant.${index}.price`, {
                            required: "Price is required!",
                          })}
                          name="price"
                          value={variant[index]?.price || ""}
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Price"
                          spellCheck="false"
                        />
                        {errors?.price?.[index]?.price && (<p className="text-red-500">{errors.price[index].price.message}</p>)}
                      </div>
                      <div className="col-span-1">
                        <label htmlFor={`variant[${index}].tax`} className="block text-sm font-medium text-gray-700">
                          GST(%) <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          className="border text-sm block w-full bg-gray-100 border-gray-200"
                          {...register(`variant.${index}.tax`, {
                            required: "tax is required!",
                          })}
                          name="tax"
                          value={variant[index]?.tax || ""}
                          onChange={(e) => handleChange(e, index)}
                          placeholder="%"
                          spellCheck="false"
                        />
                        {errors?.tax?.[index]?.tax && (<p className="text-red-500">{errors.tax[index].tax.message}</p>)}
                      </div>
                      <div className="col-span-2">
                        <label htmlFor={`variant[${index}].discount`} className="block text-sm font-medium text-gray-700">
                          Discount <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          className="border text-sm block w-full bg-gray-100 border-gray-200"
                          {...register(`variant.${index}.discount`, {
                            required: "discount is required!",
                          })}
                          name="discount"
                          value={variant[index]?.discount || ""}
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Discount"
                          spellCheck="false"
                        />
                        {errors?.discount?.[index]?.discount && (<p className="text-red-500">{errors.discount[index].discount.message}</p>)}
                      </div>
                      <div className="col-span-2">
                        <label htmlFor={`amount[${index}].amount`} className="block text-sm font-medium text-gray-700">
                          Amount <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          className="border text-sm block w-full bg-gray-100 border-gray-200"
                          disabled
                          value={Number(x.amount || 0).toFixed(2)}
                          placeholder="Amount"
                          spellCheck="false"
                        />
                        {errors?.amount?.[index]?.amount && (<p className="text-red-500">{errors.amount[index].amount.message}</p>)}
                      </div>
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
                    </React.Fragment>
                  ))}
                  <div className="col-span-1 flex items-center">
                    <Button
                      layout="outline"
                      onClick={handleAddField}
                      className="flex items-center text-green-500 border-green-500 hover:bg-green-100 mt-4" // Custom width with Tailwind
                    >
                      <FiPlusCircle className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="col-span-3 flex items-center">
                    <span>Total Qty: {variant?.map((x) => x.qty * 1)?.reduce((a, b) => a + b, 0)}</span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span>Total Amt.: {Number(totalAmount).toFixed(2)}</span>
                  </div>

                </div>
              </div>
              <DrawerButton id={id} title="Order" isSubmitting={isSubmitting} />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default OrderDrawer;
