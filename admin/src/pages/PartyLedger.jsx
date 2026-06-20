import React, { useContext, useState, useCallback, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Button,
  Card,
  CardBody,
  Pagination,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import useAsync from "@/hooks/useAsync";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useProductFilter from "@/hooks/useProductFilter";
import { SidebarContext } from "@/context/SidebarContext";
import NotFound from "@/components/table/NotFound";
import ProductServices from "@/services/ProductServices";
import PageTitle from "@/components/Typography/PageTitle";
import ProductTable from "@/components/product/ProductTable";
import CheckBox from "@/components/form/others/CheckBox";
import TableLoading from "@/components/preloader/TableLoading";
import AnimatedContent from "@/components/common/AnimatedContent";
import SearchableDropdown from "./SearchableDropdown";
import DateRangeSelectorWithDateRange from "./DateRangeSelectorWithDateRange";
import CustomerServices from "@/services/CustomerServices";
import PartyLedgerServices from "@/services/PartyLedgerServices";
import PartyLedgerTable from "@/components/party-ledger/PartyLedgerTable";
import { notifyError, notifySuccess } from "@/utils/toast";
import { IoCloudDownloadOutline } from "react-icons/io5";

// Date range selection format
const initialDateRange = [
  {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  },
];

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const monthShort = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day}-${monthShort}-${year}`;
};

const PartyLedger = () => {
  const { t } = useTranslation();
  const { lang } = useContext(SidebarContext);

  const [vendorMasterList, setVendorMasterList] = useState([]);
  const [isSearchingVendors, setIsSearchingVendors] = useState(false);
  const [vendorPage, setVendorPage] = useState(1);
  const [hasMoreVendors, setHasMoreVendors] = useState(false);
  const [loadingMoreVendors, setLoadingMoreVendors] = useState(false);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [vendorMaster, setVendorMaster] = useState(null);
  const [partyLedgerData, setPartyLedgerData] = useState([]);
  const [isLoadingPartyLedger, setIsLoadingPartyLedger] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Pagination State for Ledger
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 50;

  // Reset pagination and PDF prep when data changes
  useEffect(() => {
    setCurrentPage(1);
    setIsDownloadingPDF(false);
    setDownloadProgress(0);
  }, [partyLedgerData]);



  // Client-side pagination logic
  const paginatedLedger = useMemo(() => {
    if (!partyLedgerData?.Ledger) return [];

    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return partyLedgerData.Ledger.slice(startIndex, endIndex);
  }, [partyLedgerData, currentPage]);

  const totalResults = partyLedgerData?.Ledger?.length || 0;

  const onPageChange = (p) => {
    setCurrentPage(p);
  };

  const { data: initialVendorList, loading: isLoadingVendors } = useAsync(async () => {
    const res = await CustomerServices.activeCustomer();
    setVendorMasterList(res.data || []);
    setHasMoreVendors(res.pagination?.hasNext || false);
    setVendorPage(1);
    return res.data;
  });

  const handleSearchVendors = useCallback(async (query) => {
    setIsSearchingVendors(true);
    try {
      const res = await CustomerServices.activeCustomer(query, { params: { page: 1, limit: 100 } });
      setVendorMasterList(res.data || []);
      setHasMoreVendors(res.pagination?.hasNext || false);
      setVendorPage(1);
    } catch (error) {
      console.error("Error searching vendors:", error);
    } finally {
      setIsSearchingVendors(false);
    }
  }, []);

  const handleLoadMoreVendors = useCallback(async (query) => {
    if (loadingMoreVendors || !hasMoreVendors) return;
    setLoadingMoreVendors(true);
    try {
      const nextPage = vendorPage + 1;
      const res = await CustomerServices.activeCustomer(query, { params: { page: nextPage, limit: 100 } });
      setVendorMasterList(prev => [...prev, ...(res.data || [])]);
      setHasMoreVendors(res.pagination?.hasNext || false);
      setVendorPage(nextPage);
    } catch (error) {
      console.error("Error loading more vendors:", error);
    } finally {
      setLoadingMoreVendors(false);
    }
  }, [vendorPage, hasMoreVendors, loadingMoreVendors]);

  const vendorOptions = useMemo(() => {
    return vendorMasterList?.map((item) => ({
      value: item.code,
      label: item.name,
      code: item.code,
      print_name: item.print_name
    })) || [];
  }, [vendorMasterList]);

  const handleDateChange = useCallback((range) => {
    setDateRange(range);
  }, []);

  const handleDownloadPDF = async () => {
    if (!vendorMaster || !partyLedgerData?.Ledger) return;
    setIsDownloadingPDF(true);
    setDownloadProgress(0);
    try {
      const [{ startDate, endDate }] = Array.isArray(dateRange) ? dateRange : [dateRange];
      const blob = await PartyLedgerServices.downloadPartyLedgerPDF({
        "startDate": formatDate(startDate),
        "endDate": formatDate(endDate),
        "code": vendorMaster?.value,
        "vendorName": vendorMaster?.label
      }, {
        onDownloadProgress: (progressEvent) => {
          const total = progressEvent.total;
          if (total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
            setDownloadProgress(percentCompleted);
          } else {
            // If total is unknown (streaming), show a simulated progress or just increment
            setDownloadProgress(prev => prev < 90 ? prev + 1 : prev);
          }
        }
      });

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PartyLedger_${vendorMaster?.label}_${formatDate(startDate)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      notifySuccess("PDF Downloaded Successfully");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      notifyError("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloadingPDF(false);
      setDownloadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendorMaster) return;
    setIsLoadingPartyLedger(true);
    try {
      const [{ startDate, endDate }] = Array.isArray(dateRange) ? dateRange : [dateRange];
      const getPartyLedger = await PartyLedgerServices.getPartyLedger({ "startDate": formatDate(startDate), "endDate": formatDate(endDate), "code": vendorMaster?.value });
      setPartyLedgerData(getPartyLedger.data.Data);
    } catch (error) {
      console.error("Error fetching party ledger:", error);
    } finally {
      setIsLoadingPartyLedger(false);
    }
  }

  return (
    <>
      <PageTitle>{t("partyLedger")}</PageTitle>
      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-visible bg-white dark:bg-gray-800 rounded-t-lg mb-4">
          <CardBody className="overflow-visible">
            <form
              className="py-3 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10"
              onSubmit={handleSubmit}
            >
              {/* Left Side: Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="w-full md:w-auto relative z-50">
                  <DateRangeSelectorWithDateRange
                    onChange={handleDateChange}
                  />
                </div>
                <div className="w-full md:w-64 relative z-50">
                  <SearchableDropdown
                    options={vendorOptions}
                    onChange={(value) => setVendorMaster(value)}
                    placeholder={"Search Party Ledger"}
                    onSearch={handleSearchVendors}
                    onLoadMore={handleLoadMoreVendors}
                    hasMore={hasMoreVendors}
                    loading={isSearchingVendors || isLoadingVendors}
                    loadingMore={loadingMoreVendors}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    disabled={isLoadingPartyLedger || !vendorMaster}
                    className="h-12 bg-blue-700 w-full"
                  >
                    {isLoadingPartyLedger ? "Loading..." : t("Filter")}
                  </Button>
                </div>
              </div>

              {/* Right Side: Opening Balance & Download */}
              <div className="flex flex-col md:items-end gap-2">
                <div className="flex items-center justify-end gap-2">
                  <div className="text-sm text-gray-600 font-semibold dark:text-gray-300">
                    Opening Balance:
                  </div>
                  <div className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                    ₹{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(partyLedgerData?.Balance?.OpeningBal || 0))}
                  </div>
                </div>

                {partyLedgerData?.Ledger?.length > 0 && (
                  <div className="flex flex-col items-end gap-1">
                    <Button
                      layout="outline"
                      onClick={handleDownloadPDF}
                      disabled={isDownloadingPDF}
                      className="flex items-center gap-2 h-10 border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      {isDownloadingPDF ? (downloadProgress > 0 ? `Downloading ${downloadProgress}%` : "Generating PDF...") : "Download PDF"}
                      <IoCloudDownloadOutline className={`text-lg ${isDownloadingPDF ? 'animate-bounce' : ''}`} />
                    </Button>

                    {isDownloadingPDF && (
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{ width: `${downloadProgress || 5}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>

          </CardBody>
        </Card>
      </AnimatedContent>

      {isLoadingPartyLedger ? (
        <TableLoading row={12} col={7} width={160} height={20} />
      ) :
        partyLedgerData?.Ledger?.length ? (
          <TableContainer className="mb-4 rounded-b-lg">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Date</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell>VCHTYPE</TableCell>
                  <TableCell>VCHNO</TableCell>
                  <TableCell>Debit Amt.</TableCell>
                  <TableCell>Credit Amt.</TableCell>
                  <TableCell>SHORTNAR</TableCell>
                </tr>
              </TableHeader>
              <PartyLedgerTable
                lang={lang}
                partyLedgerData={{
                  ...partyLedgerData,
                  Ledger: paginatedLedger,
                  // Show balance info only on the last page or handle it separately
                  showBalance: currentPage === Math.ceil(totalResults / resultsPerPage)
                }}
              />
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onChange={onPageChange}
                label="Ledger navigation"
              />
            </TableFooter>
          </TableContainer>
        ) : (
          !isLoadingPartyLedger && vendorMaster && <NotFound title="PartyLedger" />
        )}
    </>
  );
};

export default PartyLedger;
