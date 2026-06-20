import React, { useState, useEffect } from "react";
import Scrollbars from "react-custom-scrollbars-2";
//internal import
import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import useCustomerSubmit from "@/hooks/useCustomerSubmit";
import DrawerButton from "@/components/form/button/DrawerButton";
import { Select, Textarea, Button } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import SelectCountry from "../form/selectOption/SelectCountry";
import SelectCity from "../form/selectOption/SelectCity";
import SelectState from "../form/selectOption/SelectState";
import { FiPlusCircle, FiTrash, FiEye, FiEyeOff } from "react-icons/fi";
import SelectSalesman from "../form/selectOption/SelectSalesman";
import SelectVendorGroup from "../form/selectOption/SelectVendorGroup";
import VendorGroupServices from "@/services/VendorGroupServices";
import SwitchToggleForCombination from "@/components/form/switch/SwitchToggleForCombination";

const CustomerDrawer = ({ id }) => {
  const { register, handleSubmit, onSubmit, errors, isSubmitting, setValue, watch, setCountry, setState, setCity, country_id, state_id, city_id,
    isCombination,
    handleIsCombination,
  } = useCustomerSubmit(id);
  const { t } = useTranslation();
  // const [country_id, setCountry] = useState("");
  // const [state_id, setState] = useState("");
  // const [city_id, setCity] = useState("");

  const [type, setType] = useState("Vendor");
  const [showPassword, setShowPassword] = useState(false);
  const shipping_address = watch("shipping_address", [{ shipping_address: "" }]);
  // Sync local state with useForm
  useEffect(() => {
    setValue("country_id", country_id);
  }, [country_id, setValue]);

  useEffect(() => {
    setValue("state_id", state_id);
  }, [state_id, setValue]);

  useEffect(() => {
    setValue("city_id", city_id);
  }, [city_id, setValue]);

  // const handleFetchLocation = (field, value) => {
  //   setValue(field, value); // Update form state directly
  // };

  // // Example usage: Call these functions when fetching location data
  // const updateCountry = (newCountryId) => handleFetchLocation("country_id", newCountryId);
  // const updateState = (newStateId) => handleFetchLocation("state_id", newStateId);
  // const updateCity = (newCityId) => handleFetchLocation("city_id", newCityId);

  const handleAddField = () => {
    setValue("shipping_address", [...shipping_address, { shipping_address: "" }]);
  }
  const handleRemoveField = (index) => {
    const updatedAddresses = shipping_address.filter((_, idx) => idx !== index);
    setValue("shipping_address", updatedAddresses);
  };

  const [vendorGroup, setVendorGroup] = useState("");
  // const [salesman, setSalesman] = useState("");
  // useEffect(() => {
  //   VendorGroupServices.getVendorGroupById(vendorGroup).then((res) => {
  //     console.log(res);
  //   });
  //   console.log("vendorGroup: ", vendorGroup);
  //   setValue("vendor_group_id", vendorGroup);
  // }, [vendorGroup]);


  useEffect(() => {
    if (vendorGroup) {
      setValue("vendor_group_id", vendorGroup); // update form value
      VendorGroupServices.getVendorGroupById(vendorGroup).then((res) => {
        console.log(" vendorGroup: ", res);
      });
    }
  }, [vendorGroup, setValue]);



  // useEffect(() => {
  //   setValue("salesman_id", salesman); 
  // }, [salesman, setValue]);

  return (<>
    <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
      {id ? (
        <Title
          title={"Update Customer"}
          description={"Update your Customer necessary information from here"}
        />
      ) : (
        <Title
          title={"Add Customer"}
          description={"Add your Customer necessary information from here"}
        />
      )}
    </div>
    <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-4 sm:px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">

          <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
            <div className="col-span-12 sm:col-span-6 md:col-span-3">
              <LabelArea label={"Name"} status />
              <InputArea
                required={true}
                register={register}
                label="Name"
                name="name"
                type="text"
                placeholder={"Name"}
              />
              <Error errorName={errors.name} />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3">
              <LabelArea label={"Email"} />
              <InputArea
                required={false}
                register={register}
                label="Email"
                name="email"
                type="email"
                placeholder={"Email"}
              />
              <Error errorName={errors.email} />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3">
              <LabelArea label={"Phone"} />
              <InputArea
                required={false}
                register={register}
                label="Phone"
                name="phone"
                type="number"
                placeholder={"Phone"}
              />
              <Error errorName={errors.phone} />
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3">
              <LabelArea label="Password" />
              <div className="relative">
                <InputArea
                  required={false}
                  register={register}
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <Error errorName={errors.password} />
            </div>

          </div>

          {/* Shipping Address, Password, Type Selection, and GST no */}
          <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
            <div className="col-span-12 sm:col-span-6 md:col-span-3">
              <LabelArea label={"Address"} />
              <Textarea
                className="border text-sm  block w-full bg-gray-100 border-gray-200"
                {...register("address")}
                name="address"
                placeholder="Address"
                rows="1"
                spellCheck="false"
              />
              <Error errorName={errors.address} />
            </div>

            <div className="col-span-12 sm:col-span-6 md:col-span-3">
              <LabelArea label="Type" />
              <Select
                name="type"
                {...register("type", {
                  onChange: (e) => {
                    setType(e.target.value);
                  },
                })}
              >
                <option value="" defaultValue hidden>
                  Select Type
                </option>
                <option value={"Customer"}>Customer</option>
                <option value={"Vendor"}>Vendor</option>
              </Select>
            </div>
            {type === "Vendor" && (
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <LabelArea label="Vendor Group" />
                <SelectVendorGroup defaultValue={watch("vendor_group_id")} setValue={setValue} setVendorGroup={setVendorGroup} register={register} label="Vendor Group" name="vendor_group_id" required={false} />
                <Error errorName={errors.vendor_group_id} />
              </div>
            )}
            <div className="col-span-12 sm:col-span-6 md:col-span-3">
              <LabelArea label="Sales Man" />
              <SelectSalesman setValue={setValue} register={register} label="Sales Man" name="salesman_id" value={watch("salesman_id")} required={false} />
              <Error errorName={errors.salesman_id} />
            </div>
            {type === "Vendor" && (<>
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <LabelArea label={"GST Type"} />
                <Select
                  name="gst_type"
                  {...register("gst_type")}
                >
                  <option value="" defaultValue hidden>
                    Select GST Type
                  </option>
                  <option value="Registered">{t("Registered")}</option>
                  <option value="Un-Registered">{t("Un-Registered")}</option>
                  <option value="Composition">{t("Composition")}</option>
                  <option value="Govt. Body">{t("Govt. Body")}</option>
                  <option value="UIN Holder">{t("UIN Holder")}</option>
                </Select>
                <Error errorName={errors.gst_type} />
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <LabelArea label={"GST No."} />
                <InputArea
                  register={register}
                  label="GST no"
                  name="gst_no"
                  type="text"
                  placeholder={"GST No."}
                />
                <Error errorName={errors.gst_no} />
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <LabelArea label={"Aadhar no"} />
                <InputArea
                  register={register}
                  label="Aadhar no"
                  name="aadhaar_no"
                  type="number"
                  placeholder={"Aadhar no"}
                />
                <Error errorName={errors.aadhaar_no} />
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <LabelArea label={"Tel no"} />
                <InputArea
                  register={register}
                  label="Tel no"
                  name="tel_no"
                  type="number"
                  placeholder={"Tel no"}
                />
                <Error errorName={errors.tel_no} />
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <LabelArea label={"Contact Person"} />
                <InputArea
                  register={register}
                  label="Contact Person"
                  name="contact_person"
                  type="number"
                  placeholder={"Contact Person"}
                />
                <Error errorName={errors.contact_person} />
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <LabelArea label={"Bank Detail"} />
                <InputArea
                  register={register}
                  label="Bank Detail"
                  name="bank_detail"
                  type="text"
                  placeholder={"Bank Detail"}
                />
                <Error errorName={errors.bank_detail} />
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <LabelArea label={"Discount"} />
                <InputArea
                  required={false}
                  name="discount"
                  register={register}
                  label="Discount"
                  type="number"
                  placeholder={"Discount"}
                />
                <Error errorName={errors.discount} />
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <LabelArea label="Country" />
                <SelectCountry register={register} setValue={setValue} setCountry={setCountry} label="Country" name="country_id" value={country_id} required={false} />
                <Error errorName={errors.country_id} />
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <LabelArea label="State" />
                <SelectState register={register} setValue={setValue} country_id={country_id} setState={setState} label="State" name="state_id" value={state_id} required={false} />
                <Error errorName={errors.state_id} />
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <LabelArea label="City" />
                <SelectCity register={register} setValue={setValue} required={false} state_id={state_id} country_id={country_id} setCity={setCity} label="City" name="city_id" value={city_id} />
                <Error errorName={errors.city_id} />
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <LabelArea label={"Pincode"} />
                <InputArea
                  register={register}
                  label="Pincode"
                  name="pincode"
                  type="number"
                  placeholder={"Pincode"}
                  required={false}
                />
                <Error errorName={errors.pincode} />
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <SwitchToggleForCombination
                  product
                  title="isCreditLimit"
                  handleProcess={handleIsCombination}
                  processOption={isCombination}
                />
              </div>
              {isCombination && (
                <>
                  <div className="col-span-12 sm:col-span-6 md:col-span-3">
                    <LabelArea label="Amount" />
                    <InputArea register={register} label="Amount" name="amount" type="number" placeholder="Amount" />
                    <Error errorName={errors.amount} />
                  </div>
                  <div className="col-span-12 sm:col-span-6 md:col-span-3">
                    <LabelArea label="Days" />
                    <InputArea register={register} label="Days" name="days" type="number" placeholder="Days" />
                    <Error errorName={errors.days} />
                  </div>
                </>
              )}
            </>
            )}
          </div>




          <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
            {shipping_address?.map((address, index) => (
              <React.Fragment key={index}>
                <div className="col-span-12 sm:col-span-10 md:col-span-8">
                  <label htmlFor={`shipping_address[${index}].shipping_address`} className="block text-sm font-medium text-gray-700">
                    Shipping Address {index + 1}
                  </label>
                  <Textarea
                    className="border text-sm block w-full bg-gray-100 border-gray-200"
                    {...register(`shipping_address.${index}.shipping_address`)}
                    placeholder="Shipping Address"
                    rows="1"
                    spellCheck="false"
                  />
                  {errors?.shipping_address?.[index]?.shipping_address && (
                    <p className="text-red-500">{errors.shipping_address[index].shipping_address.message}</p>
                  )}
                </div>
                {shipping_address.length > 1 && (
                  <div className="col-span-12 sm:col-span-2 md:col-span-1 flex items-center justify-center">
                    <Button
                      type="button"
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
            {shipping_address.length < 5 && (
              <div className="col-span-12 sm:col-span-2 md:col-span-1 flex items-center">
                <Button
                  type="button"
                  layout="outline"
                  className="flex items-center text-green-500 border-green-500 hover:bg-green-100 mt-4"
                  onClick={handleAddField}
                >
                  <FiPlusCircle className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

        </div>
        <DrawerButton id={id} title="Customer" isSubmitting={isSubmitting} />
      </form>
    </Scrollbars>
  </>);
};

export default CustomerDrawer;
