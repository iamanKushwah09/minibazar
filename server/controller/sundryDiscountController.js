const BillSundry = require("../models/BillSundry.modal");
const SundryDiscount = require("../models/SundryDiscount.modal");
const { getAllBillSundries } = require("./billSundryController");
const axios = require('axios');

const syncSundryDiscount = async (req, res) => {
  try {
    let Data;
    if (req && req.body && req.body.Data) {
      Data = req.body.Data;
    } else {
      console.log('🔄 Cron: Syncing Sundry Discounts...');
      const response = await axios.post(`${process.env.BUSY_API}/GetBillSundryDiscountStructure`, {}, { timeout: 15000 });
      Data = response.data.Data;
    }
    if (Data && Data.length > 0) {
      for (const sd of Data) {
        await SundryDiscount.findOneAndUpdate(
          { bill_sundry_code: sd.BillSundryCode, party_group_code: sd.PartyGroupCode },
          {
            bill_sundry_name: sd.BillSundryName,
            party_group_name: sd.PartyGroupName,
            sr_no: sd.SrNo,
            discount: sd.Discount,
            is_party_group_wise: sd.IsPartyGroupWise,
            status: 'active'
          },
          { upsert: true, new: true }
        );
      }
      console.log('✅ Cron: Sundry Discount sync completed');
      if (res) return res.status(200).json({ message: "Sundry Discounts synced successfully" });
    } else {
      if (res) return res.status(404).json({ message: "No data received" });
    }
  } catch (error) {
    console.error('❌ Cron: Error syncing sundry discounts:', error.message);
    if (res && !res.headersSent) return res.status(500).json({ message: error.message });
  }
};

const addSundryDiscount = async (req, res) => {
  try {
    const newSundryDiscount = new SundryDiscount(req.body);
    await newSundryDiscount.save();
    res.send({ message: "Sundry Discount Added Successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const addAllSundryDiscounts = async (req, res) => {
  try {
    // await SundryDiscount.deleteMany();
    await SundryDiscount.insertMany(req.body);
    res.status(200).send({
      message: "Sundry Discounts Added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllSundryDiscounts = async (req, res) => {
  try {
    const queryObject = {};
    const { is_party_group_wise, party_group_code } = req.query;
    if (is_party_group_wise) {
      queryObject.is_party_group_wise = is_party_group_wise === 'true';
    }
    if (party_group_code) {
      queryObject.party_group_code = parseInt(party_group_code);
    }
    const sundryDiscounts = await SundryDiscount.find(queryObject).sort({ _id: -1 });
    res.send(sundryDiscounts);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getSundryDiscountById = async (req, res) => {
  try {
    const sundryDiscount = await SundryDiscount.findById(req.params.id);
    if (!sundryDiscount) {
      return res.status(404).send({ message: "Sundry Discount not found!" });
    }
    res.send(sundryDiscount);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateSundryDiscount = async (req, res) => {
  try {
    const sundryDiscount = await SundryDiscount.findById(req.params.id);

    if (sundryDiscount) {
      sundryDiscount.bill_sundry_code = req.body.bill_sundry_code || sundryDiscount.bill_sundry_code;
      sundryDiscount.bill_sundry_name = req.body.bill_sundry_name || sundryDiscount.bill_sundry_name;
      sundryDiscount.party_group_code = req.body.party_group_code || sundryDiscount.party_group_code;
      sundryDiscount.party_group_name = req.body.party_group_name || sundryDiscount.party_group_name;
      sundryDiscount.sr_no = req.body.sr_no || sundryDiscount.sr_no;
      sundryDiscount.discount = req.body.discount || sundryDiscount.discount;
      sundryDiscount.is_party_group_wise = req.body.is_party_group_wise !== undefined ? req.body.is_party_group_wise : sundryDiscount.is_party_group_wise;

      await sundryDiscount.save();
      res.send({ message: "Sundry Discount Updated Successfully!" });
    } else {
      res.status(404).send({ message: "Sundry Discount not found!" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const updateManySundryDiscounts = async (req, res) => {
  try {
    await SundryDiscount.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: req.body.updateData,
      },
      {
        multi: true,
      }
    );

    res.send({
      message: "Sundry Discounts updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteSundryDiscount = async (req, res) => {
  try {
    const result = await SundryDiscount.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Sundry Discount not found!" });
    }
    res.status(200).send({
      message: "Sundry Discount Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
const deleteManySundryDiscounts = async (req, res) => {
  try {
    await SundryDiscount.deleteMany({ _id: req.body.ids });
    res.send({
      message: `Sundry Discounts Delete Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// const getSundryDiscountsByPartyGroup = async (req, res) => {
//   try {
//     const { party_group_code, getParty } = req.body;
//     const sundryDiscounts = await SundryDiscount.find({ $or: [{ party_group_code: parseInt(party_group_code) },{ party_group_code: parseInt(getParty) }]}).sort({ sr_no: 1 });
//     const checkBillSundryDiscount = await getAllBillSundries('Discount');
//     console.log(checkBillSundryDiscount,'checkBillSundryDiscount');
//     res.send(sundryDiscounts);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const getSundryDiscountsByPartyGroup = async (req, res) => {
  try {
   
    const { party_group_code, getParty } = req.body;
    let sundryDiscounts = [];
    if (party_group_code) {
      sundryDiscounts = await SundryDiscount.find({
        party_group_code: parseInt(party_group_code)
      }).sort({ sr_no: 1 });
    }
    if ((!sundryDiscounts || sundryDiscounts.length === 0) && getParty) {
      sundryDiscounts = await SundryDiscount.find({
        party_group_code: parseInt(getParty)
      }).sort({ sr_no: 1 });
    }
    if (!sundryDiscounts || sundryDiscounts.length === 0){
      sundryDiscounts = await BillSundry.find({"name":'Discount'}).sort({ _id: -1 });
    }
    const hammali = await BillSundry.findOne({"code":5056}).sort({ _id: -1 });
    res.send({sundryDiscounts , hammali});
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: err.message,
    });
  }
};


module.exports = {
  addSundryDiscount,
  addAllSundryDiscounts,
  getAllSundryDiscounts,
  getSundryDiscountById,
  updateSundryDiscount,
  updateManySundryDiscounts,
  deleteSundryDiscount,
  deleteManySundryDiscounts,
  getSundryDiscountsByPartyGroup,
  syncSundryDiscount
}; 