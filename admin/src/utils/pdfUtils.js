// PDF utility functions for catalog downloads

/**
 * Download PDF from a URL
 * @param {string} pdfUrl - The URL of the PDF to download
 * @param {string} filename - Optional filename for the download
 */
export const downloadPDF = (pdfUrl, filename = 'catalog-products.pdf') => {
  if (!pdfUrl) {
    console.error('PDF URL is required');
    return;
  }

  // Method: Generate PDF directly from current page content
  try {
    // First, open the PDF URL in the same tab (if not already on the page)
    if (window.location.href !== pdfUrl) {
      window.location.href = pdfUrl;
      return;
    }

    // If already on the PDF page, generate the PDF directly
    setTimeout(() => {
      generateDirectPDFFromPage(filename);
    }, 500);

  } catch (error) {
    console.error('Error with direct PDF generation:', error);
    
    // Fallback: Open print dialog
    window.print();
  }
};

const generateDirectPDFFromPage = (filename) => {
  try {
    // Check if html2pdf is available
    if (typeof html2pdf === 'undefined') {
      console.warn('html2pdf library not available, using fallback');
      window.print();
      return;
    }

    // Create a wrapper for only the content we want (title + product cards)
    const contentContainer = document.createElement('div');
    const title = document.querySelector('h4');
    const productCards = document.querySelector('.container');
    
    if (!title || !productCards) {
      console.error('Required elements not found for PDF generation');
      window.print();
      return;
    }
    
    // Clone the content we want to capture
    contentContainer.appendChild(title.cloneNode(true));
    contentContainer.appendChild(productCards.cloneNode(true));
    
    // Style the wrapper to match the original design
    contentContainer.style.background = '#CAC531';
    contentContainer.style.background = '-webkit-linear-gradient(to right, #F3F9A7, #CAC531)';
    contentContainer.style.background = 'linear-gradient(to right, #F3F9A7, #CAC531)';
    contentContainer.style.fontFamily = 'Arial, sans-serif';
    contentContainer.style.padding = '20px';
    contentContainer.style.margin = '0 auto';
    contentContainer.style.maxWidth = '1000px';
    
    const opt = {
      margin: 0.5,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: null
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait',
        compress: true
      }
    };
    
    // Generate and download PDF directly
    html2pdf().set(opt).from(contentContainer).save();
    
    console.log('Direct PDF download initiated successfully');
    
  } catch (error) {
    console.error('Error generating direct PDF:', error);
    // Fallback: use print dialog
    window.print();
  }
};

/**
 * Fallback method using fetch and blob
 * @param {string} pdfUrl - The URL of the PDF to download
 * @param {string} filename - Optional filename for the download
 */
const fallbackDownloadPDF = async (pdfUrl, filename) => {
  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    console.log('PDF downloaded successfully using fallback method');
  } catch (error) {
    console.error('Error with fallback download method:', error);
    
    // Final fallback: Use browser's print-to-PDF functionality
    console.log('Opening print dialog as final fallback');
    window.print();
  }
};

/**
 * View PDF in a new window/tab
 * @param {string} pdfUrl - The URL of the PDF to view
 * @param {object} windowOptions - Optional window features
 */
export const viewPDF = (pdfUrl, windowOptions = 'width=800,height=600,resizable=yes,scrollbars=yes') => {
  if (!pdfUrl) {
    console.error('PDF URL is required');
    return;
  }

  window.open(pdfUrl, 'PDFWindow', windowOptions);
};

/**
 * Get catalog PDF URL based on catalog data
 * @param {object} catalogData - The catalog data object
 * @returns {string} - The PDF URL
 */
export const getCatalogPDFUrl = (catalogData) => {
  if (!catalogData) {
    return null;
  }

  // This would typically construct the PDF URL based on the catalog parameters
  // For now, we'll assume the PDF URL is already available in the catalog data
  return catalogData.pdfUrl || null;
};

/**
 * Generate filename for catalog download
 * @param {object} catalogData - The catalog data object
 * @returns {string} - Generated filename
 */
export const generateCatalogFilename = (catalogData) => {
  if (!catalogData) {
    return 'catalog-products.pdf';
  }

  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const catalogName = catalogData.catalog_name || 'catalog';
  const safeName = catalogName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  
  return `${safeName}-${timestamp}.pdf`;
};

export default {
  downloadPDF,
  viewPDF,
  getCatalogPDFUrl,
  generateCatalogFilename,
};