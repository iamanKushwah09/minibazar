import React from "react";
import { Modal, ModalBody, ModalFooter, Button } from "@windmill/react-ui";
import { FiUser, FiMail, FiPhone, FiMapPin, FiHash, FiCreditCard, FiInfo } from "react-icons/fi";

const CustomerDetailsModal = ({ isOpen, onClose, customer }) => {
  if (!customer) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBody className="custom-modal px-8 pt-6 pb-4">
        <div className="flex items-center mb-4">
          <span className="flex justify-center text-3xl mr-3 text-blue-500">
            <FiUser />
          </span>
          <h2 className="text-xl font-medium">Customer Details</h2>
        </div>
        
        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-start">
            <div className="flex-shrink-0 w-32">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Name:</span>
            </div>
            <div className="flex-1">
              <span className="text-sm text-gray-900 dark:text-gray-100">{customer.name || "N/A"}</span>
            </div>
          </div>

          {/* Email */}
          {/* {customer.email && (
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <FiMail className="mr-1" /> Email:
                </span>
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-900 dark:text-gray-100">{customer.email}</span>
              </div>
            </div>
          )} */}

          {/* Mobile */}
          {customer.mobile && (
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <FiPhone className="mr-1" /> Mobile:
                </span>
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-900 dark:text-gray-100">{customer.mobile}</span>
              </div>
            </div>
          )}

          {/* Address */}
          {customer.address && (
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <FiMapPin className="mr-1" /> Address:
                </span>
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-900 dark:text-gray-100">{customer.address}</span>
              </div>
            </div>
          )}

          {/* Pincode */}
          {customer.pincode && (
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pincode:</span>
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-900 dark:text-gray-100">{customer.pincode}</span>
              </div>
            </div>
          )}

          {/* Group Type */}
          {customer.group_type && (
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <FiInfo className="mr-1" /> Group Type:
                </span>
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-900 dark:text-gray-100">{customer.group_type}</span>
              </div>
            </div>
          )}

          {/* GST No */}
          {customer.gst_no && (
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <FiHash className="mr-1" /> GST No:
                </span>
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-900 dark:text-gray-100">{customer.gst_no}</span>
              </div>
            </div>
          )}

          {/* GST Type */}
          {customer.gst_type && (
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">GST Type:</span>
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-900 dark:text-gray-100">{customer.gst_type}</span>
              </div>
            </div>
          )}

          {/* Aadhaar No */}
          {customer.aadhaar_no && (
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <FiCreditCard className="mr-1" /> Aadhaar No:
                </span>
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-900 dark:text-gray-100">{customer.aadhaar_no}</span>
              </div>
            </div>
          )}

          {/* Remarks */}
          {customer.remarks && (
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <FiInfo className="mr-1" /> Remarks:
                </span>
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-900 dark:text-gray-100">{customer.remarks}</span>
              </div>
            </div>
          )}

          {/* Customer ID */}
          {customer._id && (
            <div className="flex items-start">
              <div className="flex-shrink-0 w-32">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Customer ID:</span>
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{customer._id}</span>
              </div>
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter className="justify-center">
        <Button
          className="w-full sm:w-auto"
          onClick={onClose}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CustomerDetailsModal;

