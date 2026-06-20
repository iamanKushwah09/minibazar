import React, { useContext, useMemo, useState } from "react";
import { Modal, ModalBody, ModalFooter, Button } from "@windmill/react-ui";
import { FiExternalLink, FiShare2, FiDownload } from "react-icons/fi";
import { SidebarContext } from "@/context/SidebarContext";
import SendPdf from "@/components/table/SendPdf";
import { downloadPDF, viewPDF, generateCatalogFilename } from "@/utils/pdfUtils";

const CatalogModel = () => {
  const { isModalOpen, closeModal, modalData } = useContext(SidebarContext);

  const pdfUrl = modalData?.pdfUrl;
  const catalogData = modalData?.catalogData;

  const isShareEnabled = useMemo(() => !!catalogData, [catalogData]);

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      const filename = generateCatalogFilename(catalogData);
      downloadPDF(pdfUrl, filename);
    }
  };

  const handleViewPDF = () => {
    if (pdfUrl) {
      viewPDF(pdfUrl);
    }
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalBody className="custom-modal px-8 pt-6 pb-4">
          <h2 className="text-xl font-medium mb-4">Catalog Ready</h2>
          <div className="space-y-3">
            {pdfUrl ? (
              <>
                <Button
                  layout="outline"
                  onClick={handleViewPDF}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <FiExternalLink /> View PDF
                </Button>
              </>
            ) : (
              <p className="text-gray-500">Generating PDF link...</p>
            )}

            <div className="mt-4">
              {isShareEnabled ? (
                <SendPdf catalogData={catalogData} />
              ) : (
                <p className="text-gray-500 inline-flex items-center gap-2">
                  <FiShare2 /> Share options will appear once data is ready
                </p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="justify-end">
          <Button layout="outline" onClick={closeModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

    </>
  );
};

export default React.memo(CatalogModel);
