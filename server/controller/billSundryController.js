const BillSundry = require('../models/BillSundry.modal');
const axios = require('axios');

const syncBillSundry = async (req, res) => {
  try {
    let Data;
    if (req && req.body && req.body.Data) {
      Data = req.body.Data;
    } else {
      console.log('🔄 Cron: Syncing Bill Sundries...');
      const response = await axios.post(`${process.env.BUSY_API}/GetBillSundry`, {}, { timeout: 15000 });
      Data = response.data.Data;
    }
    if (Data && Data.length > 0) {
      for (const billSundry of Data) {
        await BillSundry.findOneAndUpdate(
          { code: billSundry.Code },
          {
            name: billSundry.Name,
            nature_type: billSundry.NatureType,
            discount: billSundry.Discount,
            status: 'active'
          },
          { upsert: true, new: true }
        );
      }
      console.log('✅ Cron: Bill Sundry sync completed');
      if (res) return res.status(200).json({ message: "Bill Sundries synced successfully" });
    } else {
      if (res) return res.status(404).json({ message: "No data received" });
    }
  } catch (error) {
    console.error('❌ Cron: Error syncing bill sundries:', error.message);
    if (res && !res.headersSent) return res.status(500).json({ message: error.message });
  }
};

const addBillSundry = async (req, res) => {
  try {
    const newBillSundry = new BillSundry(req.body);
    await newBillSundry.save();
    res.send({ message: "Bill Sundry Added Successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
const getAllBillSundries = async (req, res) => {
  try {
    const queryObject = { status: 'active' };
    const { name } = req.query;
    if (name) {
      queryObject.name = { $regex: name, $options: 'i' };
    }
    const billSundries = await BillSundry.find(queryObject).sort({ _id: -1 });
    res.send(billSundries);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addBillSundry,
  getAllBillSundries,
  syncBillSundry
};