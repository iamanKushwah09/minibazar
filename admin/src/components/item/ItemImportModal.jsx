import React, { useState, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Select } from '@windmill/react-ui';
import { FiUploadCloud, FiDownload } from 'react-icons/fi';
import Papa from 'papaparse';
import ItemServices from '@/services/ItemServices';
import { notifyError, notifySuccess } from '@/utils/toast';

const expectedColumns = [
  { key: "name", label: "Product Name" },
  { key: "alias", label: "Alias" },
  { key: "print_name", label: "Print Name" },
  { key: "category", label: "Category" },
  { key: "item_group", label: "Item Group" },
  { key: "brand", label: "Brand/Company" },
  { key: "unit", label: "Unit" },
  { key: "sale_price", label: "Sale Price" },
  { key: "mrp", label: "MRP" },
  { key: "stock", label: "Stock" },
  { key: "tax_gst", label: "Tax GST (%)" },
  { key: "hsn_code", label: "HSN Code" },
  { key: "discount", label: "Discount" },
  { key: "short_description", label: "Short Description" },
  { key: "item_code", label: "Item Code" }
];

const ItemImportModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importStats, setImportStats] = useState({ created: 0, updated: 0 });
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.meta.fields) {
            setCsvHeaders(results.meta.fields);
            
            // Auto-map if names match approximately
            const initialMapping = {};
            expectedColumns.forEach(expCol => {
              const match = results.meta.fields.find(
                h => h.toLowerCase() === expCol.key.toLowerCase() || h.toLowerCase() === expCol.label.toLowerCase()
              );
              if (match) {
                initialMapping[expCol.key] = match;
              } else {
                initialMapping[expCol.key] = "";
              }
            });
            setMapping(initialMapping);
            setCsvData(results.data);
            setStep(2);
          }
        },
        error: (error) => {
          notifyError('Error reading CSV file');
        }
      });
    }
  };

  const handleMappingChange = (expectedKey, csvHeader) => {
    setMapping(prev => ({
      ...prev,
      [expectedKey]: csvHeader
    }));
  };

  const handleImport = async () => {
    try {
      setLoading(true);
      setStep(3); // Moving to progress step
      setProgress(0);
      setImportStats({ created: 0, updated: 0 });
      
      // Transform data based on mapping
      const payload = csvData.map(row => {
        const item = {};
        expectedColumns.forEach(col => {
          const csvCol = mapping[col.key];
          if (csvCol && csvCol !== 'IGNORE') {
            item[col.key] = row[csvCol];
          }
        });
        return item;
      });

      // Chunk size for batching requests
      const CHUNK_SIZE = 50;
      let totalCreated = 0;
      let totalUpdated = 0;

      for (let i = 0; i < payload.length; i += CHUNK_SIZE) {
        const chunk = payload.slice(i, i + CHUNK_SIZE);
        const res = await ItemServices.importItems(chunk);
        
        totalCreated += res.importedCount || 0;
        totalUpdated += res.updatedCount || 0;
        
        setImportStats({ created: totalCreated, updated: totalUpdated });
        
        // Update progress percentage
        const currentProgress = Math.min(100, Math.round(((i + chunk.length) / payload.length) * 100));
        setProgress(currentProgress);
      }

      notifySuccess(`Import successful. Created: ${totalCreated}, Updated: ${totalUpdated}`);
      onSuccess();
      
      // Wait a moment before closing to show 100% completion
      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to import items";
      notifyError(errorMessage);
      setStep(2); // Go back to step 2 on error
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing while importing
    setFile(null);
    setCsvData([]);
    setCsvHeaders([]);
    setMapping({});
    setStep(1);
    setProgress(0);
    setImportStats({ created: 0, updated: 0 });
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const downloadSampleCsv = () => {
    const headers = expectedColumns.map(col => col.key).join(",");
    const sampleRow = "Sample Item,SampleAlias,SamplePrint,Shoes,MensFootwear,Nike,Pieces,100,120,50,18,6403,10,Great shoes,1001";
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${sampleRow}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "item_import_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalHeader>Import Items</ModalHeader>
      <ModalBody>
        {step === 1 && (
          <div className="flex flex-col gap-6 mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please upload a CSV file containing your items. Ensure it includes columns for Product, unit, Value, MRP, and company.
            </p>
            
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-blue-500 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors w-full sm:w-auto"
              >
                <FiUploadCloud className="text-xl" />
                <span className="font-semibold">Select CSV File</span>
              </button>
              
              <button
                type="button"
                onClick={downloadSampleCsv}
                className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700 underline"
              >
                <FiDownload />
                Download Sample
              </button>
            </div>

            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4 mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Map the columns from your CSV file to the expected fields.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[50vh] pr-2">
              {expectedColumns.map(col => (
                <div key={col.key} className="flex flex-col gap-1">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {col.label} {col.key === 'name' && <span className="text-red-500">*</span>}
                  </div>
                  <Select
                    className="w-full text-sm"
                    value={mapping[col.key]}
                    onChange={(e) => handleMappingChange(col.key, e.target.value)}
                  >
                    <option value="">-- Select Column --</option>
                    <option value="IGNORE">-- Ignore --</option>
                    {csvHeaders.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>
            
            {(!mapping.name) && (
              <p className="text-sm text-red-500 mt-2">Product Name must be mapped to continue.</p>
            )}
            
            <p className="text-sm mt-4 dark:text-gray-300">
              Total rows to import: <strong>{csvData.length}</strong>
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4 mt-4 items-center justify-center py-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {progress < 100 ? "Importing Items..." : "Import Complete!"}
            </h3>
            
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 overflow-hidden relative">
              <div 
                className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {progress}%
            </p>
            
            <div className="flex gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Created: <strong>{importStats.created}</strong></span>
              <span>Updated: <strong>{importStats.updated}</strong></span>
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button className="w-full sm:w-auto" layout="outline" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        {step === 2 && (
          <Button 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={handleImport}
            disabled={loading || !mapping.name}
          >
            {loading ? "Importing..." : "Confirm Import"}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default ItemImportModal;
