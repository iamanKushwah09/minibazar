import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import MainDrawer from "@/components/drawer/MainDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import AnimatedContent from "@/components/common/AnimatedContent";
import CatalogValueServices from "@/services/CatalogValueServices";
import CatalogDrawer from "@/components/drawer/CatalogDrawer";
import ItemCatalogTable from "@/components/item/itemCatalogTable";

const CataLog = () => {
  return (
    <>
      <CatalogDrawer isShow={true} />
    </>
  );
};

export default CataLog;
