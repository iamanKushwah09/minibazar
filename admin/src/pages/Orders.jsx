import {
  Button,
  Card,
  CardBody,
  Input,
  Label,
  Pagination,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext, useState } from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import exportFromJSON from "export-from-json";
import { FiPlus } from "react-icons/fi";

//internal import
import { notifyError } from "@/utils/toast";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import OrderServices from "@/services/OrderServices";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import OrderTable from "@/components/order/OrderTable";
import TableLoading from "@/components/preloader/TableLoading";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import AnimatedContent from "@/components/common/AnimatedContent";
import OrderDrawer from "@/components/drawer/OrderDrawer";
import MainDrawer from "@/components/drawer/MainDrawer";

const Orders = () => {
  const {
    time,
    setTime,
    status,
    endDate,
    setStatus,
    setEndDate,
    startDate,
    currentPage,
    searchText,
    searchRef,
    method,
    setMethod,
    setStartDate,
    setSearchText,
    handleChangePage,
    handleSubmitForAll,
    resultsPerPage,
    toggleDrawer,
  } = useContext(SidebarContext);

  const { t } = useTranslation();

  const [loadingExport, setLoadingExport] = useState(false);

  //API CALLING GET ALL RECORDS
  const { data, loading, error } = useAsync(() => OrderServices.getAllOrder({}));
  const { currency, getNumber, getNumberTwo } = useUtilsFunction();
  const { dataTable, serviceData } = useFilter(data);

  const handleDownloadOrders = async () => {
    try {
      setLoadingExport(true);
      const res = await OrderServices.getAllOrder({
        page: 1,
        day: time,
        method: method,
        status: status,
        endDate: endDate,
        download: true,
        startDate: startDate,
        limit: data?.totalDoc,
        customerName: searchText,
      });

      // console.log("handleDownloadOrders", res);
      const exportData = res?.orders?.map((order) => {
        return {
          _id: order._id,
          invoice: order.invoice,
          subTotal: getNumberTwo(order.subTotal),
          shippingCost: getNumberTwo(order.shippingCost),
          discount: getNumberTwo(order?.discount),
          total: getNumberTwo(order.total),
          paymentMethod: order.paymentMethod,
          status: order.status,
          user_info: order?.user_info?.name,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };
      });
      // console.log("exportData", exportData);

      exportFromJSON({
        data: exportData,
        fileName: "orders",
        exportType: exportFromJSON.types.csv,
      });
      setLoadingExport(false);
    } catch (err) {
      setLoadingExport(false);
      // console.log("err on orders download", err);
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  // handle reset field
  const handleResetField = () => {
    setTime("");
    setMethod("");
    setStatus("");
    setEndDate("");
    setStartDate("");
    setSearchText("");
    searchRef.current.value = "";
  };
  // console.log("data in orders page", data);

  return (
    <>
      <PageTitle>{t("Customer Orders")}</PageTitle>
      <MainDrawer product={false}>
        <OrderDrawer />
      </MainDrawer>
      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form
              onSubmit={handleSubmitForAll}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
            >
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Input
                  // ref={userRef}
                  type="search"
                  name="search"
                  placeholder={t("Search Order")}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-5 mr-1"
                ></button>
              </div>

              <div className="w-full md:w-56 lg:w-56 xl:w-56">
                <div className="w-full mx-1">
                  <Button type="submit" className="h-12 w-full bg-blue-700">
                    Search
                  </Button>
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex items-center xl:gap-x-4 gap-x-1 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Button
                  onClick={toggleDrawer}
                  className="w-full rounded-md h-12"
                >
                  <span className="mr-3">
                    <FiPlus />
                  </span>
                  {t("Add Order")}
                </Button>
                <div className="w-full">
                  <Button
                    layout="outline"
                    onClick={handleResetField}
                    type="reset"
                    className="px-4 md:py-1 py-3 text-sm dark:bg-gray-700"
                  >
                    <span className="text-black dark:text-gray-200">Reset</span>
                  </Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </AnimatedContent>
      {data?.methodTotals?.length > 0 && (
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardBody>
            <div className="flex gap-1">
              {data?.methodTotals?.map((el, i) => (
                <div key={i + 1} className="dark:text-gray-300">
                  {el?.method && (
                    <>
                      <span className="font-medium"> {el.method}</span> :{" "}
                      <span className="font-semibold mr-2">
                        {currency}
                        {getNumber(el.total)}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {loading ? (
        <TableLoading row={12} col={7} width={160} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 dark:bg-gray-900">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>{t("Order no")}</TableCell>
                <TableCell>{t("Order date")}</TableCell>
                <TableCell>{t("Payment mode")}</TableCell>
                <TableCell>{t("Shipping charge")}</TableCell>
                <TableCell>{t("Total Amt.")}</TableCell>
                <TableCell>{t("Total Qty.")}</TableCell>
                <TableCell>{t("ActionTbl")}</TableCell>
                {/* <TableCell className="text-right">{t("InvoiceTbl")}</TableCell> */}
              </tr>
            </TableHeader>

            <OrderTable orders={dataTable} />
          </Table>

          <TableFooter>
            <Pagination
              totalResults={data?.length}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no orders right now." />
      )}
    </>
  );
};

export default Orders;
