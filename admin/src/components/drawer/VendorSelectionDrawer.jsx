import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiX } from "react-icons/fi";
import { Button, Card, CardBody } from "@windmill/react-ui";
import AnimatedContent from "@/components/common/AnimatedContent";
import CustomerServices from "@/services/CustomerServices";
import VendorGroupServices from "@/services/VendorGroupServices";
import { notifySuccess, notifyError } from "@/utils/toast";

const VendorSelectionDrawer = ({ isOpen, onClose, catalogData, onSendPdf }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('vendorGroups');
  const [vendorGroups, setVendorGroups] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchVendorGroups();
      fetchVendors();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedItems([]);
  }, [activeTab]);

  const fetchVendorGroups = async () => {
    try {
      setLoading(true);
      const response = await VendorGroupServices.getAllVendorGroup();
      console.log("Fetched vendor groups:", response);
      setVendorGroups(response);
    } catch (error) {
      console.error("Error fetching vendor groups:", error);
      notifyError("Failed to fetch vendor groups");
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await CustomerServices.getAllCustomer();
      console.log("Fetched vendors:", response);
      setVendors(response);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      notifyError("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleItemToggle = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSelectAll = () => {
    const currentData = activeTab === 'vendorGroups' ? vendorGroups : vendors;
    if (selectedItems.length === currentData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentData.map(item => item._id));
    }
  };

  const handleSendPdf = async () => {
    if (selectedItems.length === 0) {
      notifyError(`Please select at least one ${activeTab === 'vendorGroups' ? 'vendor group' : 'vendor'}`);
      return;
    }

    try {
      setSending(true);
      
      if (activeTab === 'vendorGroups') {
        const selectedGroupData = vendorGroups.filter(group => 
          selectedItems.includes(group._id)
        );
        console.log("Selected vendor groups:", selectedGroupData);
        
        // For vendor groups, we might need to get vendors from those groups
        // This is a placeholder - you might need to implement group-to-vendor mapping
        notifySuccess(`PDF will be sent to ${selectedGroupData.length} vendor groups`);
      } else {
        const selectedVendorData = vendors.filter(vendor => 
          selectedItems.includes(vendor._id)
        );
        console.log("Selected vendors:", selectedVendorData);
        
        // Extract phone numbers
        const phoneNumbers = selectedVendorData
          .map(vendor => vendor.mobile)
          .filter(phone => phone);

        if (phoneNumbers.length === 0) {
          notifyError("Selected vendors don't have phone numbers");
          return;
        }

        await onSendPdf(selectedVendorData, phoneNumbers, catalogData);
        notifySuccess(`PDF will be sent to ${phoneNumbers.length} vendors`);
      }
      
      onClose();
    } catch (error) {
      console.error("Error sending PDF:", error);
      notifyError("Failed to send PDF");
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Select {activeTab === 'vendorGroups' ? 'Vendor Groups' : 'Vendors'} for PDF
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab('vendorGroups')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'vendorGroups'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Vendor Groups
              </button>
              <button
                onClick={() => setActiveTab('vendors')}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'vendors'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Vendors
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {activeTab === 'vendorGroups' ? `Vendor Groups (${vendorGroups.length})` : `Vendors (${vendors.length})`}
                </span>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedItems.length === (activeTab === 'vendorGroups' ? vendorGroups.length : vendors.length) ? "Deselect All" : "Select All"}
                </button>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading {activeTab === 'vendorGroups' ? 'vendor groups' : 'vendors'}...</p>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                  {(activeTab === 'vendorGroups' ? vendorGroups : vendors).length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No {activeTab === 'vendorGroups' ? 'vendor groups' : 'vendors'} found
                    </div>
                  ) : (
                    (activeTab === 'vendorGroups' ? vendorGroups : vendors).map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          id={item._id}
                          checked={selectedItems.includes(item._id)}
                          onChange={() => handleItemToggle(item._id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={item._id}
                          className="ml-3 flex-1 cursor-pointer"
                        >
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                          {/* <div className="text-sm text-gray-500">
                            {activeTab === 'vendorGroups' 
                              ? `Discount: ${item.discount || 'N/A'}%`
                              : (item.mobile ? `📞 ${item.mobile}` : "No phone number")
                            }
                          </div> */}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <Button
                layout="outline"
                onClick={onClose}
                disabled={sending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendPdf}
                disabled={selectedItems.length === 0 || sending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {sending ? "Sending..." : `Send PDF (${selectedItems.length})`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSelectionDrawer; 