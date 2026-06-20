import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "@/context/SidebarContext";

const useToggleDrawer = () => {
  const [serviceId, setServiceId] = useState("");
  const [allId, setAllId] = useState([]);
  const [title, setTitle] = useState("");
  const { toggleDrawer, isDrawerOpen, toggleModal, toggleBulkDrawer } =
    useContext(SidebarContext);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isImgUpdate, setIsImgUpdate] = useState(false);

  const handleView = (id) => {
    setIsViewOnly(true);
    handleUpdate(id);
  };
  const handleEdit = (id) => {
    setIsViewOnly(false);
    handleUpdate(id);
  };

  const handleUpdate = (id) => {
    setServiceId(id);
    toggleDrawer();
  };

  const handleItemImgUpdate = (id) => {
    setServiceId(id);
    setIsImgUpdate(true);
    toggleDrawer();
  };

  const handleUpdateMany = (id) => {
    setAllId(id);
    toggleBulkDrawer();
  };

  const handleModalOpen = (id, title) => {
    setServiceId(id);
    toggleModal();
    setTitle(title);
  };

  const handleCatalogModalOpen = () => {
    toggleModal();
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setServiceId();
      setIsImgUpdate(false);
      setIsViewOnly(false);
    }
  }, [isDrawerOpen]);

  const handleDeleteMany = async (id, products) => {
    setAllId(id);
    toggleModal();
    setTitle("Selected Products");
  };

  return {
    title,
    allId,
    serviceId,
    isViewOnly,
    handleView,
    handleEdit,
    handleUpdate,
    setServiceId,
    handleModalOpen,
    handleDeleteMany,
    handleUpdateMany,
    handleItemImgUpdate,
    handleCatalogModalOpen,
    isImgUpdate,
  };
};

export default useToggleDrawer;
