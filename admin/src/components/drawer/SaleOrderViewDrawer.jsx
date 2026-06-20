import { SidebarContext } from '@/context/SidebarContext';
import Drawer from 'rc-drawer';
import { useContext, useEffect, useState } from 'react';
import { FiX } from "react-icons/fi";
import { FaCreditCard, FaBox, FaShippingFast, FaTags, FaCalendarAlt, FaClipboardList, FaPercent } from "react-icons/fa";
import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Label } from "@windmill/react-ui";
import Title from "@/components/form/others/Title";
import CustomerServices from '@/services/CustomerServices';
import ItemServices from '@/services/ItemServices';

const SaleOrderViewDrawer = ({ visible, setVisible, handleClose, data }) => {
  const [ApiData, setApiData] = useState({})
  const [itmesData, setitmesData] = useState([])
  const TypeData = async (id) => {
    if (!id) return;
    const resData = await CustomerServices.getItemCustomer(id);
    console.log("resData", resData)
    setApiData(resData.dispatches1);
  };
  useEffect(() => {
    TypeData(data._id);
  }, [data]);
  // const itemsdata = async () => {
  //   const resData = await ItemServices.getItemById(data.variant.map(item => item.item_id))
  //   console.log(resData, 'resData');
  //   setitmesData(resData);
  // };

  // useEffect(() => {
  //   itemsdata();
  // }, [data]);

  // console.log(itmesData);



  return (
    <>
      <Drawer
        open={visible}
        placement="right"
        width={"85%"}
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

        <div className="w-full p-6 border-b  border-gray-100 bg-gradient-to-r dark:bg-gray-800 dark:text-gray-300 rounded-t-lg shadow-lg">
          <Title title="Sale Order View " />
        </div>


        <Scrollbars className="w-full relative dark:bg-gray-700 dark:text-gray-200">
          <div className="flex flex-wrap w-full justify-between p-6 border-b border-gray-100 bg-gradient-to-r dark:bg-gray-800 dark:text-gray-300 rounded-t-lg shadow-lg">
            {/* Order Number Card */}
            <div className="flex flex-1 sm:w-full md:w-1/2 lg:w-1/4 p-4 mx-3 mb-6 shadow-lg rounded-lg transform transition-all hover:scale-105 hover:shadow-xl bg-gray-50 dark:bg-gray-700">
              <FaClipboardList className="text-blue-500 text-5xl mb-2" />
              <div>
                <Label className="text-lg font-semibold text-gray-800">Order Number</Label>
                <p className="text-lg font-medium text-blue-500">{data.order_no}</p>
              </div>
            </div>

            {/* Order Date Card */}
            <div className="flex flex-1 sm:w-full md:w-1/2 lg:w-1/4 p-4 mx-3 mb-6 shadow-lg rounded-lg transform transition-all hover:scale-105 hover:shadow-xl bg-gray-50 dark:bg-gray-700">
              <FaCalendarAlt className="text-teal-500 text-5xl mb-2" />
              <div>
                <Label className="text-lg font-semibold text-gray-800">Order Date</Label>
                <p className="text-lg font-medium text-teal-500">{data.order_date}</p>
              </div>
            </div>

            {/* Status Card */}
            <div className="flex flex-1 sm:w-full md:w-1/2 lg:w-1/4 p-4 mx-3 mb-6 shadow-lg rounded-lg transform transition-all hover:scale-105 hover:shadow-xl bg-gray-50 dark:bg-gray-700">
              <FaShippingFast className="text-yellow-500 text-5xl mb-2" />
              <div className='ml-1'>
                <Label className="text-lg font-semibold text-gray-800">Status</Label>
                <p className="text-lg font-medium text-yellow-500">{data.status}</p>
              </div>
            </div>

            {/* Payment Mode Card */}
            <div className="flex flex-1 sm:w-full md:w-1/2 lg:w-1/4 p-4 mx-3 mb-6 shadow-lg rounded-lg transform transition-all hover:scale-105 hover:shadow-xl bg-gray-50 dark:bg-gray-700">
              <FaCreditCard className="text-green-500 text-5xl mb-2" />
              <div className='ml-1'>
                <Label className="text-lg font-semibold text-gray-800">Payment Mode</Label>
                <p className="text-lg font-medium text-green-500">{data.payment_mode}</p>
              </div>
            </div>
          </div>



          <div className="w-full p-6 border-b border-gray-100 bg-gradient-to-r dark:bg-gray-800 dark:text-gray-300 rounded-t-lg shadow-lg">
            <Title title="Customer Information" />
          </div>
          <Card className="overflow-hidden p-6 shadow-xl rounded-lg bg-white dark:bg-gray-800">
            <CardBody className="space-y-6">
              {/* Customer Info Section */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Name */}
                  <div className="flex justify-between">
                    <Label className="text-lg font-medium text-gray-700 dark:text-gray-300">Name</Label>
                    {/* <p className="text-lg text-gray-900 dark:text-gray-300">{ApiData?.name || "N/A"}</p> */}
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-300">{ApiData?.customer?.name || "N/A"}</p>
                  </div>

                  {/* Email */}
                  <div className="flex justify-between">
                    <Label className="text-lg font-medium text-gray-700 dark:text-gray-300">Email</Label>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-300">{ApiData?.customer?.email || "N/A"}</p>
                  </div>

                  {/* Mobile */}
                  <div className="flex justify-between">
                    <Label className="text-lg font-medium text-gray-700 dark:text-gray-300">Mobile</Label>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-300">{ApiData?.customer?.shippingAddress?.contact || "N/A"}</p>
                  </div>

                  {/* Address */}
                  <div className="flex justify-between">
                    <Label className="text-lg font-medium text-gray-700 dark:text-gray-300">Address</Label>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-300">{ApiData?.customer?.shippingAddress?.address || "N/A"}</p>
                  </div>

                  {/* Shipping Address */}
                  <div className="flex justify-between">
                    <Label className="text-lg font-medium text-gray-700 dark:text-gray-300">Shipping Address</Label>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-300">{ApiData?.customer?.shippingAddress?.address || "N/A"}</p>
                  </div>

                  {/* GST Type */}
                  <div className="flex justify-between">
                    <Label className="text-lg font-medium text-gray-700 dark:text-gray-300">GST Type</Label>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-300">{ApiData?.customer?.group_type == 'customer' ? ApiData?.customer?.gst_no : "None" || "N/A"}</p>
                  </div>

                  {/* Group Type */}
                  <div className="flex justify-between">
                    <Label className="text-lg font-medium text-gray-700 dark:text-gray-300">Group Type</Label>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-300">{ApiData?.customer?.group_type || "N/A"}</p>
                  </div>

                  {/* Optional Fields */}
                  {ApiData?.customer?.gst_no && (
                    <div className="flex justify-between">
                      <Label className="text-lg font-medium text-gray-700 dark:text-gray-300">GST Number</Label>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-300">{ApiData?.customer?.gst_no || "N/A"}</p>
                    </div>
                  )}

                  {ApiData?.customer?.aadhaar_no && (
                    <div className="flex justify-between">
                      <Label className="text-lg font-medium text-gray-700 dark:text-gray-300">Aadhaar Number</Label>
                      <p className="text-lg text-gray-900 dark:text-gray-300">{ApiData?.customer?.aadhaar_no || "N/A"}</p>
                    </div>
                  )}

                  {ApiData?.customer?.pincode && (
                    <div className="flex justify-between">
                      <Label className="text-lg font-medium text-gray-700 dark:text-gray-300">Pincode</Label>
                      <p className="text-lg text-gray-900 dark:text-gray-300">{ApiData?.customer?.pincode || "N/A"}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>


          <Card className="overflow-hidden p-6 shadow-xl rounded-lg bg-white dark:bg-gray-800">
            <CardBody className="space-y-6">
              {/* Order Info Section */}
              {/* Variants Data Section */}
              <div className="space-y-4">
                <Label className="text-2xl font-semibold">Variants</Label>
                {ApiData?.variant?.map((variant, index) => (
                  <div key={index} className="border p-4 rounded-lg shadow-md bg-gray-50 dark:bg-gray-700">

                    {/* Item ID */}
                    <div className="flex justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <FaTags className="text-gray-600 dark:text-gray-300 text-2xl" />
                        <span className="text-lg font-medium text-gray-800 dark:text-gray-100">Item Name:</span>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-300">
                        {variant.title}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <FaTags className="text-gray-600 dark:text-gray-300 text-2xl" />
                        <span className="text-lg font-medium text-gray-800 dark:text-gray-100">Price:</span>
                      </div>
                      <p className="text-lg text-gray-900 dark:text-gray-300">{variant.price}</p>
                    </div>

                    {/* Color and Size */}
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <FaTags className="text-gray-600 dark:text-gray-300 text-2xl" />
                          <span className="text-lg font-medium text-gray-800 dark:text-gray-100">Color:</span>
                        </div>
                        <p className="text-lg text-gray-900 dark:text-gray-300">{variant.color || "N/A"}</p>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <FaTags className="text-gray-600 dark:text-gray-300 text-2xl" />
                          <span className="text-lg font-medium text-gray-800 dark:text-gray-100">Size:</span>
                        </div>
                        <p className="text-lg text-gray-900 dark:text-gray-300">{variant.size || "N/A"}</p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <FaTags className="text-gray-600 dark:text-gray-300 text-2xl" />
                        <span className="text-lg font-medium text-gray-800 dark:text-gray-100">Amount:</span>
                      </div>
                      <p className="text-lg text-gray-900 dark:text-gray-300">{variant.amount}</p>
                    </div>

                    {/* Optional Fields for Stock and Discount */}
                    {variant.qty && (
                      <div className="flex justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <FaBox className="text-gray-600 dark:text-gray-300 text-2xl" />
                          <span className="text-lg font-medium text-gray-800 dark:text-gray-100">Quantity:</span>
                        </div>
                        <p className="text-lg text-gray-900 dark:text-gray-300">{variant.qty}</p>
                      </div>
                    )}

                    {variant.discount && (
                      <div className="flex justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <FaPercent className="text-gray-600 dark:text-gray-300 text-2xl" />
                          <span className="text-lg font-medium text-gray-800 dark:text-gray-100">Discount:</span>
                        </div>
                        <p className="text-lg text-gray-900 dark:text-gray-300">{variant.discount}%</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>


              {/* Shipping Charges and Total Amount */}
              <div className="space-y-4 mt-6">
                <div className="flex justify-between">
                  <Label className="text-lg font-medium">Shipping Charge</Label>
                  <p className="text-lg text-gray-900 dark:text-gray-300">{data.shipping_charge}</p>
                </div>
                <div className="flex justify-between">
                  <Label className="text-lg font-medium">Total Amount</Label>
                  <p className="text-lg text-gray-900 dark:text-gray-300">{data.total_amount}</p>
                </div>
                <div className="flex justify-between">
                  <Label className="text-lg font-medium">Total Quantity</Label>
                  <p className="text-lg text-gray-900 dark:text-gray-300">{data.total_qty}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <Label className="text-lg font-medium">Description</Label>
                <p className="text-lg text-gray-900 dark:text-gray-300">{data.description}</p>
              </div>
            </CardBody>
          </Card>
        </Scrollbars>
      </Drawer>
    </>
  );
};

export default SaleOrderViewDrawer;
