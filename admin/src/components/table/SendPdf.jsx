import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiShare2 } from "react-icons/fi";
import { Button } from "@windmill/react-ui";
import VendorSelectionDrawer from "@/components/drawer/VendorSelectionDrawer";
import WhatsAppMessagingService from "@/services/WhatsAppMessagingService";
import { notifySuccess, notifyError } from "@/utils/toast";

const SendPdf = ({ catalogData }) => {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSendPdf = async (selectedVendors, phoneNumbers, catalogData) => {
    try {
      // Send PDF information to vendors via WhatsApp
      const result = await WhatsAppMessagingService.sendPdfToVendors(phoneNumbers, catalogData);
      
      if (result.success) {
        const successCount = result.results.filter(r => r.success).length;
        notifySuccess(`Catalog information sent to ${successCount} vendors via WhatsApp`);
        
        // Open WhatsApp links in new tabs for successful sends
        result.results.forEach(result => {
          if (result.success && result.whatsappUrl) {
            window.open(result.whatsappUrl, '_blank');
          }
        });
      } else {
        notifyError("Failed to send catalog information");
      }
    } catch (error) {
      console.error("Error sending PDF:", error);
      notifyError("Failed to send catalog information");
    }
  };

  return (
    <>
      <Button
        layout="primary"
        onClick={() => setIsDrawerOpen(true)}
        className="w-full flex items-center justify-center gap-2"
      >
        <FiShare2 /> Share PDF
      </Button>
      
      <VendorSelectionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        catalogData={catalogData}
        onSendPdf={handleSendPdf}
      />
    </>
  );
};

export default SendPdf;
