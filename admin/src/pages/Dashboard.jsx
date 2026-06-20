import {
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  WindmillContext,
} from "@windmill/react-ui";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiRefreshCw, FiShoppingCart, FiTruck } from "react-icons/fi";
import { ImCreditCard, ImStack } from "react-icons/im";

//internal import
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import LineChart from "@/components/chart/LineChart/LineChart";
import PieChart from "@/components/chart/Pie/PieChart";
import CardItem from "@/components/dashboard/CardItem";
import CardItemTwo from "@/components/dashboard/CardItemTwo";
import ChartCard from "@/components/chart/ChartCard";
import OrderTable from "@/components/order/OrderTable";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import OrderServices from "@/services/OrderServices";
import AnimatedContent from "@/components/common/AnimatedContent";

const Dashboard = () => {
  const { t } = useTranslation();
  const { mode } = useContext(WindmillContext);

  dayjs.extend(isBetween);
  dayjs.extend(isToday);
  dayjs.extend(isYesterday);

  const { currentPage, handleChangePage } = useContext(SidebarContext);

  // react hook
  const [todayOrderAmount, setTodayOrderAmount] = useState(0);
  const [yesterdayOrderAmount, setYesterdayOrderAmount] = useState(0);
  const [salesReport, setSalesReport] = useState([]);
  const [todayCashPayment, setTodayCashPayment] = useState(0);
  const [todayCardPayment, setTodayCardPayment] = useState(0);
  const [todayCreditPayment, setTodayCreditPayment] = useState(0);
  const [yesterdayCashPayment, setYesterdayCashPayment] = useState(0);
  const [yesterdayCardPayment, setYesterdayCardPayment] = useState(0);
  const [yesterdayCreditPayment, setYesterdayCreditPayment] = useState(0);

  const {
    data: saleOrderDashboardData,
    loading: loadingSaleOrderDashboard,
    error,
  } = useAsync(OrderServices.getSaleOrderDashboardData);

  // console.log("saleOrderDashboardData", saleOrderDashboardData);

  const { dataTable, serviceData } = useFilter(saleOrderDashboardData?.recentOrders);

  useEffect(() => {
    if (saleOrderDashboardData) {
      // Set sales data
      setTodayOrderAmount(saleOrderDashboardData.sales?.today || 0);
      setYesterdayOrderAmount(saleOrderDashboardData.sales?.yesterday || 0);

      // Note: Payment method breakdowns are not available in the new API, so they remain 0
      // Weekly sales chart data is not directly available, so salesReport remains empty
      // Best selling products are available in saleOrderDashboardData.bestSellingProducts
    }
  }, [saleOrderDashboardData]);

  return (
    <>
      <PageTitle>{t("DashboardOverview")}</PageTitle>

      <AnimatedContent>
        <div className="grid gap-2 mb-8 xl:grid-cols-5 md:grid-cols-2">
          <CardItemTwo
            mode={mode}
            title="Today Order"
            title2="TodayOrder"
            Icon={ImStack}
            cash={todayCashPayment || 0}
            card={todayCardPayment || 0}
            credit={todayCreditPayment || 0}
            price={todayOrderAmount || 0}
            className="text-white dark:text-blue-100 bg-teal-600"
            loading={loadingSaleOrderDashboard}
          />

          <CardItemTwo
            mode={mode}
            title="Yesterday Order"
            title2="YesterdayOrder"
            Icon={ImStack}
            cash={yesterdayCashPayment || 0}
            card={yesterdayCardPayment || 0}
            credit={yesterdayCreditPayment || 0}
            price={yesterdayOrderAmount || 0}
            className="text-white dark:text-orange-100 bg-orange-400"
            loading={loadingSaleOrderDashboard}
          />

          <CardItemTwo
            mode={mode}
            title2="ThisMonth"
            Icon={FiShoppingCart}
            price={saleOrderDashboardData?.sales?.thisMonth || 0}
            className="text-white dark:text-blue-100 bg-blue-500"
            loading={loadingSaleOrderDashboard}
          />

          <CardItemTwo
            mode={mode}
            title2="LastMonth"
            Icon={ImCreditCard}
            loading={loadingSaleOrderDashboard}
            price={saleOrderDashboardData?.sales?.lastMonth || 0}
            className="text-white dark:text-teal-100 bg-cyan-600"
          />

          <CardItemTwo
            mode={mode}
            title2="AllTimeSales"
            Icon={ImCreditCard}
            price={saleOrderDashboardData?.sales?.allTime || 0}
            className="text-white dark:text-blue-100 bg-blue-600"
            loading={loadingSaleOrderDashboard}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CardItem
            title="Total Order"
            Icon={FiShoppingCart}
            loading={loadingSaleOrderDashboard}
            quantity={saleOrderDashboardData?.totalOrders || 0}
            className="text-orange-600 dark:text-orange-100 bg-orange-100 dark:bg-orange-500"
          />
          <CardItem
            title={t("OrderPending")}
            Icon={FiRefreshCw}
            loading={loadingSaleOrderDashboard}
            quantity={saleOrderDashboardData?.ordersPending || 0}
            amount={0} // Amount not provided in new API
            className="text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500"
          />
          <CardItem
            title={t("OrderProcessing")}
            Icon={FiTruck}
            loading={loadingSaleOrderDashboard}
            quantity={saleOrderDashboardData?.ordersProcessing || 0}
            className="text-teal-600 dark:text-teal-100 bg-teal-100 dark:bg-teal-500"
          />
          <CardItem
            title={t("OrderDelivered")}
            Icon={FiCheck}
            loading={loadingSaleOrderDashboard}
            quantity={saleOrderDashboardData?.ordersDelivered || 0}
            className="text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 my-8">
          <ChartCard
            mode={mode}
            loading={loadingSaleOrderDashboard}
            title={t("WeeklySales")}
          >
            <LineChart salesReport={[]} /> {/* Weekly sales data not available in new API */}
          </ChartCard>

          <ChartCard
            mode={mode}
            loading={loadingSaleOrderDashboard}
            title={t("BestSellingProducts")}
          >
            <PieChart data={saleOrderDashboardData?.bestSellingProducts || []} />
          </ChartCard>
        </div>
      </AnimatedContent>

      <PageTitle>{t("RecentOrder")}</PageTitle>

      {/* <Loading loading={loading} /> */}

      {loadingSaleOrderDashboard ? (
        <TableLoading row={5} col={4} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>{t("InvoiceNo")}</TableCell>
                <TableCell>{t("TimeTbl")}</TableCell>
                <TableCell>{t("CustomerName")} </TableCell>
                <TableCell> {t("MethodTbl")} </TableCell>
                <TableCell> {t("AmountTbl")} </TableCell>
                <TableCell>{t("OderStatusTbl")}</TableCell>
                <TableCell>{t("ActionTbl")}</TableCell>
                <TableCell className="text-right">{t("InvoiceTbl")}</TableCell>
              </tr>
            </TableHeader>

            <OrderTable orders={dataTable} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={saleOrderDashboardData?.recentOrders?.length || 0}
              resultsPerPage={8}
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

export default Dashboard;
