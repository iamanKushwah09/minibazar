import { Button, Modal, ModalBody, ModalFooter } from "@windmill/react-ui";
import React, { useContext } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

//internal import
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import { SidebarContext } from "@/context/SidebarContext";
import AdminServices from "@/services/AdminServices";
import CategoryServices from "@/services/CategoryServices";
import CouponServices from "@/services/CouponServices";
import CustomerServices from "@/services/CustomerServices";
import LanguageServices from "@/services/LanguageServices";
import ProductServices from "@/services/ProductServices";
import RoleServices from "@/services/RoleServices";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import AttributeServices from "@/services/AttributeServices";
import CurrencyServices from "@/services/CurrencyServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import ItemGroupServices from "@/services/ItemGroupServices";
import BrandServices from "@/services/BrandServices";
import UnitServices from "@/services/UnitServices";
import VendorGroupServices from "@/services/VendorGroupServices";
import BannerServices from "@/services/BannerServices";
import OfferServices from "@/services/OfferServices";
import PromoCodeServices from "@/services/PromoCodeServices";
import ShippingServices from "@/services/ShippingServices";
import ItemServices from "@/services/ItemServices";
import AttributeGroupServices from "@/services/AttributeGroupServices";
import AttributeValueServices from "@/services/AttributeValueServices";
import CatalogValueServices from "@/services/CatalogValueServices";
import OrderServices from "@/services/OrderServices";
import SalesmanServices from "@/services/SalesmanServices";
import SaleOrderServices from "@/services/SaleOrderServices";

const DeleteModal = ({ id, ids, setIsCheck, category, title, useParamId }) => {
  const { isModalOpen, closeModal, setIsUpdate } = useContext(SidebarContext);
  const { setServiceId } = useToggleDrawer();
  const location = useLocation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    // return notifyError("This feature is disabled for demo!");
    try {
      setIsSubmitting(true);
      if (location.pathname === "/role") {
        if (ids) {
          const res = await RoleServices.deleteManyRole({ ids });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await RoleServices.deleteRole(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }
      if (location.pathname === "/item-group") {
        if (ids) {
          const res = await ItemGroupServices.deleteManyRole({ ids });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await ItemGroupServices.deleteItemGroup(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }
      if (location.pathname === "/brand") {
        if (ids) {
          const res = await BrandServices.deleteManyRole({ ids });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await BrandServices.deleteBrand(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }
      if (location.pathname === "/category") {
        if (ids) {
          const res = await CategoryServices.deleteManyRole({ ids });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await CategoryServices.deleteCategory1(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }
      if (location.pathname === "/unit") {
        if (ids) {
          const res = await UnitServices.deleteManyRole({ ids });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await UnitServices.deleteUnit(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }
      if (location.pathname === "/products") {
        if (ids) {
          const res = await ProductServices.deleteManyProducts({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await ProductServices.deleteProduct(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }
      if (location.pathname === "/vendor-group") {
        if (ids) {
          const res = await VendorGroupServices.deleteManyProducts({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await VendorGroupServices.deleteVendorGroup(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }

      if (location.pathname === "/banner") {
        if (ids) {
          const res = await BannerServices.deleteManyCoupons({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await BannerServices.deleteBanner(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }

      if (location.pathname === "/sales-man") {
        const res = await SalesmanServices.deleteSalesman(id);
        setIsUpdate(true);
        notifySuccess(res.message);
        setServiceId();
        closeModal();
        setIsSubmitting(false);
      }
      
      if (location.pathname === "/sale-order") {
        const res = await SaleOrderServices.deleteSaleOrder(id);
        setIsUpdate(true);
        notifySuccess(res.message);
        setServiceId();
        closeModal();
        setIsSubmitting(false);
      }
      
      if (location.pathname === "/offer") {
        if (ids) {
          const res = await OfferServices.deleteManyCoupons({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await OfferServices.deleteOffer(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }
      if (location.pathname === "/orders") {
        if (ids) {
          const res = await OrderServices.deleteManyCoupons({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          console.log({id})
          const res = await OrderServices.deleteOrder(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }
      
      if (location.pathname === "/promo-code") {
        if (ids) {
          const res = await PromoCodeServices.deleteManyCoupons({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await PromoCodeServices.deletePromoCode(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }

      if (location.pathname === "/item") {
        if (ids) {
          const res = await ItemServices.deleteManyCoupons({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await ItemServices.deleteItem(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }
      if (location.pathname === "/attribute-group") {
        if (ids) {
          const res = await AttributeGroupServices.deleteManyCoupons({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await AttributeGroupServices.deleteAttributeGroup(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }
      if (location.pathname === "/attribute-value") {
        if (ids) {
          const res = await AttributeValueServices.deleteManyCoupons({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await AttributeValueServices.deleteAttributeValue(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }
      if (location.pathname === "/item") {
        if (ids) {
          const res = await ItemServices.deleteManyCoupons({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await ItemServices.deleteItem(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }
      if (location.pathname === "/shipping") {
        if (ids) {
          const res = await ShippingServices.deleteManyCoupons({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await ShippingServices.deleteShipping(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }

      if (location.pathname === "/coupons") {
        if (ids) {
          const res = await CouponServices.deleteManyCoupons({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await CouponServices.deleteCoupon(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }

      if (location.pathname === "/categories" || category) {
        if (ids) {
          //  console.log('delete modal categorices',ids)
          const res = await CategoryServices.deleteManyCategory({
            ids: ids,
          });
          //  console.log('delete many category res',res)
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          if (id === undefined || !id) {
            notifyError("Please select a category first!");
            setIsSubmitting(false);
            return closeModal();
          }
          // console.log('delete modal open',id)
          const res = await CategoryServices.deleteCategory(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          closeModal();
          setServiceId();
          setIsSubmitting(false);
        }
      } else if (
        location.pathname === `/categories/${useParamId}` ||
        category
      ) {
        // console.log('delete modal ')
        if (id === undefined || !id) {
          notifyError("Please select a category first!");
          setIsSubmitting(false);
          return closeModal();
        }

        const res = await CategoryServices.deleteCategory(id);
        setIsUpdate(true);
        notifySuccess(res.message);
        closeModal();
        setServiceId();
        setIsSubmitting(false);
      }

      if (location.pathname === "/vendors") {
        const res = await CustomerServices.deleteCustomer(id);
        setIsUpdate(true);
        notifySuccess(res.message);
        setServiceId();
        closeModal();
        setIsSubmitting(false);
      }

      if (location.pathname === "/attributes") {
        if (ids) {
          const res = await AttributeServices.deleteManyAttribute({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await AttributeServices.deleteAttribute(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }

      if (
        location.pathname === `/attributes/${location.pathname.split("/")[2]}`
      ) {
        if (ids) {
          const res = await AttributeServices.deleteManyChildAttribute({
            id: location.pathname.split("/")[2],
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          setIsCheck([]);
          closeModal();
          setIsSubmitting(false);
        } else {
          // console.log("att value delete", id, location.pathname.split("/")[2]);

          const res = await AttributeServices.deleteChildAttribute({
            id: id,
            ids: location.pathname.split("/")[2],
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }

      if (location.pathname === "/our-staff") {
        const res = await AdminServices.deleteStaff(id);
        setIsUpdate(true);
        notifySuccess(res.message);
        setServiceId();
        closeModal();
        setIsSubmitting(false);
      }

      if (location.pathname === "/languages") {
        if (ids) {
          const res = await LanguageServices.deleteManyLanguage({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await LanguageServices.deleteLanguage(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }

      if (location.pathname === "/currencies") {
        if (ids) {
          const res = await CurrencyServices.deleteManyCurrency({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await CurrencyServices.deleteCurrency(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }

      if (location.pathname === "/catalogs") {
        if (ids) {
          const res = await CatalogValueServices.deleteCatalogValue({
            ids: ids,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
          setIsCheck([]);
          closeModal();
          setIsSubmitting(false);
        } else {
          const res = await CatalogValueServices.deleteCatalogValue(id);
          setIsUpdate(true);
          notifySuccess(res.message);
          setServiceId();
          closeModal();
          setIsSubmitting(false);
        }
      }

    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setServiceId();
      setIsCheck([]);
      closeModal();
      setIsSubmitting(false);
    }
  };

  const { t } = useTranslation();

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalBody className="text-center custom-modal px-8 pt-6 pb-4">
          <span className="flex justify-center text-3xl mb-6 text-red-500">
            <FiTrash2 />
          </span>
          {/* <h2 className="text-xl font-medium mb-1">{t('DeleteModalH2')}</h2> */}
          <h2 className="text-xl font-medium mb-2">
            {t("DeleteModalH2")} <span className="text-red-500">{title}</span>?
          </h2>
          <p>{t("DeleteModalPtag")}</p>
        </ModalBody>

        <ModalFooter className="justify-center">
          <Button
            className="w-full sm:w-auto hover:bg-white hover:border-gray-50"
            layout="outline"
            onClick={closeModal}
          >
            {t("modalKeepBtn")}
          </Button>
          <div className="flex justify-end">
            {isSubmitting ? (
              <Button
                disabled={true}
                type="button"
                className="w-full h-12 sm:w-auto"
              >
                <img
                  src={spinnerLoadingImage}
                  alt="Loading"
                  width={20}
                  height={10}
                />{" "}
                <span className="font-serif ml-2 font-light">
                  {t("Processing")}
                </span>
              </Button>
            ) : (
              <Button onClick={handleDelete} className="w-full h-12 sm:w-auto">
                {t("modalDeletBtn")}
              </Button>
              // <button
              //   type="submit"
              //   className="text-sm mt-6 leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none text-white px-4 md:px-6 lg:px-8 py-4 md:py-3.5 lg:py-4 hover:text-white bg-blue-400 hover:bg-blue-500 h-10"
              // >
              //   Park Order
              // </button>
            )}
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default React.memo(DeleteModal);
