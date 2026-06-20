import React, { useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
    Table,
    TableHeader,
    TableCell,
    TableFooter,
    TableContainer,
    Button,
    Card,
    CardBody,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import useAsync from "@/hooks/useAsync";
import { SidebarContext } from "@/context/SidebarContext";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import TableLoading from "@/components/preloader/TableLoading";
import AnimatedContent from "@/components/common/AnimatedContent";
import SearchableDropdown from "./SearchableDropdown";
import CustomerServices from "@/services/CustomerServices";
import BillsReceivableServices from "@/services/BillsReceivableServices";
import BillsReceivableTable from "@/components/bill-receivable/BillReceivableTable";

const BillReceivable = () => {

    const { t } = useTranslation();
    const { lang } = useContext(SidebarContext);
    const [vendorMasterList, setVendorMasterList] = useState([]);
    const [isSearchingVendors, setIsSearchingVendors] = useState(false);
    const [vendorPage, setVendorPage] = useState(1);
    const [hasMoreVendors, setHasMoreVendors] = useState(false);
    const [loadingMoreVendors, setLoadingMoreVendors] = useState(false);
    const [vendorMaster, setVendorMaster] = useState(0);
    const [billsData, setBillsData] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!vendorMaster) return;
        setLoading(true);
        try {
            const response = await BillsReceivableServices.getBillReceivable({
                AccountCode: vendorMaster.value,
                // DateAsOn: new Date().toISOString(),
            });
            setBillsData(response?.data?.Data || []);
        } catch (error) {
            console.error("BillsReceivable error:", error);
            setBillsData([]);
        }
        setLoading(false);
    };

    return (
        <>
            <PageTitle>{t("Bills Receivable")}</PageTitle>
            <AnimatedContent>
                <Card className="min-w-0 shadow-xs overflow-visible bg-white dark:bg-gray-800 rounded-t-lg mb-4">
                    <CardBody className="overflow-visible">
                        <form
                            className="py-3 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            {/* Vendor Selector */}
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="w-full md:w-64 relative z-50">
                                    <SearchableDropdown
                                        options={vendorOptions}
                                        onChange={(value) => {
                                            console.log(value);
                                            return setVendorMaster(value);
                                        }}
                                        placeholder={"Search Vendor"}
                                        onSearch={handleSearchVendors}
                                        onLoadMore={handleLoadMoreVendors}
                                        hasMore={hasMoreVendors}
                                        loading={isSearchingVendors || isLoadingVendors}
                                        loadingMore={loadingMoreVendors}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="h-12 bg-blue-700 w-full"
                                    >
                                        {loading ? "Loading..." : t("Filter")}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </AnimatedContent>

            {loading ? (
                <TableLoading row={12} col={7} width={160} height={20} />
            ) : billsData?.length ? (
                <TableContainer className="mb-8 rounded-b-lg">
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableCell>Party Name</TableCell>
                                <TableCell>
                                    VchNo
                                </TableCell>
                                <TableCell>VchDate</TableCell>
                                <TableCell>PendingAmt</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Days</TableCell>
                            </tr>
                        </TableHeader>
                        <BillsReceivableTable data={billsData} />
                    </Table>
                </TableContainer>
            ) : (
                <NotFound title="Bills Receivable" />
            )}
        </>
    );
};

export default BillReceivable;
