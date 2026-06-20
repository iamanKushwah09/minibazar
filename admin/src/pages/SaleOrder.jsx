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
import { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus, FiFilter, FiX } from "react-icons/fi";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import MainDrawer from "@/components/drawer/MainDrawer";
import SaleOrderDrawer from "@/components/drawer/SaleOrderDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import AnimatedContent from "@/components/common/AnimatedContent";
import SaleOrderServices from "@/services/SaleOrderServices";
import SaleOrderTable from "@/components/saleorder/SaleorderTable";

const SaleOrder = () => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { toggleDrawer, lang } = useContext(SidebarContext);

  // Date range filter state
  const [dateFilters, setDateFilters] = useState({
    startDate: '',
    endDate: ''
  });
  const [filteredData, setFilteredData] = useState(null);
  const [isFiltering, setIsFiltering] = useState(false);

  const {
    data: dataTable,
    loading,
    error,
  } = useAsync(() => SaleOrderServices.getAllSaleOrder());

  const {
    saleOrderRef,
    setSaleOrderData,
    totalResults,
    resultsPerPage,
    saleOrderData,
    serviceData,
    handleChangePage,
    handleSubmitSaleOrder,
    setSearchSaleOrder,
  } = useFilter(dataTable);

  const { t } = useTranslation();

  // Date filter submission handler
  const handleDateFilter = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setIsFiltering(true);
      
      // Prepare filter query
      const queryParams = {};
      if (dateFilters.startDate) queryParams.startDate = dateFilters.startDate;
      if (dateFilters.endDate) queryParams.endDate = dateFilters.endDate;
      
      console.log('Applying date filters:', queryParams);
      
      // Call the filter API
      const response = await SaleOrderServices.getSaleOrdersByFilter(queryParams);
      
      if (response.success) {
        setFilteredData(response.data.orders);
        console.log('Date filtering successful:', response.data);
      } else {
        throw new Error(response.message || 'Failed to filter by date range');
      }
    } catch (error) {
      console.error('Date filtering error:', error);
      // Show error notification or handle error state
    } finally {
      setIsFiltering(false);
    }
  };

  // Clear date filters
  const clearDateFilters = () => {
    setDateFilters({
      startDate: '',
      endDate: ''
    });
    setFilteredData(null);
  };

  const handleResetField = () => {
    setSaleOrderData([]);
    saleOrderRef.current.value = "";
    setSearchSaleOrder("");
    clearDateFilters();
    setFilteredData(null);
  };

  return (
    <>
      <PageTitle>{t("SaleOrder")} </PageTitle>
      <MainDrawer product={true}>
        <SaleOrderDrawer />
      </MainDrawer>
      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitSaleOrder(e);
              }}
              className="space-y-4"
            >
              {/* Search Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <Input
                    ref={saleOrderRef}
                    type="search"
                    name="search"
                    placeholder="Search by Voucher, Customer, Email, Mobile, GST, Salesman..."
                    className="w-full"
                  />
                </div>
                <div className="md:col-span-1">
                  <Button
                    type="submit"
                    className="h-12 w-full bg-blue-700"
                  >
                    Search
                  </Button>
                </div>
                <div className="md:col-span-1">
                  <Button
                    onClick={toggleDrawer}
                    className="w-full rounded-md h-12"
                  >
                    <span className="mr-3">
                      <FiPlus />
                    </span>
                    {t("Add Sale")}
                  </Button>
                </div>
                <div className="md:col-span-1">
                  <Button
                    layout="outline"
                    onClick={handleResetField}
                    type="reset"
                    className="px-4 md:py-1 py-3 text-sm dark:bg-gray-700 w-full h-12"
                  >
                    <span className="text-black dark:text-gray-200">Reset</span>
                  </Button>
                </div>
              </div>

              {/* Date Filter Row */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center mb-3">
                  <FiFilter className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date Range Filter
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={dateFilters.startDate}
                      onChange={(e) => setDateFilters(prev => ({
                        ...prev,
                        startDate: e.target.value
                      }))}
                      className="w-full"
                    />
                  </div>
                  <div className="md:col-span-1 ">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={dateFilters.endDate}
                      onChange={(e) => setDateFilters(prev => ({
                        ...prev,
                        endDate: e.target.value
                      }))}
                      className="w-full"
                    />
                  </div>
                  <div className="md:col-span-1 mt-6">
                    <Button
                      onClick={handleDateFilter}
                      disabled={isFiltering || (!dateFilters.startDate && !dateFilters.endDate)}
                      className="h-12 w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <FiFilter className="w-4 h-4 mr-2" />
                      {isFiltering ? 'Filtering...' : 'Apply Filter'}
                    </Button>
                  </div>
                  <div className="md:col-span-1 mt-6">
                    <Button
                      onClick={clearDateFilters}
                      layout="outline"
                      className="h-12 w-full"
                      disabled={isFiltering}
                    >
                      <FiX className="w-4 h-4 mr-2" />
                      Clear Dates
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </AnimatedContent>
      {loading ? (
        <TableLoading row={12} col={7} width={163} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : (
        <>
          {/* Show active date filter status */}
          {/* {filteredData && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-800">
                  <strong>Date Filter Active:</strong>
                  {dateFilters.startDate && ` From ${dateFilters.startDate}`}
                  {dateFilters.startDate && dateFilters.endDate && ' - '}
                  {dateFilters.endDate && ` To ${dateFilters.endDate}`}
                  {filteredData && ` (${filteredData.length} results found)`}
                </div>
                <Button
                  onClick={clearDateFilters}
                  layout="outline"
                  size="sm"
                  className="text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  <FiX className="w-4 h-4 mr-1" />
                  Clear Dates
                </Button>
              </div>
            </div>
          )} */}

          {/* Table Container */}
          {(filteredData || saleOrderData)?.length !== 0 ? (
            <TableContainer className="mb-8 rounded-b-lg">
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell>{t("voucherNo")}</TableCell>
                    <TableCell>Group Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>{t("CreateDate")}</TableCell>
                    <TableCell>{t("SaleType")}</TableCell>
                    <TableCell>{t("Party")}</TableCell>
                    <TableCell>{t("Saleman")}</TableCell>
                    <TableCell>{t("ACTIVE")}</TableCell>
                    <TableCell className="text-right">{t("Action")}</TableCell>
                  </tr>
                </TableHeader>
                <SaleOrderTable
                  dataTable={filteredData || saleOrderData}
                  showFilters={false}
                />
              </Table>
              <TableFooter>
                <Pagination
                  totalResults={filteredData ? filteredData.length : totalResults}
                  resultsPerPage={resultsPerPage}
                  onChange={handleChangePage}
                  label="Table navigation"
                />
              </TableFooter>
            </TableContainer>
          ) : (
            <NotFound
              title={
                filteredData
                  ? 'No sale orders found for the selected date range'
                  : 'Sorry, There are no sale orders right now.'
              }
            />
          )}
        </>
      )}
    </>
  );
};

export default SaleOrder;
