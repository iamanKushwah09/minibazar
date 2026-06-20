const WhatsAppConfig = require("../models/WhatsappSetting.model");

// @route POST /api/whatsapp-config
exports.createWhatsappSetting = async (req, res) => {
    try {
        const { whatsappUrl, requestMethod, header, params } = req.body;

        if (!whatsappUrl) {
            return res.status(400).json({ message: "WhatsApp URL is required." });
        }

        if (!requestMethod || !['GET', 'POST'].includes(requestMethod)) {
            return res.status(400).json({ message: "Valid request method (GET or POST) is required." });
        }

        // if (!Array.isArray(header) || header.some(p => !p.id || !p.value)) {
        //     return res.status(400).json({ message: "Each header must have id and value." });
        // }

        if (!Array.isArray(params) || params.some(p => !p.id || !p.value)) {
            return res.status(400).json({ message: "Each param must have id and value." });
        }

        const newConfig = new WhatsAppConfig({
            whatsappUrl,
            requestMethod,
            header,
            params,
        });

        const saved = await newConfig.save();
        res.status(201).json({ message: "Data saved", data: saved });
    } catch (err) {
        console.error("Error saving WhatsApp config:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getWhatsappSettings = async (req, res) => {
    try {
        const settings = await WhatsAppConfig.find();
        console.log("getWhatsappSetting controller is called ")
        res.status(200).json(settings);
    }
    catch (err) {
        console.error("Error fetching WhatsApp settings:", err);
        res.status(500).json({ message: "Server error" });
    }
}

// Send catalog information to vendors via WhatsApp
exports.sendCatalogToVendors = async (req, res) => {
    try {
        const { phoneNumbers, catalogData } = req.body;

        if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
            return res.status(400).json({ message: "Phone numbers are required" });
        }

        if (!catalogData) {
            return res.status(400).json({ message: "Catalog data is required" });
        }

        // Fetch the WhatsApp settings from the database
        const whatsappSettings = await WhatsAppConfig.findOne();
        if (!whatsappSettings) {
            return res.status(400).json({ message: "WhatsApp settings not configured" });
        }

        // Prepare the message
        const message = `📋 *Catalog PDF Available*\n\n` +
            `*Item Groups:* ${catalogData?.item_group_id?.map(item => item.name).join(', ') || 'N/A'}\n` +
            `*Categories:* ${catalogData?.category_id?.map(item => item.name).join(', ') || 'N/A'}\n` +
            `*Sale Price:* ${catalogData?.sale_price || 'N/A'}\n` +
            `*Description:* ${catalogData?.description || 'N/A'}\n\n` +
            `View the complete catalog PDF for more details.`;

        // Generate WhatsApp URLs for each phone number using the configured URL
        const results = phoneNumbers.map(phoneNumber => {
            try {
                const formattedPhone = phoneNumber.replace(/\s+/g, '');
                const whatsappUrl = `${whatsappSettings.whatsappUrl}${formattedPhone}?text=${encodeURIComponent(message)}`;

                return {
                    phoneNumber: formattedPhone,
                    success: true,
                    whatsappUrl: whatsappUrl
                };
            } catch (error) {
                return {
                    phoneNumber: phoneNumber,
                    success: false,
                    error: error.message
                };
            }
        });

        const successCount = results.filter(r => r.success).length;

        res.status(200).json({
            success: true,
            message: `Catalog information prepared for ${successCount} vendors`,
            results: results
        });

    } catch (error) {
        console.error("Error sending catalog to vendors:", error);
        res.status(500).json({ message: "Server error" });
    }
};