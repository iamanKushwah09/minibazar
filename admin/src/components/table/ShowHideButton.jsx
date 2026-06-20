import React, { useContext } from "react";
import Switch from "react-switch";
import { useLocation } from "react-router-dom";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import AttributeServices from "@/services/AttributeServices";
import CategoryServices from "@/services/CategoryServices";
import CouponServices from "@/services/CouponServices";
import CurrencyServices from "@/services/CurrencyServices";
import LanguageServices from "@/services/LanguageServices";
import ProductServices from "@/services/ProductServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import VendorGroupServices from "@/services/VendorGroupServices";
import CustomerServices from "@/services/CustomerServices";
import ItemGroupServices from "@/services/ItemGroupServices";
import ItemServices from "@/services/ItemServices";
import BrandServices from "@/services/BrandServices";
import UnitServices from "@/services/UnitServices";
import AttributeGroupServices from "@/services/AttributeGroupServices";
import AttributeValueServices from "@/services/AttributeValueServices";
import BannerServices from "@/services/BannerServices";
import OfferServices from "@/services/OfferServices";
import PromoCodeServices from "@/services/PromoCodeServices";
import ShippingServices from "@/services/ShippingServices";
import CatalogValueServices from "@/services/CatalogValueServices";

const ShowHideButton = ({ id, status, category, currencyStatusName, disabled }) => {
  const location = useLocation();
  const { setIsUpdate } = useContext(SidebarContext);

  const handleChangeStatus = async (id) => {
    // return notifyError("This option disabled for this option!");
    try {
      let newStatus;
      if (status) {
        newStatus = "hide";
      } else {
        newStatus = "show";
      }

      if (location.pathname === "/categories" || category) {
        const res = await CategoryServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }

      if (location.pathname === "/products") {
        const res = await ProductServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }

      if (location.pathname === "/languages") {
        const res = await LanguageServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      if (location.pathname === "/currencies") {
        if (currencyStatusName === "status") {
          const res = await CurrencyServices.updateEnabledStatus(id, {
            status: newStatus,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
        } else {
          const res = await CurrencyServices.updateLiveExchangeRateStatus(id, {
            live_exchange_rates: newStatus,
          });
          setIsUpdate(true);
          notifySuccess(res.message);
        }
      }

      if (location.pathname === "/attributes") {
        const res = await AttributeServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }

      if (
        location.pathname === `/attributes/${location.pathname.split("/")[2]}`
      ) {
        const res = await AttributeServices.updateChildStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }

      if (location.pathname === "/coupons") {
        // console.log('coupns',id)
        const res = await CouponServices.updateStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }

      if (location.pathname === "/our-staff") {
        const res = await CouponServices.updateStaffStatus(id, {
          status: newStatus,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }

      if (location.pathname === "/vendor-group") {
        const res = await VendorGroupServices.updateVendorGroup(id, {
          is_active: !status,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      if (location.pathname === "/vendors") {
        const res = await CustomerServices.updateCustomer(id, {
          is_active: !status,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      if (location.pathname === "/item-group") {
        const res = await ItemGroupServices.updateItemGroup(id, {
          is_active: !status,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      if (location.pathname === "/item") {
        const res = await ItemServices.updateItem(id, {
          is_active: !status,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      if (location.pathname === "/brand") {
        const res = await BrandServices.updateBrand(id, {
          is_active: !status,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      if (location.pathname === "/category") {
        const res = await CategoryServices.updateCategory(id, {
          is_active: !status,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      if (location.pathname === "/unit") {
        const res = await UnitServices.updateUnit(id, {
          is_active: !status,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      if (location.pathname === "/attribute-group") {
        const res = await AttributeGroupServices.updateAttributeGroup(id, {
          is_active: !status,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      if (location.pathname === "/attribute-value") {
        const res = await AttributeValueServices.updateAttributeValue(id, {
          is_active: !status,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      if (location.pathname === "/banner") {
        const res = await BannerServices.updateBanner(id, {
          is_active: !status,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      if (location.pathname === "/offer") {
        const res = await OfferServices.updateOffer(id, {
          is_active: !status,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      if (location.pathname === "/catalogs") {
        const res = await CatalogValueServices.updateCatalogValue(id, {
          is_active: !status,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      
      if (location.pathname === "/promo-code") {
        const res = await PromoCodeServices.updatePromoCode(id, {
          is_active: !status,
        });
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
    }
  };

  return (
    <Switch
      onChange={() => handleChangeStatus(id)}
      // checked={status === "show" ? true : false}
      checked={status}
      disabled={disabled}
      className="react-switch md:ml-0"
      uncheckedIcon={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: 120,
            fontSize: 14,
            color: "white",
            paddingRight: 22,
            paddingTop: 1,
          }}
        ></div>
      }
      width={30}
      height={15}
      handleDiameter={13}
      offColor="#E53E3E"
      onColor={"#2F855A"}
      checkedIcon={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 73,
            height: "100%",
            fontSize: 14,
            color: "white",
            paddingLeft: 20,
            paddingTop: 1,
          }}
        ></div>
      }
    />
  );
};

export default ShowHideButton;
