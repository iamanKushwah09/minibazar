import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Input } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
// Internal imports
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import usePromoCodeSubmit from "@/hooks/usePromoCodeSubmit";
import SelectRole from "@/components/form/selectOption/SelectRole";
import DrawerButton from "@/components/form/button/DrawerButton";
import LabelArea from "@/components/form/selectOption/LabelArea";
import Uploader from "@/components/image-uploader/Uploader";
import CheckBox from "@/components/form/others/CheckBox";
const PromoCodeDrawer = ({ id }) => {

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
    setCheckedState,
    checkedState
  } = usePromoCodeSubmit(id);
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
          title={id ? t("Update PromoCode") : t("Add PromoCode")}
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
                  <LabelArea label="Coupon code" status/>
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required
                      register={register}
                      label="Coupon code"
                      name="coupon_code"
                      type="text"
                      placeholder="Coupon code"
                    />
                    <Error errorName={errors.coupon_code} />
                  </div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Discount percentage" status/>
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required
                      register={register}
                      label="Discount percentage"
                      name="discount_percentage"
                      type="number"
                      placeholder="Discount percentage"
                    />
                    <Error errorName={errors.discount_percentage} />
                  </div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Max discount price" status/>
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required
                      register={register}
                      label="Max discount price"
                      name="max_discount_price"
                      type="number"
                      placeholder="Max discount price"
                    />
                    <Error errorName={errors.max_discount_price} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Use per user" status/>
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required
                      register={register}
                      label="Use per user"
                      name="use_per_user"
                      type="number"
                      placeholder="Use per user"
                    />
                    <Error errorName={errors.use_per_user} />
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Expiry date" status/>
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required
                      register={register}
                      label="Expiry date"
                      name="expiry_date"
                      type="date"
                      placeholder="Expiry date"
                    />
                    <Error errorName={errors.expiry_date} />
                  </div>
                </div>

              </div>
              <DrawerButton id={id} title="PromoCode" isSubmitting={isSubmitting} />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default PromoCodeDrawer;
