import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Input, Textarea } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
// Internal imports
import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import useRoleSubmit from "@/hooks/useRoleSubmit";
import SelectRole from "@/components/form/selectOption/SelectRole";
import DrawerButton from "@/components/form/button/DrawerButton";
import LabelArea from "@/components/form/selectOption/LabelArea";
import Uploader from "@/components/image-uploader/Uploader";
import CheckBox from "@/components/form/others/CheckBox";
const RoleDrawer = ({ id }) => {

  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    // imageUrl,
    // setImageUrl,
    isSubmitting,
    // selectedDate,
    // setSelectedDate,
    handleSelectLanguage,
    setCheckedState,
    checkedState
  } = useRoleSubmit(id);
  const { t } = useTranslation();

  const userPermissions = [
    { path: "/dashboard", permission: "view_dashboard" },
    { path: "/pos", permission: "view_pos" },
    { path: "/dispatch", permission: "view_dispatchs" },
    { path: "/item-group", permission: "view_item_groups" },
    { path: "/attribute-group", permission: "view_attribute_groups" },
    { path: "/attribute-value", permission: "view_attribute_values" },
    { path: "/item", permission: "view_items" },
    { path: "/unit", permission: "view_units" },
    { path: "/brand", permission: "view_brands" },
    { path: "/offer", permission: "view_offers" },
    { path: "/shipping", permission: "view_shippings" },
    { path: "/banner", permission: "view_banners" },
    { path: "/promo-code", permission: "view_promo_codes" },
    { path: "/category", permission: "view_categories" },
    { path: "/vendor-group", permission: "view_vendor_groups" },
    { path: "/role", permission: "view_roles" },
    { path: "/products", permission: "view_products" },
    { path: "/attributes", permission: "view_attributes" },
    // { path: "/attributes/:id", permission: "view_attributes" },
    { path: "/product/:id", permission: "view_products" },
    // { path: "/categories", permission: "view_categories" },
    { path: "/languages", permission: "view_languages" },
    { path: "/currencies", permission: "view_currencies" },
    // { path: "/categories/:id", permission: "view_categories" },
    { path: "/vendors", permission: "view_customers" },
    // { path: "/customer-order/:id", permission: "view_orders" },
    { path: "/our-staff", permission: "view_staff" },
    { path: "/orders", permission: "view_orders" },
    // { path: "/order/:id", permission: "view_orders" },
    { path: "/coupons", permission: "view_coupons" },
    { path: "/settings", permission: "view_settings" },
    // { path: "/store/customization", permission: "view_store" },
    { path: "/store/store-settings", permission: "view_store" },
    { path: "/404", permission: "view_404" },
    { path: "/coming-soon", permission: "view_comming_soon" },
    { path: "/edit-profile", permission: "edit_profile" },
    { path: "/notifications", permission: "view_notifications" },
    { path: "/catalogs", permission: "view_catalog" },
    { path: "/sales-man", permission: "view_sales_man" },
    { path: "/stock", permission: "view_stock" },
    { path: "/sale-order", permission: "view_sale_order" },
    { path: "/party-ledger", permission: "view_report" },
   

    // { path: "/products", permission: "view_products" },
    // { path: "/attributes", permission: "view_attributes" },
    // // { path: "/attributes/:id", permission: "view_attributes" },
    // // { path: "/product/:id", permission: "view_products" },
    // { path: "/categories", permission: "view_categories" },
    // { path: "/languages", permission: "view_languages" },
    // { path: "/currencies", permission: "view_currencies" },
    // // { path: "/categories/:id", permission: "view_categories" },
    // { path: "/customers", permission: "view_customers" },
    // { path: "/customer-order/:id", permission: "view_orders" },
    // { path: "/our-role", permission: "view_role" },
    // // { path: "/role", permission: "view_roles" },
    // // { path: "/orders", permission: "view_orders" },
    // // { path: "/order/:id", permission: "view_orders" },
    // { path: "/coupons", permission: "view_coupons" },
    // { path: "/settings", permission: "view_settings" },
    // { path: "/store/customization", permission: "view_store" },
    // // { path: "/store/store-settings", permission: "view_store" },
    // { path: "/404", permission: "view_404" },
    // { path: "/coming-soon", permission: "view_comming_soon" },
    // { path: "/edit-profile", permission: "edit_profile" },
    // { path: "/notifications", permission: "view_notifications" }
  ];

  const transformedPermissions = userPermissions.map(item => ({
    path: item.path.replace(/^\//, ''), // Remove leading slash
    permission: item.permission.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()), // Format permission
    value: item
  }));
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
          title={id ? t("Update Role") : t("Add Role")}
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
                      placeholder="Role name"
                    />
                    <Error errorName={errors.name} />
                  </div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Description" />
                  <div className="col-span-8 sm:col-span-4">
                    <Textarea
                      className="border text-sm  block w-full bg-gray-100 border-gray-200"
                      {...register("description", {
                        required: false,
                      })}
                      name="description"
                      placeholder="Description"
                      rows="4"
                      spellCheck="false"
                    />
                    <Error errorName={errors.description} />
                  </div>
                </div>

                <table className="min-w-full mb-12">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">S.No.</th>
                      <th className="px-4 py-2">{t("Permission")}</th>
                      <th className="px-4 py-2">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transformedPermissions.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2 text-center">{index + 1}</td>
                        <td className="px-4 py-2 text-center">
                          <LabelArea label={item.permission} />
                        </td>
                        <td className="px-4 py-2 text-center">
                          <CheckBox
                            type="checkbox"
                            id={`checkbox-${index}`} // Unique ID
                            name={item.path} // Use the path as the name
                            value={JSON.stringify(item.value)} // Store the object as a string
                            handleClick={handleClick}
                            isChecked={checkedState[item.path] || false} // Default to false if not found
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <DrawerButton id={id} title="Role" isSubmitting={isSubmitting} />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default RoleDrawer;
