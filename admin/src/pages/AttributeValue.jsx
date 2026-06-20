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
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";

import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import MainDrawer from "@/components/drawer/MainDrawer";
import AttributeValueDrawer from "@/components/drawer/AttributeValueDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
// import AdminServices from "@/services/AdminServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import AttributeValueServices from "@/services/AttributeValueServices";
import AttributeValueTable from "@/components/attributes/AttributeValueTable";
import { notifySuccess, notifyError } from "@/utils/toast";

const AttributeValue = () => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { toggleDrawer, lang } = useContext(SidebarContext);
  const [syncLoading, setSyncLoading] = useState(false);

  const { data, loading, error } = useAsync(() =>
    AttributeValueServices.getAllAttributeValue({ email: adminInfo.email })
  );

  // syncAttributeValue
  const syncAttributeValue = async () => {
    setSyncLoading(true);
    try {
      const res = await AttributeValueServices.syncAttributeValue();
      notifySuccess(res.message);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to sync attribute values";
      notifyError(errorMessage);
    } finally {
      setSyncLoading(false);
    }
  };

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
      <PageTitle>{t("Attribute Value")} </PageTitle>
      <MainDrawer>
        <AttributeValueDrawer />
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
                  placeholder={t("Search Attribute Value")}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-5 mr-1"
                ></button>
              </div>

              {/* 
                                    <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                                        <Select onChange={(e) => setRole(e.target.value)}>
                                            <option value="All" defaultValue hidden>
                                            {t("Role")}
                                            </option>
                                            <option value="Admin">{t("RoleRoleAdmin")}</option>
                                            <option value="Cashier">{t("SelectCashiers")}</option>
                                            <option value="Super Admin">{t("SelectSuperAdmin")}</option>
                                        </Select>
                                    </div> 
                                */}

              <div className="w-full md:w-56 lg:w-56 xl:w-56">
                <div className="w-full mx-1">
                  <Button type="submit" className="h-12 w-full bg-blue-700">
                    Search
                  </Button>
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex units-center xl:gap-x-4 gap-x-1 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Button
                  onClick={toggleDrawer}
                  className="w-full rounded-md h-12"
                >
                  <span className="mr-3">
                    <FiPlus />
                  </span>
                  {t("Add Attribute Value")}
                </Button>
                <div className="w-full">
                  <Button
                    layout="outline"
                    onClick={syncAttributeValue}
                    disabled={syncLoading}
                    type="button"
                    className="px-4 md:py-1 py-3 text-sm border border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 dark:border-blue-400"
                  >
                    <span className="text-blue-900 dark:text-blue-300 font-medium">
                      {syncLoading ? "Syncing..." : "Sync"}
                    </span>
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
      </AnimatedContent>
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
                <TableCell>{t("Name")}</TableCell>
                <TableCell>{"Description"}</TableCell>
                <TableCell>{t("Attribute Group")}</TableCell>
                <TableCell className="text-center">{t("Active")}</TableCell>
                <TableCell className="text-right">{t("Actions")}</TableCell>
              </tr>
            </TableHeader>
            <AttributeValueTable dataTable={dataTable} lang={lang} />
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

export default AttributeValue;
