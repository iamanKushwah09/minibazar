const DispatchLog = require("../models/dispatchlog.model");

exports.createDispatchLog = async (req, res) => {
  try {
    if (!req.body.orderDetails_id) {
      return res.status(400).json({ message: "orderDetails_id is required" });
    }
    const dispatchLog = await DispatchLog.create(req.body);
    res.status(201).json(dispatchLog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDispatchLogById = async (req, res) => {
  try {
    const dispatchLog = await DispatchLog.findById(req.params.id);
    if (!dispatchLog) {
      return res.status(404).json({ message: "DispatchLog not found" });
    }
    const processedDispatchLog = {
        ...dispatchLog, images: dispatchLog.images?.[0] || {}
    }

    if(dispatchLog.images && dispatchLog.images.length > 0) {
        processedDispatchLog.images = DispatchLog.image.map(img => {
        if (!img) return { base64File: '', fileName: '', url: '' };
        try {
          const filePath = `${process.cwd()}/uploadFile_masale${img}`;
          const { base64File, fileName } = pathToBase64(filePath);
          return {
            base64File: base64File ? `data:image/png;base64,${base64File}` : '',
            fileName: fileName || (typeof img === 'string' ? img.split('/').pop() : ''),
            url: img ? `${process.env.BASE_URL}${img}` : ''
          };
        } catch (err) {
          console.error(`Error processing image: ${err.message}`);
          return { base64File: '', fileName: '', url: '' };
        }
      });
    }else {
      processedDispatchLog.images = [];
    }

    res.status(200).json(dispatchLog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllDispatchLogs = async (req, res) => {
  try {
    const dispatchLogs = await DispatchLog.find();
    res.status(200).json(dispatchLogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get dispatch logs by orderDetails_id
exports.getDispatchLogsByOrderDetailsId = async (req, res) => {
  try {
    const { orderDetailsId } = req.params;
    const dispatchLogs = await DispatchLog.find({ orderDetails_id: orderDetailsId });
    res.status(200).json(dispatchLogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};