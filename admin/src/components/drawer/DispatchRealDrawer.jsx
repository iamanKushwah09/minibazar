import Drawer from "rc-drawer";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import {
  FaCreditCard,
  FaBox,
  FaShippingFast,
  FaTags,
  FaCalendarAlt,
  FaClipboardList,
  FaPercent,
} from "react-icons/fa";
import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Label } from "@windmill/react-ui";
import Title from "@/components/form/others/Title";
import CustomerServices from "@/services/CustomerServices";
import ItemServices from "@/services/ItemServices";
import dispatchLogServices from "@/services/DispatchLogServices";
import SaleOrderServices from "@/services/SaleOrderServices";
import Cookies from "js-cookie";
import dayjs from "dayjs";

const DispatchRealDrawer = ({ visible, setVisible, handleClose, data }) => {

  const [ApiData, setApiData] = useState({});
  const [itmesData, setitmesData] = useState([]);
  const [dispatchLogData, setDispatchLogData] = useState([]);
  const [activeTab, setActiveTab] = useState('customer');
  const [username, setusername] = useState("");
  const TypeData = async (id) => {
    if (!id) return;
    const getOrderDetails = await SaleOrderServices.getSaleOrderById(id);
    console.log(getOrderDetails);
    setApiData(getOrderDetails);
  };

  const fetchDispatchLogData = async (orderDetailsId) => {
    if (!orderDetailsId) return;
    const resDispatchLogData = await dispatchLogServices.getLogsByOrderDetails(orderDetailsId);
    console.log(resDispatchLogData)
    setDispatchLogData(resDispatchLogData);
  };

  useEffect(() => {
    const adminInfo = Cookies.get("adminInfo");
    if (adminInfo) {
      try {
        const parsedInfo = JSON.parse(adminInfo);
        setusername(parsedInfo?.name?.en || "");
      } catch (err) {
        console.error("Failed to parse adminInfo cookie", err);
      }
    }
  }, []);

  useEffect(() => {
    TypeData(data._id);
    fetchDispatchLogData(data._id);
  }, [data]);

  return (
    <>
      <Drawer
        open={visible}
        placement="right"
        width={"100%"}
        onClose={() => setVisible(false)}
        level={null}
        parent={null}
        style={{
          zIndex: 10000,
        }}
      >
        <button
          onClick={handleClose}
          className="absolute z-10 text-red-500 hover:bg-red-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-6 right-0 left-auto w-12 h-12 rounded-full block text-center"
        >
          <FiX className="mx-auto text-xl" />
        </button>

        <div className="w-full p-4 sm:p-6 border-b  border-gray-100 bg-gradient-to-r dark:bg-gray-800 dark:text-gray-300 rounded-t-lg shadow-lg">
           <Title title="Read Dispatch" />
         </div>

        <Scrollbars className="w-full relative dark:bg-gray-700 dark:text-gray-200">
          <div className="flex flex-wrap w-full justify-between p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r dark:bg-gray-800 dark:text-gray-300 rounded-t-lg shadow-lg">
            {/* Order Number Card */}
            <div className="flex flex-1 w-full sm:w-1/2 md:w-1/2 lg:w-1/4 p-4 mx-3 mb-6 shadow-lg rounded-lg transform transition-all hover:scale-105 hover:shadow-xl bg-gray-50 dark:bg-gray-700">
              <FaClipboardList className="text-blue-500 text-3xl sm:text-5xl mb-2" />
              <div className="ml-2">
                <Label className="text-sm sm:text-lg font-semibold text-gray-800">
                  Order Number
                </Label>
                <p className="text-sm sm:text-lg font-medium text-blue-500">
                  {ApiData.voucherNo}
                </p>
              </div>
            </div>

            {/* Order Date Card */}
            <div className="flex flex-1 w-full sm:w-1/2 md:w-1/2 lg:w-1/4 p-4 mx-3 mb-6 shadow-lg rounded-lg transform transition-all hover:scale-105 hover:shadow-xl bg-gray-50 dark:bg-gray-700">
              <FaCalendarAlt className="text-teal-500 text-3xl sm:text-5xl mb-2" />
              <div className="ml-2">
                <Label className="text-sm sm:text-lg font-semibold text-gray-800">
                  Order Date
                </Label>
                <p className="text-sm sm:text-lg font-medium text-teal-500">
                  {dayjs(ApiData.order_date).format("YYYY-MM-DD")}
                </p>
              </div>
            </div>

            {/* Status Card */}
            <div className="flex flex-1 w-full sm:w-1/2 md:w-1/2 lg:w-1/4 p-4 mx-3 mb-6 shadow-lg rounded-lg transform transition-all hover:scale-105 hover:shadow-xl bg-gray-50 dark:bg-gray-700">
              <FaShippingFast className="text-yellow-500 text-3xl sm:text-5xl mb-2" />
              <div className="ml-2">
                <Label className="text-sm sm:text-lg font-semibold text-gray-800">
                  Status
                </Label>
                <p className="text-sm sm:text-lg font-medium text-yellow-500">
                  {ApiData.status}
                </p>
              </div>
            </div>

            {/* Payment Mode Card */}
            <div className="flex flex-1 w-full sm:w-1/2 md:w-1/2 lg:w-1/4 p-4 mx-3 mb-6 shadow-lg rounded-lg transform transition-all hover:scale-105 hover:shadow-xl bg-gray-50 dark:bg-gray-700">
              <FaCreditCard className="text-green-500 text-3xl sm:text-5xl mb-2" />
              <div className="ml-2">
                <Label className="text-sm sm:text-lg font-semibold text-gray-800">
                  Payment Mode
                </Label>
                <p className="text-sm sm:text-lg font-medium text-green-500">
                  Credit
                </p>
              </div>
            </div>
          </div>

          {/* <div className="w-full p-6 border-b border-gray-100 bg-gradient-to-r dark:bg-gray-800 dark:text-gray-300 rounded-t-lg shadow-lg">
            <Title title="Customer Information" />
          </div>
          <div className="w-full p-6 border-b border-gray-100 bg-gradient-to-r dark:bg-gray-800 dark:text-gray-300 rounded-t-lg shadow-lg">
            <Title title="Dispatch Log" />
          </div> */}

          <div className="w-full p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r dark:bg-gray-800 dark:text-gray-300 rounded-t-lg shadow-lg">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'customer' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                onClick={() => setActiveTab('customer')}
              >
                Customer Info.
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'order' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                onClick={() => setActiveTab('order')}
              >
                Order Info.
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${activeTab === 'dispatch' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                onClick={() => setActiveTab('dispatch')}
              >
                Dispatch Log
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'customer' && (
              <Card className="overflow-hidden p-4 sm:p-6 shadow-xl rounded-lg bg-white dark:bg-gray-800">
                <CardBody className="space-y-4 sm:space-y-6">
                  {/* Customer Info Section */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <Label className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                          Name
                        </Label>
                        <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-gray-300 break-words">
                          {ApiData?.customer?.name || "N/A"}
                        </p>
                      </div>

                      {/* Email */}
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <Label className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                          Email
                        </Label>
                        <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-gray-300 break-words">
                          {ApiData?.customer?.email || "N/A"}
                        </p>
                      </div>

                      {/* Mobile */}
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <Label className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                          Mobile
                        </Label>
                        <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-gray-300 break-words">
                          {ApiData?.customer?.mobile || "N/A"}
                        </p>
                      </div>

                      {/* Address */}
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <Label className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                          Address
                        </Label>
                        <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-gray-300 break-words">
                          {ApiData?.customer?.address || "N/A"}
                        </p>
                      </div>
                      {/* GST Type */}
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <Label className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                          GST Type
                        </Label>
                        <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-gray-300 break-words">
                          {ApiData?.customer?.gst_type || "N/A"}
                        </p>
                      </div>

                      {/* Group Type */}
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <Label className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                          Group Type
                        </Label>
                        <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-gray-300 break-words">
                          {ApiData?.customer?.group_type || "N/A"}
                        </p>
                      </div>

                      {/* Optional Fields */}
                      {ApiData?.customer?.gst_no && (
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <Label className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                            GST Number
                          </Label>
                          <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-gray-300 break-words">
                            {ApiData?.customer?.gst_no || "N/A"}
                          </p>
                        </div>
                      )}

                      {ApiData?.customer?.aadhaar_no && (
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <Label className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                            Aadhaar Number
                          </Label>
                          <p className="text-sm sm:text-lg text-gray-900 dark:text-gray-300 break-words">
                            {ApiData?.customer?.aadhaar_no || "N/A"}
                          </p>
                        </div>
                      )}

                      {ApiData?.customer?.pincode && (
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <Label className="text-sm sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
                            Pincode
                          </Label>
                          <p className="text-sm sm:text-lg text-gray-900 dark:text-gray-300 break-words">
                            {ApiData?.customer?.pincode || "N/A"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {activeTab === 'order' && (
              <Card className="overflow-hidden rounded-lg bg-white dark:bg-gray-800">
                <CardBody className="space-y-2">
                  <div className="space-y-2">
                    <Label className="font-semibold">Variants</Label>
                    {ApiData?.items?.map((variant, index) => (
                      <div
                        key={index}
                        className="border p-4 rounded-lg shadow-md bg-gray-50 dark:bg-gray-700"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-2 bg-white dark:bg-gray-600 rounded-md shadow-sm">
                          <div className="flex items-center">
                            <FaTags className="text-blue-600 dark:text-blue-400 text-2xl mr-2" />
                            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                              Item Name:
                            </span>
                          </div>
                          <p className="text-lg font-bold text-gray-900 dark:text-gray-200 break-words">
                            {variant.name}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-2 bg-white dark:bg-gray-600 rounded-md shadow-sm">
                          <div className="flex items-center">
                            <FaCreditCard className="text-green-600 dark:text-green-400 text-2xl mr-2" />
                            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                              Price:
                            </span>
                          </div>
                          <p className="text-lg font-bold text-gray-900 dark:text-gray-200">
                            ₹{variant.price}
                          </p>
                        </div>
                        {variant.quantity && (
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-2 bg-white dark:bg-gray-600 rounded-md shadow-sm">
                            <div className="flex items-center">
                              <FaBox className="text-orange-600 dark:text-orange-400 text-2xl mr-2" />
                              <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Quantity:
                              </span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-200">
                              {variant.quantity}
                            </p>
                          </div>
                        )}

                        {variant.discount && (
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-2 bg-white dark:bg-gray-600 rounded-md shadow-sm mt-2">
                            <div className="flex items-center">
                              <FaPercent className="text-red-600 dark:text-red-400 text-2xl mr-2" />
                              <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Discount:
                              </span>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-200">
                              {variant.discount}%
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 mt-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg shadow-md border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center">
                        <FaCreditCard className="text-blue-600 dark:text-blue-400 text-2xl mr-2" />
                        <Label className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          Total Amount
                        </Label>
                      </div>
                      <p className="text-xl font-bold text-blue-900 dark:text-blue-200">
                        ₹{data.totalAmount}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg shadow-md border border-green-200 dark:border-green-700">
                      <div className="flex items-center">
                        <FaBox className="text-green-600 dark:text-green-400 text-2xl mr-2" />
                        <Label className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          Total Quantity
                        </Label>
                      </div>
                      <p className="text-xl font-bold text-green-900 dark:text-green-200">
                        {data.totalQuantity}
                      </p>
                    </div>
                  </div>
                  {/* Description */}
                  <div className="mt-6 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center mb-2">
                      <FaClipboardList className="text-gray-600 dark:text-gray-400 text-2xl mr-2" />
                      <Label className="text-lg font-semibold text-gray-800 dark:text-gray-100">Description</Label>
                    </div>
                    <p className="text-lg text-gray-900 dark:text-gray-200 break-words leading-relaxed">
                      {data.description}
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}

            {activeTab === 'dispatch' && (
              <Card className="overflow-hidden p-6 shadow-xl rounded-lg bg-white dark:bg-gray-800">
                {dispatchLogData?.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No dispatch logs available.
                  </p>
                ) : (
                  dispatchLogData?.map((log, index) => {
                    return (
                      <CardBody key={index} className="space-y-6 border rounded-lg transition-all duration-300 hover:shadow-lg hover:border-gray-400 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-700 mb-4">
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-2 bg-white dark:bg-gray-600 rounded-md shadow-sm">
                            <div className="flex items-center">
                              <FaShippingFast className="text-blue-600 dark:text-blue-400 text-2xl mr-2" />
                              <Label className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Status
                              </Label>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-200">
                              {log.status}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-2 bg-white dark:bg-gray-600 rounded-md shadow-sm">
                            <div className="flex items-center">
                              <FaClipboardList className="text-green-600 dark:text-green-400 text-2xl mr-2" />
                              <Label className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Description
                              </Label>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-200 break-words">
                              {log.updateDescription}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-2 bg-white dark:bg-gray-600 rounded-md shadow-sm">
                            <div className="flex items-center">
                              <FaTags className="text-purple-600 dark:text-purple-400 text-2xl mr-2" />
                              <Label className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Gr No.
                              </Label>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-200">
                              {log.grNo}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 p-2 bg-white dark:bg-gray-600 rounded-md shadow-sm">
                            <div className="flex items-center">
                              <FaBox className="text-orange-600 dark:text-orange-400 text-2xl mr-2" />
                              <Label className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Lot
                              </Label>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-200">
                              {log.lot}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="flex items-center mb-2">
                            <FaCalendarAlt className="text-gray-600 dark:text-gray-400 text-2xl mr-2" />
                            <Label className="text-lg font-semibold text-gray-800 dark:text-gray-100">Images</Label>
                          </div>
                          {log.images?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {log.images.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={
                                    img
                                      ? `${import.meta.env.VITE_APP_API_SOCKET_URL}${img}`
                                      : `${import.meta.env.VITE_APP_DEFAULT_IMAGE_URL}`
                                  }
                                  alt={`Dispatch log image ${idx + 1}`}
                                  className="rounded-md w-full h-32 object-cover shadow-md hover:shadow-lg transition-shadow duration-300"
                                />
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                              No image available
                            </p>
                          )}
                        </div>
                      </CardBody>
                    );
                  })
                )}
              </Card>
            )}
          </div>
        </Scrollbars>
      </Drawer>
    </>
  );
};

export default DispatchRealDrawer;
