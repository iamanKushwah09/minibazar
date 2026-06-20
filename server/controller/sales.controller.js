const Salesman = require('../models/Sales.model');
const { CREATE_MESSAGE, DELETE_MESSAGE, UPDATE_MESSAGE } = require("../enum");
const axios = require("axios");

// Create a new salesman
exports.createSalesman = async (req, res) => {
    try {
        const newSalesman = new Salesman(req.body);
        await newSalesman.save();
        res.status(201).json({ message: `Salesman ${CREATE_MESSAGE}` });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get salesman by ID
exports.getSalesmanById = async (req, res) => {
    try {
        const salesman = await Salesman.findById(req.params.id).exec();
        if (!salesman) return res.status(404).json({ message: 'Salesman not found' });
        res.status(200).json(salesman);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update salesman by ID
exports.updateSalesmanById = async (req, res) => {
    try {
        const updatedSalesman = await Salesman.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
        if (!updatedSalesman) return res.status(404).json({ message: 'Salesman not found' });
        res.status(200).json({ message: `Salesman ${UPDATE_MESSAGE}` });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete salesman by ID
exports.deleteSalesmanById = async (req, res) => {
    try {
        const deletedSalesman = await Salesman.findByIdAndDelete(req.params.id).exec();
        if (!deletedSalesman) return res.status(404).json({ message: 'Salesman not found' });
        res.status(200).json({ message: `Salesman ${DELETE_MESSAGE}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getSalesmanNameAndId = async (req, res) => {
  try {
    // Fetch only id and name fields from active salesmen
    const salesmen = await Salesman.find({ is_active: true }, { _id: 1, name: 1 })
      .sort({ _id: -1 });
    return res.status(200).json({
      status: 'success',
      data: salesmen
    });
  } catch (error) {

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching salesmen',
      error: error.message
    });
  }
};

// Delete all salesmans
exports.deleteAllSalesman = async (req, res) => {
  try {
    console.log("Deleting all Salesman... in SalesmanController.js");
    const deletedSalesman = await Salesman.deleteMany({});
    return res.status(200).json({
      status: 'success',
      message: `${deletedSalesman.deletedCount} Salesman deleted successfully`
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting Salesman',
      error: error.message
    });
  }
};


// Get all salesmen with pagination and search
exports.getSalesman = async (req, res) => {
    try {
        const { page, limit, q } = req.query;
        // console.log(q,'query')
        // If pagination or search is requested, use paginated response
        if ((page && Number(page) > 0) || (limit && Number(limit) > 0) || (q && String(q).trim().length > 0)) {
            const currentPage = Math.max(1, Number(page) || 1);
            const perPage = Math.max(1, Math.min(100, Number(limit) || 10));
            const skip = (currentPage - 1) * perPage;
            // Build search query
            const query = {};
            if (q && String(q).trim().length > 0) {
                const search = String(q).trim();
                const orQuery = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    // { code: { $regex: search, $options: 'i' } },
                    // { app_code: { $regex: search, $options: 'i' } }
                ];
                // If q is a number, also try to match code and app_code equality
                const qNum = Number(search);
                if (!Number.isNaN(qNum)) {
                    orQuery.push({ code: qNum });
                    orQuery.push({ app_code: qNum });
                }
                query.$or = orQuery;
            }
            const totalDoc = await Salesman.countDocuments(query);
            const salesmans = await Salesman.find(query)
                .sort({ _id: -1 })
                .skip(skip)
                .limit(perPage)
                .lean();
            return res.status(200).json({
                salesmans,
                totalDoc,
                limits: perPage,
                pages: currentPage,
            });
        }
        // Default: keep legacy behavior (return full array without pagination)
        const salesmans = await Salesman.find().sort({ _id: -1 }).exec();
        res.status(200).json(salesmans);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.getBusyRefreshSaleman = async (req, res) => {
    try {
        let Data;
        if (req.body && req.body.Data) {
            Data = req.body.Data;
        } else {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${process.env.BUSY_API}/Account/getsalesman`,
                headers: { },
                timeout: 5000 // 5 second timeout
            };
            const response = await axios.request(config);
            Data = response.data.Data;
        }

        if (!Data || Data.length === 0) {
            return res.status(404).json({ message: 'No data received from Busy API' });
        }
        for (const {Code, Name , AppCode } of Data) {            
            await Salesman.findOneAndUpdate(
                { code: Code },
                {
                    name: Name,
                    code: Code,
                    app_code: AppCode,
                    is_active: true,
                },
                { upsert: true, new: true }
            );
        }
        res.status(200).json({
            message: "Salesman refreshed successfully"
        });

    } catch (error) {
        console.log(error);
        if (error.code === 'ECONNABORTED') {
            return res.status(408).json({ message: 'Request timeout - API took too long to respond' });
        }
        res.status(500).json({ message: error.message });
    }
};