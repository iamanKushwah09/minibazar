import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Input } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import useVendorGroupSubmit from "@/hooks/useVendorGroupSubmit";
import SelectRole from "@/components/form/selectOption/SelectRole";
import DrawerButton from "@/components/form/button/DrawerButton";
import LabelArea from "@/components/form/selectOption/LabelArea";
import Uploader from "@/components/image-uploader/Uploader";
import CheckBox from "@/components/form/others/CheckBox";
import SwitchToggleForCombination from "@/components/form/switch/SwitchToggleForCombination";
import SelectVendorGroup from "../form/selectOption/SelectVendorGroup";
import SelectSalesman from "../form/selectOption/SelectSalesman";

const VendorGroupDrawer = ({ id }) => {

  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    isSubmitting,
    selectedDate,
    setSelectedDate,
    handleSelectLanguage,
    handleIsCombination,
    isCombination,
    setValue,
    setCheckedState,
    checkedState,
    resData
  } = useVendorGroupSubmit(id);
  const { t } = useTranslation();

  // Debug logging
  console.log("VendorGroupDrawer - resData:", resData);
  console.log("VendorGroupDrawer - salesman_id:", resData?.salesman_id);

  // Force re-render when resData changes
  useEffect(() => {
    if (resData && Object.keys(resData).length > 0) {
      console.log("VendorGroupDrawer - resData updated:", resData);
    }
  }, [resData]);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          register={register}
          handleSelectLanguage={handleSelectLanguage}
          title={id ? t("Update Vendor Group") : t("Add Vendor Group")}
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
                  <LabelArea label="Name" status={true} />
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

                {/* Discount */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Discount" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      // required
                      register={register}
                      label="Discount"
                      name="discount"
                      type="number"
                      placeholder="Discount"
                    />
                    {/* <Error errorName={errors.discount} /> */}
                  </div>
                </div>
                {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Sales Man" />
                  <div className="col-span-8 sm:col-span-4">
                      <SelectSalesman 
                       key={`salesman-${id || 'new'}`}
                       register={register} 
                       setValue={setValue} 
                       label="Sales Man" 
                       name="salesman_id"
                       defaultValue={resData?.salesman_id}
                     />
                    <Error errorName={errors.salesman_id} />
                  </div>
                </div> */}


                <SwitchToggleForCombination
                  product
                  handleProcess={handleIsCombination}
                  processOption={isCombination}
                />

                {isCombination ? <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Under group" status={true} />
                  <div className="col-span-8 sm:col-span-4">
                    <SelectVendorGroup 
                      key={`vendor-group-${id || 'new'}`}
                      register={register} 
                      setValue={setValue} 
                      label="Under group" 
                      name="parent_id"
                      defaultValue={resData?.parent_id}
                    />
                    <Error errorName={errors.parent_id} />
                  </div>
                </div> : null}

                
              </div>
              <DrawerButton id={id} title="Vendor Group" isSubmitting={isSubmitting} />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default VendorGroupDrawer;
