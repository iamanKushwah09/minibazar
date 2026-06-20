import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter, Button } from "@windmill/react-ui";
import { FiPrinter, FiX, FiDownload, FiEdit3, FiEye } from "react-icons/fi";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import SaleOrderServices from "@/services/SaleOrderServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { notifyError } from "@/utils/toast";

// PDF Document Component
const InvoicePDF = ({ orderData, currency, showDateFormat, getNumber }) => {

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 20,
      fontSize: 10,
      fontFamily: 'Helvetica',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      borderBottom: 2,
      borderBottomColor: '#10B981',
      paddingBottom: 15,
    },
    companyInfo: {
      flex: 1,
    },
    companyName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#10B981',
      marginBottom: 8,
    },
    companyDetails: {
      fontSize: 8,
      color: '#2d3748',
      lineHeight: 1.3,
    },
    invoiceInfo: {
      flex: 1,
      alignItems: 'flex-end',
    },
    invoiceTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#10B981',
      marginBottom: 10,
    },
    invoiceDetails: {
      fontSize: 8,
      textAlign: 'right',
    },
    addresses: {
      flexDirection: 'row',
      marginBottom: 20,
      gap: 20,
    },
    addressSection: {
      flex: 1,
    },
    addressTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#10B981',
      borderBottom: 1,
      borderBottomColor: '#e5e7eb',
      paddingBottom: 2,
    },
    table: {
      flexDirection: 'column',
      marginBottom: 15,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottom: 1,
      borderBottomColor: '#e5e7eb',
      minHeight: 25,
      alignItems: 'center',
    },
    tableHeader: {
      backgroundColor: '#10B981',
      color: 'white',
      fontWeight: 'bold',
      fontSize: 8,
    },
    tableCell: {
      padding: 4,
      fontSize: 8,
      borderRight: 1,
      borderRightColor: '#d1d5db',
    },
    col1: { width: '12%' },
    col2: { width: '23%' },
    col9: { width: '8%' },
    col10: { width: '5%' },
    col3: { width: '5%' },
    col4: { width: '8%' },
    col5: { width: '10%' },
    col6: { width: '10%' },
    col7: { width: '9%' },
    col8: { width: '10%' },
    totalsSection: {
      alignItems: 'flex-end',
      marginBottom: 15,
    },
    totalsTable: {
      width: 200,
    },
    totalsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 2,
    },
    totalsLabel: {
      fontWeight: 'bold',
      fontSize: 9,
    },
    totalsValue: {
      fontSize: 9,
      textAlign: 'right',
    },
    grandTotal: {
      backgroundColor: '#10B981',
      color: 'white',
      fontWeight: 'bold',
      fontSize: 10,
    },
    statusSection: {
      flexDirection: 'row',
      marginBottom: 15,
      gap: 15,
    },
    statusBox: {
      flex: 1,
      border: 1,
      borderColor: '#d1d5db',
      padding: 8,
    },
    statusTitle: {
      fontWeight: 'bold',
      fontSize: 8,
      color: '#10B981',
      marginBottom: 3,
    },
    footer: {
      borderTop: 2,
      borderTopColor: '#10B981',
      paddingTop: 15,
    },
    termsTitle: {
      fontWeight: 'bold',
      fontSize: 9,
      color: '#10B981',
      marginBottom: 8,
      textTransform: 'uppercase',
    },
    termsText: {
      fontSize: 8,
      lineHeight: 1.3,
      marginBottom: 3,
    },
  });

  if (!orderData) return null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Selection Footwear</Text>
            <Text style={styles.companyDetails}>
              123 Business Street{'\n'}
              City, State 12345{'\n'}
              Phone: (555) 123-4567{'\n'}
              Email: info@selectionfootwear.com
            </Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <View style={styles.invoiceDetails}>
              <Text>Invoice No: {orderData.voucherNo || "N/A"}</Text>
              <Text>Date: {showDateFormat(orderData.date) || "N/A"}</Text>
              <Text>Due Date: {showDateFormat(orderData.dueDate || orderData.date) || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Addresses */}
        <View style={styles.addresses}>
          <View style={styles.addressSection}>
            <Text style={styles.addressTitle}>Bill To:</Text>
            <Text style={{ fontSize: 8, marginBottom: 2 }}>
              <Text style={{ fontWeight: 'bold' }}>{orderData.directCustomer?.name || orderData.customer?.name || "N/A"}</Text>
            </Text>
            <Text style={styles.companyDetails}>
              {orderData.directCustomer?.email || orderData.customer?.email || ""}{'\n'}
              {orderData.directCustomer?.mobile || orderData.customer?.mobile || ""}{'\n'}
              {orderData.directCustomer?.address || orderData.customer?.address || ""}{'\n'}
              {orderData.directCustomer?.pincode || orderData.customer?.pincode || ""}{'\n'}
              {orderData.directCustomer?.gst_no || orderData.customer?.gst_no || ""}
            </Text>
          </View>
          <View style={styles.addressSection}>
            <Text style={styles.addressTitle}>Ship To:</Text>
            <Text style={{ fontSize: 8, marginBottom: 2 }}>
              <Text style={{ fontWeight: 'bold' }}>
                {orderData.shippingAddress?.name || orderData.directCustomer?.name || orderData.customer?.name || "N/A"}
              </Text>
            </Text>
            {orderData.shippingAddress && (
              <Text style={styles.companyDetails}>
                {orderData.shippingAddress.street || ""}{'\n'}
                {orderData.shippingAddress.city || ""}, {orderData.shippingAddress.state || ""}{'\n'}
                {orderData.shippingAddress.zipCode || ""}{'\n'}
                {orderData.shippingAddress.country || ""}
              </Text>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.col1]}>HSN Code</Text>
            <Text style={[styles.tableCell, styles.col2]}>Product Name</Text>
            <Text style={[styles.tableCell, styles.col9]}>Color</Text>
            <Text style={[styles.tableCell, styles.col10]}>Size</Text>
            <Text style={[styles.tableCell, styles.col3, { textAlign: 'right' }]}>Qty</Text>
            <Text style={[styles.tableCell, styles.col4]}>Unit</Text>
            <Text style={[styles.tableCell, styles.col5, { textAlign: 'right' }]}>List Price</Text>
            <Text style={[styles.tableCell, styles.col6, { textAlign: 'right' }]}>Price</Text>
            <Text style={[styles.tableCell, styles.col7, { textAlign: 'right' }]}>Discount</Text>
            <Text style={[styles.tableCell, styles.col8, { textAlign: 'right' }]}>Amount</Text>
          </View>

          {/* Items */}
          {orderData.items?.map((item, index) => (
            <View key={item._id || index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>{item.hsn || item.itemId?.hsn_code || ""}</Text>
              <Text style={[styles.tableCell, styles.col2]}>{item.name || item.itemId?.name || ""}</Text>
              <Text style={[styles.tableCell, styles.col9]}>{item.color || ""}</Text>
              <Text style={[styles.tableCell, styles.col10]}>{item.size || ""}</Text>
              <Text style={[styles.tableCell, styles.col3, { textAlign: 'right' }]}>{item.quantity || 0}</Text>
              <Text style={[styles.tableCell, styles.col4]}>{item.unit || ""}</Text>
              <Text style={[styles.tableCell, styles.col5, { textAlign: 'right' }]}>{currency}{Number(item.listPrice || 0).toFixed(2)}</Text>
              <Text style={[styles.tableCell, styles.col6, { textAlign: 'right' }]}>{currency}{Number(item.price || 0).toFixed(2)}</Text>
              <Text style={[styles.tableCell, styles.col7, { textAlign: 'right' }]}>{currency}{Number(item.totalDiscount || 0).toFixed(2)}</Text>
              <Text style={[styles.tableCell, styles.col8, { textAlign: 'right' }]}>{currency}{Number(item.amount || 0).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsTable}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal:</Text>
              <Text style={styles.totalsValue}>{currency}{Number(orderData.totalAmount || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Total Discount:</Text>
              <Text style={styles.totalsValue}>{currency}{Number(orderData.totalDiscountAmount || 0).toFixed(2)}</Text>
            </View>
            {orderData.sundries?.SundriesDetail?.map((sundry, index) => (
              <View key={sundry._id || index} style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>{sundry.Name}:</Text>
                <Text style={styles.totalsValue}>{currency}{Number(sundry.DiscountAmount || 0).toFixed(2)}</Text>
              </View>
            ))}
            <View style={[styles.totalsRow, styles.grandTotal]}>
              <Text style={styles.totalsLabel}>Net Amount:</Text>
              <Text style={styles.totalsValue}>{currency}{Number(orderData.netAmount || 0).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Status Information */}
        <View style={styles.statusSection}>
          <View style={styles.statusBox}>
            <Text style={styles.statusTitle}>Order Status:</Text>
            <Text style={{ fontSize: 8 }}>{orderData.status || ""}</Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={styles.statusTitle}>Sale Type:</Text>
            <Text style={{ fontSize: 8 }}>{orderData.saleType?.name || ""}</Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={styles.statusTitle}>Material Centre:</Text>
            <Text style={{ fontSize: 8 }}>{orderData.matCentre || ""}</Text>
          </View>
          <View style={styles.statusBox}>
            <Text style={styles.statusTitle}>Salesman:</Text>
            <Text style={{ fontSize: 8 }}>{orderData.salesman?.name || ""}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.termsTitle}>Terms and Conditions:</Text>
          <Text style={styles.termsText}>1. Payment is due within 30 days of invoice date.</Text>
          <Text style={styles.termsText}>2. All prices are in {currency} and subject to applicable taxes.</Text>
          <Text style={styles.termsText}>3. Returns accepted within 14 days of delivery.</Text>
          <Text style={styles.termsText}>4. Damaged goods must be reported within 48 hours.</Text>
          {orderData.notes && (
            <>
              <Text style={styles.termsTitle}>Notes:</Text>
              <Text style={styles.termsText}>{orderData.notes}</Text>
            </>
          )}
        </View>
      </Page>
    </Document>
  );
};

const PrintSaleOrder = ({ isOpen, onClose, orderId }) => {
  const [orderData, setOrderData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showBorders, setShowBorders] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currency, showDateFormat, getNumber } = useUtilsFunction();

  // Helper component for editable inputs with validation
  const EditableInput = ({ value, onChange, type = "text", className = "", validation, ...props }) => {
    if (!isEditMode) {
      return <span className={className}>{value || ""}</span>;
    }

    const handleChange = (e) => {
      let newValue = e.target.value;

      if (type === "number") {
        newValue = parseFloat(newValue) || 0;
        if (validation?.min !== undefined && newValue < validation.min) {
          newValue = validation.min;
        }
        if (validation?.max !== undefined && newValue > validation.max) {
          newValue = validation.max;
        }
      }

      if (validation?.required && (!newValue || newValue.toString().trim() === "")) {
        return;
      }

      onChange(newValue);
    };

    const hasError = validation?.required && (!value || value.toString().trim() === "");

    return (
      <div className="relative">
        <input
          type={type}
          value={value || ""}
          onChange={handleChange}
          className={`w-full px-2 py-1 border rounded text-sm ${hasError ? 'border-red-500' : 'border-gray-300'} ${className}`}
          {...props}
        />
        {hasError && (
          <span className="text-red-500 text-xs absolute -bottom-4 left-0">Required</span>
        )}
      </div>
    );
  };

  const EditableTextarea = ({ value, onChange, className = "", validation, ...props }) => {
    if (!isEditMode) {
      return <span className={className}>{value || ""}</span>;
    }

    const handleChange = (e) => {
      let newValue = e.target.value;

      if (validation?.required && (!newValue || newValue.trim() === "")) {
        return;
      }

      onChange(newValue);
    };

    const hasError = validation?.required && (!value || value.toString().trim() === "");

    return (
      <div className="relative">
        <textarea
          value={value || ""}
          onChange={handleChange}
          className={`w-full px-2 py-1 border rounded text-sm ${hasError ? 'border-red-500' : 'border-gray-300'} ${className}`}
          rows="2"
          {...props}
        />
        {hasError && (
          <span className="text-red-500 text-xs absolute -bottom-4 left-0">Required</span>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderData();
    }
  }, [isOpen, orderId]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await SaleOrderServices.getSaleOrderById(orderId);

      if (response && response.success !== false) {
        const data = response.data || response;
        setOrderData(data);
        setEditableData(JSON.parse(JSON.stringify(data)));
      } else {
        throw new Error(response?.message || "Failed to fetch order data");
      }
    } catch (err) {
      console.error("Error fetching order data:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch order data");
      notifyError("Failed to load order details for printing");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value, nestedField = null) => {
    setEditableData(prev => {
      if (!prev) return prev;

      const updated = { ...prev };
      if (nestedField) {
        updated[field] = { ...updated[field], [nestedField]: value };
      } else {
        updated[field] = value;
      }

      return updated;
    });
  };

  const handleItemChange = (index, field, value) => {
    setEditableData(prev => {
      if (!prev || !prev.items) return prev;

      const updated = { ...prev };
      updated.items = [...updated.items];
      updated.items[index] = { ...updated.items[index], [field]: value };

      calculateTotals(updated);

      return updated;
    });
  };

  const addNewItem = () => {
    setEditableData(prev => {
      if (!prev) return prev;

      const updated = { ...prev };
      updated.items = [...(updated.items || []), {
        _id: `temp_${Date.now()}`,
        name: "",
        hsn: "",
        quantity: 1,
        unit: "PAIRS",
        listPrice: 0,
        price: 0,
        discount: 0,
        totalDiscount: 0,
        amount: 0,
        description: ""
      }];

      return updated;
    });
  };

  const removeItem = (index) => {
    setEditableData(prev => {
      if (!prev || !prev.items) return prev;

      const updated = { ...prev };
      updated.items = updated.items.filter((_, i) => i !== index);

      calculateTotals(updated);

      return updated;
    });
  };

  const calculateTotals = (data) => {
    if (!data.items) return;

    const subtotal = data.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalDiscount = data.items.reduce((sum, item) => sum + (Number(item.totalDiscount) || 0), 0);

    data.totalAmount = subtotal;
    data.totalDiscountAmount = totalDiscount;

    let sundriesTotal = 0;
    if (data.sundries?.SundriesDetail) {
      sundriesTotal = data.sundries.SundriesDetail.reduce((sum, sundry) =>
        sum + (Number(sundry.DiscountAmount) || 0), 0);
    }

    data.netAmount = subtotal - totalDiscount + sundriesTotal;
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return `${currency}0.00`;
    return `${currency}${Number(amount).toFixed(2)}`;
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printable-invoice");
    if (!printContent) return;

    const dataToPrint = isEditMode ? editableData : orderData;
    if (!dataToPrint) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      notifyError("Please allow popups for printing");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - ${dataToPrint?.voucherNo || "Order"}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              font-size: 10px !important;
            }
            
            .no-print {
              display: none !important;
            }
            
            .invoice-container {
              max-width: none;
              margin: 0;
              padding: 15px;
              border: none !important;
            }
            
            .layout-guides,
            .layout-guides * {
              border: none !important;
            }
            
            .layout-guides::before {
              display: none !important;
            }
            
            .invoice-header {
              page-break-inside: avoid;
              flex-direction: row !important;
            }
            
            .addresses {
              page-break-inside: avoid;
              flex-direction: row !important;
              gap: 20px !important;
            }
            
            .items-table {
              page-break-inside: auto;
              font-size: 9px !important;
            }
            
            .items-table th,
            .items-table td {
              padding: 6px 4px !important;
              font-size: 9px !important;
            }
            
            .items-table tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            
            .totals-section {
              page-break-inside: avoid;
            }
            
            .status-section {
              page-break-inside: avoid;
              flex-direction: row !important;
              gap: 15px !important;
            }
            
            .footer {
              page-break-inside: avoid;
            }
          }
          
          body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: white;
          }
          
          .invoice-container {
            width: 100%;
            max-width: none;
            margin: 0 auto;
            padding: 20px;
            background: white;
          }
          
          .layout-guides {
            border: 2px dashed #3B82F6 !important;
            position: relative;
          }
          
          .layout-guides::before {
            content: "Layout Guide - Toggle off for clean print";
            position: absolute;
            top: -25px;
            left: 0;
            background: #3B82F6;
            color: white;
            padding: 2px 8px;
            font-size: 10px;
            border-radius: 3px;
            z-index: 1000;
          }
          
          .layout-guides .invoice-header {
            border: 1px dashed #EF4444 !important;
            margin-bottom: 15px !important;
          }
          
          .layout-guides .addresses {
            border: 1px dashed #10B981 !important;
            margin-bottom: 15px !important;
            padding: 10px !important;
          }
          
          .layout-guides .items-table {
            border: 2px dashed #F59E0B !important;
          }
          
          .layout-guides .items-table th {
            border: 1px dashed #DC2626 !important;
          }
          
          .layout-guides .items-table td {
            border: 1px dashed #6B7280 !important;
          }
          
          .layout-guides .totals-section {
            border: 1px dashed #8B5CF6 !important;
            padding: 10px !important;
          }
          
          .layout-guides .status-section {
            border: 1px dashed #06B6D4 !important;
            padding: 10px !important;
          }
          
          .layout-guides .footer {
            border: 1px dashed #84CC16 !important;
            padding: 10px !important;
          }
          
          /* Responsive Design for Print */
          @media screen and (max-width: 768px) {
            .invoice-header {
              flex-direction: column !important;
              gap: 15px !important;
            }
            
            .addresses {
              flex-direction: column !important;
              gap: 15px !important;
            }
            
            .status-section {
              flex-direction: column !important;
              gap: 10px !important;
            }
            
            .items-table {
              font-size: 10px !important;
            }
            
            .items-table th,
            .items-table td {
              padding: 4px 2px !important;
              font-size: 10px !important;
            }
          }
          
          /* Desktop Styles */
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 3px solid #10B981;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .company-info {
            flex: 1;
          }
          
          .company-logo {
            max-width: 150px;
            height: auto;
            margin-bottom: 10px;
          }
          
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #10B981;
            margin-bottom: 8px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
          }
          
          .company-details {
            font-size: 12px;
            color: #2d3748;
            line-height: 1.5;
          }
          
          .invoice-info {
            text-align: right;
            flex: 1;
          }
          
          .invoice-title {
            font-size: 32px;
            font-weight: bold;
            color: #10B981;
            margin-bottom: 15px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            text-align: center;
          }
          
          .invoice-details {
            text-align: left;
          }
          
          .invoice-details p {
            margin-bottom: 5px;
            font-size: 12px;
            color: #2d3748;
          }
          
          .addresses {
            display: flex;
            gap: 30px;
            margin-bottom: 30px;
          }
          
          .address-section {
            flex: 1;
          }
          
          .address-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #10B981;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 3px;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 11px;
          }
          
          .items-table th {
            background-color: #10B981;
            color: white;
            padding: 8px;
            text-align: left;
            border: 1px solid #059669;
          }
          
          .items-table td {
            padding: 8px;
            border: 1px solid #d1d5db;
          }
          
          .items-table tr:nth-child(even) {
            background-color: #f9fafb;
          }
          
          .items-table .text-right {
            text-align: right;
          }
          
          .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
          }
          
          .totals-table {
            width: 300px;
          }
          
          .totals-table tr td {
            padding: 5px 10px;
            border: none;
          }
          
          .totals-table .label {
            text-align: right;
            font-weight: bold;
          }
          
          .totals-table .value {
            text-align: right;
            width: 100px;
          }
          
          .grand-total {
            background-color: #10B981;
            color: white;
            font-weight: bold;
            font-size: 14px;
          }
          
          .status-section {
            display: flex;
            gap: 30px;
            margin-bottom: 20px;
          }
          
          .status-box {
            flex: 1;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
          }
          
          .status-title {
            font-weight: bold;
            margin-bottom: 5px;
            color: #10B981;
          }
          
          .footer {
            border-top: 3px solid #10B981;
            padding: 20px;
            margin-top: 30px;
            background-color: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .terms {
            margin-bottom: 10px;
          }
          
          .terms-title {
            font-weight: bold;
            margin-bottom: 10px;
            margin-top: 10px;
            color: #10B981;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (!isOpen) return null;

  const dataToRender = isEditMode ? editableData : orderData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-full w-full mx-2 sm:mx-4 lg:mx-8"
    >
      <ModalBody className="custom-modal max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Responsive */}
        <div className="no-print flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-3 sm:p-4 rounded-t-lg border-b border-gray-200 gap-3">
          <h2 className="text-lg sm:text-xl font-semibold">Print Invoice</h2>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              onClick={() => setShowBorders(!showBorders)}
              className={`${showBorders ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-600 hover:bg-gray-700'} text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2`}
              disabled={loading || error || !orderData}
            >
              {showBorders ? 'Hide Layout Guides' : 'Show Layout Guides'}
            </Button>
            <Button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`${isEditMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2`}
              disabled={loading || error || !orderData}
            >
              {isEditMode ? <><FiEye className="w-3 h-3 mr-1" />View</> : <><FiEdit3 className="w-3 h-3 mr-1" />Edit</>} Mode
            </Button>
          </div>
        </div>

        {/* Content - Responsive */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex justify-center items-center h-32 sm:h-64">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-green-600"></div>
              <span className="ml-3 text-sm sm:text-base">Loading order details...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiX className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading order</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && !orderData && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm sm:text-base">No order data found.</p>
            </div>
          )}

          {dataToRender && (
            <div id="printable-invoice" className={`invoice-container bg-white w-full ${showBorders ? 'layout-guides' : ''} p-2 sm:p-4 lg:p-6`}>
              {/* Invoice Header - Responsive */}
              <div className="invoice-header flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="company-info">
                  <div className="company-name text-xl sm:text-2xl lg:text-3xl">Selection Footwear</div>
                  <div className="company-details text-xs sm:text-sm">
                    <p>123 Business Street</p>
                    <p>City, State 12345</p>
                    <p>Phone: (555) 123-4567</p>
                    <p>Email: info@selectionfootwear.com</p>
                  </div>
                </div>

                <div className="invoice-info sm:text-right">
                  <div className="invoice-title text-2xl sm:text-3xl lg:text-4xl">INVOICE</div>
                  <div className="invoice-details text-xs sm:text-sm">
                    <p><strong>Invoice No:</strong> <EditableInput value={isEditMode ? editableData.voucherNo : orderData.voucherNo} onChange={(value) => handleFieldChange('voucherNo', value)} /></p>
                    <p><strong>Date:</strong> <EditableInput value={showDateFormat(isEditMode ? editableData.date : orderData.date)} onChange={(value) => handleFieldChange('date', value)} type="date" /></p>
                    <p><strong>Due Date:</strong> <EditableInput value={showDateFormat((isEditMode ? editableData.dueDate : orderData.dueDate) || (isEditMode ? editableData.date : orderData.date))} onChange={(value) => handleFieldChange('dueDate', value)} type="date" /></p>
                  </div>
                </div>
              </div>

              {/* Customer Information - Responsive */}
              <div className="addresses flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
                <div className="address-section">
                  <div className="address-title text-sm sm:text-base">Bill To:</div>
                  <div className="text-xs sm:text-sm">
                    <p><strong><EditableInput value={isEditMode ? (editableData.directCustomer?.name || editableData.customer?.name) : (orderData.directCustomer?.name || orderData.customer?.name)} onChange={(value) => handleFieldChange(editableData.directCustomer ? 'directCustomer' : 'customer', value, 'name')} /></strong></p>
                    <EditableInput value={isEditMode ? (editableData.directCustomer?.email || editableData.customer?.email) : (orderData.directCustomer?.email || orderData.customer?.email)} onChange={(value) => handleFieldChange(editableData.directCustomer ? 'directCustomer' : 'customer', value, 'email')} placeholder="Email" />
                    <EditableInput value={isEditMode ? (editableData.directCustomer?.mobile || editableData.customer?.mobile) : (orderData.directCustomer?.mobile || orderData.customer?.mobile)} onChange={(value) => handleFieldChange(editableData.directCustomer ? 'directCustomer' : 'customer', value, 'mobile')} placeholder="Mobile" />
                    <EditableTextarea value={isEditMode ? (editableData.directCustomer?.address || editableData.customer?.address) : (orderData.directCustomer?.address || orderData.customer?.address)} onChange={(value) => handleFieldChange(editableData.directCustomer ? 'directCustomer' : 'customer', value, 'address')} placeholder="Address" />
                    <EditableInput value={isEditMode ? (editableData.directCustomer?.pincode || editableData.customer?.pincode) : (orderData.directCustomer?.pincode || orderData.customer?.pincode)} onChange={(value) => handleFieldChange(editableData.directCustomer ? 'directCustomer' : 'customer', value, 'pincode')} placeholder="Pincode" />
                    <EditableInput value={isEditMode ? (editableData.directCustomer?.gst_no || editableData.customer?.gst_no) : (orderData.directCustomer?.gst_no || orderData.customer?.gst_no)} onChange={(value) => handleFieldChange(editableData.directCustomer ? 'directCustomer' : 'customer', value, 'gst_no')} placeholder="GST Number" />
                  </div>
                </div>

                <div className="address-section">
                  <div className="address-title text-sm sm:text-base">Ship To:</div>
                  <div className="text-xs sm:text-sm">
                    <p><strong>{orderData.shippingAddress?.name || orderData.directCustomer?.name || orderData.customer?.name}</strong></p>
                    {orderData.shippingAddress && (
                      <div>
                        <p>{orderData.shippingAddress.street}</p>
                        <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.state}</p>
                        <p>{orderData.shippingAddress.zipCode}</p>
                        <p>{orderData.shippingAddress.country}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Table - Responsive */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4 gap-2">
                  <h3 className="text-base sm:text-lg font-semibold">Items</h3>
                  {isEditMode && (
                    <Button onClick={addNewItem} className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 w-full sm:w-auto">
                      Add Item
                    </Button>
                  )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <table className="items-table w-full">
                    <thead>
                      <tr>
                        <th>HSN Code</th>
                        <th>Product Name</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th className="text-right">Qty</th>
                        <th className="text-right">Unit</th>
                        <th className="text-right">List Price</th>
                        <th className="text-right">Price</th>
                        <th className="text-right">Discount</th>
                        <th className="text-right">Amount</th>
                        {isEditMode && <th className="text-center">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {(isEditMode ? editableData?.items : orderData?.items)?.map((item, index) => (
                        <tr key={item._id || index}>
                          <td>
                            <EditableInput
                              value={item.hsn || item.itemId?.hsn_code}
                              onChange={(value) => handleItemChange(index, 'hsn', value)}
                              className="w-20"
                            />
                          </td>
                          <td>
                            <EditableInput
                              value={item.name || item.itemId?.name}
                              onChange={(value) => handleItemChange(index, 'name', value)}
                              className="w-48"
                            />
                          </td>
                          <td>
                            <EditableInput
                              value={item.color}
                              onChange={(value) => handleItemChange(index, 'color', value)}
                              className="w-16"
                            />
                          </td>
                          <td>
                            <EditableInput
                              value={item.size}
                              onChange={(value) => handleItemChange(index, 'size', value)}
                              className="w-12"
                            />
                          </td>
                          <td className="text-right">
                            <EditableInput
                              value={item.quantity}
                              onChange={(value) => handleItemChange(index, 'quantity', value)}
                              type="number"
                              className="w-16"
                            />
                          </td>
                          <td>
                            <EditableInput
                              value={item.unit}
                              onChange={(value) => handleItemChange(index, 'unit', value)}
                              className="w-20"
                            />
                          </td>
                          <td className="text-right">
                            <EditableInput
                              value={item.listPrice}
                              onChange={(value) => handleItemChange(index, 'listPrice', value)}
                              type="number"
                              className="w-20"
                            />
                          </td>
                          <td className="text-right">
                            <EditableInput
                              value={item.price}
                              onChange={(value) => handleItemChange(index, 'price', value)}
                              type="number"
                              className="w-20"
                            />
                          </td>
                          <td className="text-right">
                            <EditableInput
                              value={item.totalDiscount}
                              onChange={(value) => handleItemChange(index, 'totalDiscount', value)}
                              type="number"
                              className="w-20"
                            />
                          </td>
                          <td className="text-right">
                            <EditableInput
                              value={item.amount}
                              onChange={(value) => handleItemChange(index, 'amount', value)}
                              type="number"
                              className="w-20"
                            />
                          </td>
                          {isEditMode && (
                            <td className="text-center">
                              <Button
                                onClick={() => removeItem(index)}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1"
                              >
                                Remove
                              </Button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                  {(isEditMode ? editableData?.items : orderData?.items)?.map((item, index) => (
                    <div key={item._id || index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><strong>HSN:</strong> <EditableInput value={item.hsn || item.itemId?.hsn_code} onChange={(value) => handleItemChange(index, 'hsn', value)} className="w-full" /></div>
                        <div><strong>Qty:</strong> <EditableInput value={item.quantity} onChange={(value) => handleItemChange(index, 'quantity', value)} type="number" className="w-full" /></div>
                        <div className="col-span-2"><strong>Name:</strong> <EditableInput value={item.name || item.itemId?.name} onChange={(value) => handleItemChange(index, 'name', value)} className="w-full" /></div>
                        <div><strong>Unit:</strong> <EditableInput value={item.unit} onChange={(value) => handleItemChange(index, 'unit', value)} className="w-full" /></div>
                        <div><strong>Price:</strong> <EditableInput value={item.price} onChange={(value) => handleItemChange(index, 'price', value)} type="number" className="w-full" /></div>
                        <div><strong>Discount:</strong> <EditableInput value={item.totalDiscount} onChange={(value) => handleItemChange(index, 'totalDiscount', value)} type="number" className="w-full" /></div>
                        <div><strong>Amount:</strong> <EditableInput value={item.amount} onChange={(value) => handleItemChange(index, 'amount', value)} type="number" className="w-full" /></div>
                      </div>
                      {isEditMode && (
                        <div className="mt-3 pt-2 border-t border-gray-200">
                          <Button
                            onClick={() => removeItem(index)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 w-full"
                          >
                            Remove Item
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals - Responsive */}
              <div className="totals-section flex justify-end mb-4 sm:mb-6">
                <div className="w-full sm:w-80 lg:w-96">
                  <table className="totals-table w-full">
                    <tbody>
                      <tr>
                        <td className="label text-sm sm:text-base">Subtotal:</td>
                        <td className="value text-sm sm:text-base">
                          <EditableInput
                            value={isEditMode ? editableData.totalAmount : orderData.totalAmount}
                            onChange={(value) => handleFieldChange('totalAmount', value)}
                            type="number"
                            className="text-right w-full"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="label text-sm sm:text-base">Total Discount:</td>
                        <td className="value text-sm sm:text-base">
                          <EditableInput
                            value={isEditMode ? editableData.totalDiscountAmount : orderData.totalDiscountAmount}
                            onChange={(value) => handleFieldChange('totalDiscountAmount', value)}
                            type="number"
                            className="text-right w-full"
                          />
                        </td>
                      </tr>
                      {isEditMode && editableData.sundries?.SundriesDetail?.map((sundry, index) => (
                        <tr key={sundry._id || index}>
                          <td className="label text-sm sm:text-base">
                            <EditableInput
                              value={sundry.Name}
                              onChange={(value) => {
                                const updated = { ...editableData };
                                updated.sundries.SundriesDetail[index].Name = value;
                                setEditableData(updated);
                              }}
                              className="w-24 text-sm"
                            />:
                          </td>
                          <td className="value text-sm sm:text-base">
                            <EditableInput
                              value={sundry.DiscountAmount}
                              onChange={(value) => {
                                const updated = { ...editableData };
                                updated.sundries.SundriesDetail[index].DiscountAmount = value;
                                setEditableData(updated);
                              }}
                              type="number"
                              className="text-right w-full"
                            />
                          </td>
                        </tr>
                      ))}
                      {!isEditMode && orderData.sundries?.SundriesDetail?.map((sundry, index) => (
                        <tr key={sundry._id || index}>
                          <td className="label text-sm sm:text-base">{sundry.Name}:</td>
                          <td className="value text-sm sm:text-base">{formatCurrency(sundry.DiscountAmount)}</td>
                        </tr>
                      ))}
                      <tr className="grand-total">
                        <td className="label text-sm sm:text-base">Net Amount:</td>
                        <td className="value text-sm sm:text-base font-bold">
                          <EditableInput
                            value={isEditMode ? editableData.netAmount : orderData.netAmount}
                            onChange={(value) => handleFieldChange('netAmount', value)}
                            type="number"
                            className="text-right w-full font-bold"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Information - Responsive */}
              <div className="status-section flex flex-col lg:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="status-box flex-1">
                  <div className="status-title text-sm sm:text-base">Order Status:</div>
                  <EditableInput
                    value={isEditMode ? editableData.status : orderData.status}
                    onChange={(value) => handleFieldChange('status', value)}
                    placeholder="Status"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="status-box flex-1">
                  <div className="status-title text-sm sm:text-base">Sale Type:</div>
                  <EditableInput
                    value={isEditMode ? editableData.saleType?.name : orderData.saleType?.name}
                    onChange={(value) => handleFieldChange('saleType', { ...editableData.saleType, name: value }, 'name')}
                    placeholder="Sale Type"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="status-box flex-1">
                  <div className="status-title text-sm sm:text-base">Material Centre:</div>
                  <EditableInput
                    value={isEditMode ? editableData.matCentre : orderData.matCentre}
                    onChange={(value) => handleFieldChange('matCentre', value)}
                    placeholder="Material Centre"
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="status-box flex-1">
                  <div className="status-title text-sm sm:text-base">Salesman:</div>
                  <EditableInput
                    value={isEditMode ? editableData.salesman?.name : orderData.salesman?.name}
                    onChange={(value) => handleFieldChange('salesman', { ...editableData.salesman, name: value }, 'name')}
                    placeholder="Salesman"
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Terms and Conditions - Responsive */}
              <div className="footer">
                <div className="terms">
                  <div className="terms-title text-sm sm:text-base">Terms and Conditions:</div>
                  <div className="text-xs sm:text-sm space-y-1">
                    <p>1. Payment is due within 30 days of invoice date.</p>
                    <p>2. All prices are in {currency} and subject to applicable taxes.</p>
                    <p>3. Returns accepted within 14 days of delivery.</p>
                    <p>4. Damaged goods must be reported within 48 hours.</p>
                  </div>
                </div>

                {orderData.notes && (
                  <div className="mt-4">
                    <div className="terms-title text-sm sm:text-base">Notes:</div>
                    <p className="text-xs sm:text-sm">{orderData.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ModalBody>

      {/* Footer - Responsive */}
      <ModalFooter className="no-print justify-center border-t border-gray-200 mt-4 sm:mt-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          {dataToRender && (
            <PDFDownloadLink
              document={<InvoicePDF orderData={dataToRender} currency={currency} showDateFormat={showDateFormat} getNumber={getNumber} />}
              fileName={`invoice-${dataToRender.voucherNo || 'order'}.pdf`}
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out text-sm sm:text-base"
            >
              {({ loading: pdfLoading }) => (
                pdfLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating PDF...
                  </div>
                ) : (
                  <>
                    <FiDownload className="w-4 h-4 mr-2" />
                    Download PDF
                  </>
                )
              )}
            </PDFDownloadLink>
          )}

          <Button
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base py-2 px-4 w-full sm:w-auto"
            disabled={loading || error || !orderData}
          >
            <FiPrinter className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>

          <Button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white text-sm sm:text-base py-2 px-4 w-full sm:w-auto"
          >
            <FiX className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default PrintSaleOrder;