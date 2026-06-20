import React, { useState } from "react";
import { Button } from "@windmill/react-ui";
import { FiTrash2 } from "react-icons/fi";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import ItemServices from "@/services/ItemServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import catalogValueServices from "@/services/CatalogValueServices";
import VendorGroupServices from "@/services/VendorGroupServices";
import CustomerServices from "@/services/CustomerServices";
import SalesmanServices from "@/services/SalesmanServices";
import ItemGroupServices from "@/services/ItemGroupServices";
import BrandServices from "@/services/BrandServices";
import CategoryServices from "@/services/CategoryServices";
import UnitServices from "@/services/UnitServices";
import AttributeGroupServices from "@/services/AttributeGroupServices";
import AttributeValueServices from "@/services/AttributeValueServices";

const DeleteSettings = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // track which item to delete

  const handleDelete = async () => {
    try {
      if (selectedItem === "catalog") {
        await catalogValueServices.deleteAllCatalogValues();
        notifySuccess("All catalogs deleted successfully");

      } else if (selectedItem === "vendorGroup") {
        await VendorGroupServices.deleteAllVendorGroup();
        notifySuccess("All vendorGroups deleted successfully");

      } else if (selectedItem === "customer") {
        await CustomerServices.deleteAllCustomer();
        notifySuccess("All customers deleted successfully");

      } else if (selectedItem === "salesman") {
        await SalesmanServices.deleteAllSalesman();
        notifySuccess("All salesmans deleted successfully");

      } else if (selectedItem === "item") {
        await ItemServices.deleteAllItems();
        notifySuccess("All items deleted successfully");

      } else if (selectedItem === "itemGroup") {
        await ItemGroupServices.deleteAllItemGroup();
        notifySuccess("All itemGroups deleted successfully");

      } else if (selectedItem === "brand") {
        await BrandServices.deleteAllBrand();
        notifySuccess("All brands deleted successfully");

      } else if (selectedItem === "category") {
        await CategoryServices.deleteAllCategory();
        notifySuccess("All categoriess deleted successfully");

      } else if (selectedItem === "unit") {
        await UnitServices.deleteAllUnit()
        notifySuccess("All units deleted successfully");

      } else if (selectedItem === "attributeGroup") {
        await AttributeGroupServices.deleteAttributeGroup();
        notifySuccess("All attributeGroups deleted successfully");

      } else if (selectedItem === "attributeValue") {
        await AttributeValueServices.deleteAllAttributeValue();
        notifySuccess("All attributeValues deleted successfully");

      } else {
        notifyError("Unknown item");
      }
    } catch (err) {
      console.error("Error deleting:", err);
      notifyError("Something went wrong");
    } finally {
      setConfirmOpen(false);
    }
  };
  const openConfirm = (item) => {
    setSelectedItem(item);
    setConfirmOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <Button
          layout="outline"
          onClick={() => openConfirm("catalog")}
          type="button"
          className=" col-2 mb-4 px-4 md:py-1 py-3 text-sm border  hover:bg-red-50 dark:hover:bg-red-900 dark:border-red-400"
        >
          <span className="mr-3">
            <FiTrash2 style={{ width: "20px", height: "20px" }} />
          </span>
          All Catalogs
        </Button>
        <Button
          layout="outline"
          onClick={() => openConfirm("vendorGroup")}
          type="button"
          className="mb-4 px-4 md:py-1 py-3 text-sm border  hover:bg-red-50 dark:hover:bg-red-900 dark:border-red-400"
        >
          <span className="mr-3">
            <FiTrash2 style={{ width: "20px", height: "20px" }} />
          </span>
          All VendorGroups
        </Button>
        <Button
          layout="outline"
          onClick={() => openConfirm("customer")}
          type="button"
          className="mb-4 px-4 md:py-1 py-3 text-sm border  hover:bg-red-50 dark:hover:bg-red-900 dark:border-red-400"
        >
          <span className="mr-3">
            <FiTrash2 style={{ width: "20px", height: "20px" }} />
          </span>
          All Vendors
        </Button>
        <Button
          layout="outline"
          onClick={() => openConfirm("salesman")}
          type="button"
          className="mb-4 px-4 md:py-1 py-3 text-sm border  hover:bg-red-50 dark:hover:bg-red-900 dark:border-red-400"
        >
          <span className="mr-3">
            <FiTrash2 style={{ width: "20px", height: "20px" }} />
          </span>
          All Sales Men
        </Button>
        <Button
          layout="outline"
          onClick={() => openConfirm("item")}
          type="button"
          className="mb-4 px-4 md:py-1 py-3 text-sm border  hover:bg-red-50 dark:hover:bg-red-900 dark:border-red-400"
        >
          <span className="mr-3">
            <FiTrash2 style={{ width: "20px", height: "20px" }} />
          </span>
          All Items
        </Button>
        <Button
          layout="outline"
          onClick={() => openConfirm("itemGroup")}
          type="button"
          className="mb-4 px-4 md:py-1 py-3 text-sm border  hover:bg-red-50 dark:hover:bg-red-900 dark:border-red-400"
        >
          <span className="mr-3">
            <FiTrash2 style={{ width: "20px", height: "20px" }} />
          </span>
          All ItemGroup
        </Button>
        <Button
          layout="outline"
          onClick={() => openConfirm("brand")}
          type="button"
          className="mb-4 px-4 md:py-1 py-3 text-sm border  hover:bg-red-50 dark:hover:bg-red-900 dark:border-red-400"
        >
          <span className="mr-3">
            <FiTrash2 style={{ width: "20px", height: "20px" }} />
          </span>
          All Brands
        </Button>
        <Button
          layout="outline"
          onClick={() => openConfirm("category")}
          type="button"
          className="mb-4 px-4 md:py-1 py-3 text-sm border  hover:bg-red-50 dark:hover:bg-red-900 dark:border-red-400"
        >
          <span className="mr-3">
            <FiTrash2 style={{ width: "20px", height: "20px" }} />
          </span>
          All Categories
        </Button>
        <Button
          layout="outline"
          onClick={() => openConfirm("unit")}
          type="button"
          className="mb-4 px-4 md:py-1 py-3 text-sm border  hover:bg-red-50 dark:hover:bg-red-900 dark:border-red-400"
        >
          <span className="mr-3">
            <FiTrash2 style={{ width: "20px", height: "20px" }} />
          </span>
          All Units
        </Button>
        {/* <Button
          layout="outline"
          onClick={() => openConfirm("attributeGroup")}
          type="button"
          className="mb-4 px-4 md:py-1 py-3 text-sm border  hover:bg-red-50 dark:hover:bg-red-900 dark:border-red-400"
        >
          <span className="mr-3">
            <FiTrash2 style={{ width: "20px", height: "20px" }} />
          </span>
          All Attribute Group
        </Button> */}
        <Button
          layout="outline"
          onClick={() => openConfirm("attributeValue")}
          type="button"
          className="px-4 md:py-1 py-3 text-sm border  hover:bg-red-50 dark:hover:bg-red-900 dark:border-red-400"
        >
          <span className="mr-3">
            <FiTrash2 style={{ width: "20px", height: "20px" }} />
          </span>
          All Attribute value
        </Button>
      </div>
      <DeleteConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default DeleteSettings;