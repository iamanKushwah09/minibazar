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
import DispatchDrawer from "@/components/drawer/DispatchDrawer";
import DispatchTable from "@/components/dispatch/DispatchTable";
import OrderServices from "@/services/OrderServices";

const Dispatch = () => {
    const { state } = useContext(AdminContext);
    const { adminInfo } = state;
    if (!adminInfo?.email) return <div>Loading...</div>;
    const { toggleDrawer, lang } = useContext(SidebarContext);
    const { data, loading, error } = useAsync(() =>
        OrderServices.getAllOrder({ email: adminInfo?.email })
    );
    
    const {
        userRef,
        setRole,
        totalResults,
        resultsPerPage,
        dataTable,
        serviceData,
        handleChangePage,
        handleSubmitUser,
    } = useFilter(data);

    const { t } = useTranslation();

    // handle reset filed
    const handleResetField = () => {
        setRole("");
        userRef.current.value = "";
    };

    return (
        <>
            <PageTitle>Dispatch</PageTitle>
            <MainDrawer product={false}>
                <DispatchDrawer />
            </MainDrawer>
            {/* <AnimatedContent>
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
                                    placeholder={t("RoleSearchBy")}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 mt-5 mr-1"
                                ></button>
                            </div>

                            <div className="w-full md:w-56 lg:w-56 xl:w-56">
                                <Button
                                    onClick={toggleDrawer}
                                    className="w-full rounded-md h-12"
                                >
                                    <span className="mr-3">
                                        <FiPlus />
                                    </span>
                                    Dispatch
                                </Button>
                            </div>
                            <div className="mt-2 md:mt-0 flex units-center xl:gap-x-4 gap-x-1 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                                <div className="w-full mx-1">
                                    <Button type="submit" className="h-12 w-full bg-blue-700">
                                        Filter
                                    </Button>
                                </div>

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
            </AnimatedContent> */}
            {loading ? (
                // <Loading loading={loading} />
                <TableLoading row={12} col={7} width={163} height={20} />
            ) : error ? (
                <span className="text-center mx-auto text-red-500">{error}</span>
            ) : serviceData?.length !== 0 ? (
                <TableContainer className="mb-8 rounded-b-lg">
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableCell>{t("Order no")}</TableCell>
                                <TableCell>{t("Order date")}</TableCell>
                                <TableCell>{t("Payment mode")}</TableCell>
                                <TableCell>{t("Shipping charge")}</TableCell>
                                <TableCell>{t("Total Amt.")}</TableCell>
                                <TableCell>{t("Total Qty.")}</TableCell>
                                <TableCell>{t("Status")}</TableCell>
                                <TableCell>{t("ActionTbl")}</TableCell>
                            </tr>
                        </TableHeader>
                        <DispatchTable dataTable={dataTable} lang={lang} />
                    </Table>
                    <TableFooter>
                        <Pagination
                            totalResults={totalResults}
                            resultsPerPage={resultsPerPage}
                            onChange={handleChangePage}
                            label="Table navigation"
                        />
                    </TableFooter>
                </TableContainer>
            ) : (
                <NotFound title="Sorry, There are no role right now." />
            )}
        </>
    );
};

export default Dispatch;