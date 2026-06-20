import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext , useState , useRef , useEffect  } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import MainDrawer from "@/components/drawer/MainDrawer";
import StockDrawer from "@/components/drawer/StockDrawer";
import TableLoading from "@/components/preloader/TableLoading";
// import StockTable from "@/components/stockTable/StockTable";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import BannerServices from "@/services/BannerServices";
import StockTable from "@/components/stock/StockTable";
import ItemServices from "@/services/ItemServices";
import AnimatedContent from "@/components/common/AnimatedContent";

const Stock = () => {

  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { toggleDrawer, lang } = useContext(SidebarContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(20);
  const [totalResults, setTotalResults] = useState(0);
  const userRef = useRef("");
  const [searchQuery, setSearchQuery] = useState("");
  const [rawQuery, setRawQuery] = useState("");
  const debounceRef = useRef();
  // Guards to avoid duplicate/stale updates
  const hasFetchedRef = useRef(false);
  const requestIdRef = useRef(0);
  const allowPageOneRef = useRef(true);
  const { toggleModal } = useContext(SidebarContext);
  const { t } = useTranslation();

  // // handle reset filed
  // const handleResetField = () => {
  //   setRole("");
  //   userRef.current.value = "";
  // };
  const fetchItems = async (page = 1, limit = resultsPerPage, q = "") => {
    // Block unintended resets to page 1 unless explicitly allowed
    if (page === 1 && !allowPageOneRef.current) {
      console.log("Blocked unintended page=1 fetch");
      return;
    }
    const requestId = ++requestIdRef.current;
    console.log("fetchItems called:", { page, limit, q, requestId });
    setLoading(true);
    setError("");
    try {
      const { items, totalDoc/*, limits, pages*/ } = await ItemServices.getAllItem({ page, limit, q });
      if (requestId !== requestIdRef.current) {
        console.log("fetchItems ignored stale response:", { page, limit, q, requestId, latest: requestIdRef.current });
        return;
      }
      setItems(items);
      setTotalResults(totalDoc);
      // Keep per-page as the requested limit to avoid UI resets
      setResultsPerPage(limit);
      // Always respect the requested page to prevent unwanted resets
      setCurrentPage(page);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      console.error("fetchItems error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to load items";
      setError(errorMessage);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchItems(1, resultsPerPage, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const [syncLoading, setSyncLoading] = useState(false);
  const [syncStockLoading, setSyncStockLoading] = useState(false);
  // handle reset filed
  const handleResetField = () => {
    setSearchQuery("");
    setRawQuery("");
    if (userRef.current) userRef.current.value = "";
    setCurrentPage(1);
    allowPageOneRef.current = true;
    fetchItems(1, resultsPerPage, "");
  };

  const deleteAllItems = async () => {
    try {
      await ItemServices.deleteAllItems();
      notifySuccess("All items deleted successfully");
      fetchItems(currentPage, resultsPerPage, searchQuery);
    } catch (err) {
      console.error("Error deleting all items:", err);
      notifyError("Something went wrong");
    }
  };

  // Optionally, you can refresh the item list after deletion

  const syncItem = async () => {
    setSyncLoading(true);
    try {
      const res = await ItemServices.syncItem();
      notifySuccess(res.message);
      fetchItems(currentPage, resultsPerPage, searchQuery);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to sync items';
      notifyError(errorMessage);
    } finally {
      setSyncLoading(false);
    }
  };

  const syncStock = async () => {
    setSyncStockLoading(true);
    try {
      const res = await ItemServices.syncStock();
      notifySuccess(`Stock sync completed: ${res.updated} items updated`);
      fetchItems(currentPage, resultsPerPage, searchQuery);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to sync stock';
      notifyError(errorMessage);
    } finally {
      setSyncStockLoading(false);
    }
  };

  // Debounced search as-you-type
  const onSearchChange = (e) => {
    const value = e.target.value;
    setRawQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = value.trim();
      // Avoid redundant fetch if unchanged
      if (q === searchQuery) return;
      setSearchQuery(q);
      setCurrentPage(1);
      allowPageOneRef.current = true;
      fetchItems(1, resultsPerPage, q);
    }, 300);
  };

  const handleSubmitUser = (e) => {
    e.preventDefault();
    const q = userRef.current?.value?.trim() || "";
    if (q === searchQuery) return;
    setSearchQuery(q);
    setCurrentPage(1);
    allowPageOneRef.current = true;
    fetchItems(1, resultsPerPage, q);
  };

   const handleChangePage = (p) => {
      // coerce whatever we receive to a number (number/string/object)
      // Windmill usually sends a number, but be defensive.
      const incoming =
        typeof p === "number"
          ? p
          : p && typeof p === "object"
          ? // if it's an object with .page or a native event with target.value
            Number(p.page ?? p.target?.value ?? NaN)
          : Number(p);
  
      const nextPage = Number.isInteger(incoming) && incoming > 0 ? incoming : NaN;
  
      if (Number.isNaN(nextPage)) {
        console.warn("handleChangePage received invalid page:", p);
        return;
      }
  
      if (nextPage === currentPage) return;
  
      if (debounceRef.current) clearTimeout(debounceRef.current);
  
      console.log("handleChangePage:", { from: currentPage, to: nextPage, perPage: resultsPerPage, q: searchQuery });
  
      // update state and allow/reset page-one guard
      setCurrentPage(nextPage);
      allowPageOneRef.current = nextPage === 1;
      fetchItems(nextPage, resultsPerPage, searchQuery);
    };
  
    const handlePrevPage = () => {
      const prev = Math.max(1, Number(currentPage) - 1);
      if (prev === currentPage) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      console.log("handlePrevPage:", { from: currentPage, to: prev });
      setCurrentPage(prev);
      allowPageOneRef.current = prev === 1;
      fetchItems(prev, resultsPerPage, searchQuery);
    };
  
    const handleNextPage = () => {
      const totalPages = Math.max(1, Math.ceil((totalResults || 0) / (resultsPerPage || 1)));
      const next = Math.min(totalPages, Number(currentPage) + 1);
      if (next === currentPage) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      console.log("handleNextPage:", { from: currentPage, to: next, totalPages });
      setCurrentPage(next);
      allowPageOneRef.current = next === 1;
      fetchItems(next, resultsPerPage, searchQuery);
    };
    // ---- end replacements ----
  

  const totalPages = Math.max(1, Math.ceil((totalResults || 0) / (resultsPerPage || 1)));
  const startPage = Math.max(1, Number(currentPage) - 2);
  const endPage = Math.min(totalPages, Number(currentPage) + 2);



  return (
    <>
      <PageTitle>{t("Stock")} </PageTitle>
      <MainDrawer >
        <StockDrawer />
      </MainDrawer>
      <AnimatedContent>
          <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
            <CardBody>
              <form
                onSubmit={handleSubmitUser}
                className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
              >
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <Input
                    ref={userRef}
                    type="search"
                    name="search"
                    placeholder={t("Search Item")}
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 mt-5 mr-1"
                  ></button>
                </div>
                {/* <div className="w-full md:w-56 lg:w-56 xl:w-56">
                 <div className="w-full mx-1">
                    <Button type="submit" className="h-12 w-full bg-blue-700">
                      Search
                    </Button>
                  </div>
                </div> */}
                <div className="mt-2 md:mt-0 flex banners-center xl:gap-x-4 gap-x-1 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  
                   <Button
                    onClick={toggleDrawer}
                    className="w-full rounded-md h-12"
                  >
                    <span className="mr-3">
                      <FiPlus />
                    </span>
                    {t("Add Banner")}
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
      {loading ? (
        // <Loading loading={loading} />
        <TableLoading row={12} col={7} width={163} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : items?.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>{t("Name")}</TableCell>
                <TableCell>{t("Stock")}</TableCell>
                <TableCell>{t("Alias")}</TableCell>
                <TableCell>{t("Category")}</TableCell>
                <TableCell>{t("Item group")}</TableCell>
                <TableCell>{t("Brand")}</TableCell>
                <TableCell>{t("Unit")}</TableCell>
                <TableCell>{t("Alternate unit")}</TableCell>
                {/* <TableCell>{t("Conversion factor")}</TableCell> */}
                {/* <TableCell>{t("Tax GST")}</TableCell> */}
                {/* <TableCell>{t("HSN Code")}</TableCell> */}
                <TableCell>{t("Sale Price")}</TableCell>
                <TableCell>{t("MRP")}</TableCell>
                {/* <TableCell>{t("Discount")}</TableCell> */}
                {/* <TableCell>{t("Vendor Discount")}</TableCell> */}
                {/* <TableCell>{t("Specification")}</TableCell> */}
                {/* <TableCell>{t("Short description")}</TableCell> */}
                {/* <TableCell>{t("Long description")}</TableCell> */}
                <TableCell className="text-center">{"View"}</TableCell>
                {/* <TableCell className="text-right">
                  {t("Actions")}
                </TableCell> */}
              </tr>
            </TableHeader>
            <StockTable dataTable={items} lang={lang} isShow={false} />
          </Table>
          {/* <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter> */}
          <TableFooter>
            <div className="w-full flex items-center justify-between px-4 py-2">
              <div className="text-sm">
                {totalResults > 0 ? (
                  <span>
                    Showing {Math.min((currentPage - 1) * resultsPerPage + 1, totalResults)}-
                    {Math.min(currentPage * resultsPerPage, totalResults)} of {totalResults}
                  </span>
                ) : (
                  <span>Showing 0 of 0</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button layout="outline" onClick={handlePrevPage} disabled={currentPage <= 1}>
                  Prev
                </Button>
                {startPage > 1 && (
                  <>
                    <Button
                      layout="outline"
                      onClick={() => handleChangePage(1)}
                      className={currentPage === 1 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-blue-300 font-medium" : ""}
                    >
                      1
                    </Button>
                    {startPage > 2 && <span className="px-1">...</span>}
                  </>
                )}
                {Array.from({ length: Math.max(0, endPage - startPage + 1) }, (_, idx) => {
                  const p = startPage + idx;
                  if (p === 1 || p === totalPages) return null;
                  return (
                    <Button
                      key={`p-${p}`}
                      layout="outline"
                      onClick={() => handleChangePage(p)}
                      className={currentPage === p ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-blue-300 font-medium" : ""}
                    >
                      {p}
                    </Button>
                  );
                })}
                {endPage < totalPages && (
                  <>
                    {endPage < totalPages - 1 && <span className="px-1">...</span>}
                    <Button
                      layout="outline"
                      onClick={() => handleChangePage(totalPages)}
                      className={currentPage === totalPages ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-blue-300 font-medium" : ""}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
                <Button layout="outline" onClick={handleNextPage} disabled={currentPage >= totalPages}>
                  Next
                </Button>
              </div>
            </div>
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no role right now." />
      )}
    </>
  );
};

export default Stock;
