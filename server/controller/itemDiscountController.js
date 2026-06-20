const axios = require('axios');
const ItemDiscount = require('../models/ItemDiscount.modal');

// const getItemDiscount = async (req, res) => {
//   try {

//     const { PartyCode , ItemCode } = req.body;
//     if (!PartyCode || !ItemCode) {
//       return res.status(400).send({
//         message: "PartyCode and ItemCode are required",
//       });
//     }

//     let data = JSON.stringify({
//       "PartyCode": PartyCode,
//       "ItemCode": ItemCode
//     });

//     let config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: `${process.env.BUSY_API}/Item/GetItemDiscount`,
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       data: data
//     };

//     const response = await axios.request(config);

//     if (response.data.Status === 1) {
//       // Optionally save to DB
//       const existingDiscount = await ItemDiscount.findOne({ partyCode: PartyCode, itemCode: ItemCode });
//       if (existingDiscount) {
//         existingDiscount.discount1 = response.data.Data.Discount1;
//         existingDiscount.discount2 = response.data.Data.Discount2;
//         existingDiscount.discount3 = response.data.Data.Discount3;
//         existingDiscount.discount4 = response.data.Data.Discount4;
//         await existingDiscount.save();
//       } else {
//         const newDiscount = new ItemDiscount({
//           partyCode: PartyCode,
//           itemCode: ItemCode,
//           discount1: response.data.Data.Discount1,
//           discount2: response.data.Data.Discount2,
//           discount3: response.data.Data.Discount3,
//           discount4: response.data.Data.Discount4,
//         });
//         await newDiscount.save();
//       }

//       res.send(response.data);
//     } else {
//       res.status(400).send({
//         message: response.data.ErrorMessage || "Error fetching discount",
//       });
//     }
//   } catch (err) {
//     res.status(500).send({
//       message: err.message,
//     });
//   }
// };

const itemDiscountDatabase = async (req, res) => {
  try {
    const { PartyCode, ItemCode } = req.params;
    const partyCodeNum = Number(PartyCode);
    if (isNaN(partyCodeNum)) {
      return res.status(400).send({
        message: "Invalid PartyCode: must be a valid number",
      });
    }
    const getItemDiscount = await ItemDiscount.findOne({
      partyCode: partyCodeNum,
      itemCode: ItemCode,
    });
    return res.send({
      message: "Items Discount",
      data: getItemDiscount,
    });
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};


const getItemAccordingDiscount = async (req, res) => {
  try {
    const { PartyCode, ItemCode } = req.body;
    if (!PartyCode || !ItemCode) {
      return res.status(400).send({
        message: "PartyCode and ItemCode are required",
      });
    }
    const partyCodeNum = Number(PartyCode);
    if (isNaN(partyCodeNum)) {
      return res.status(400).send({
        message: "Invalid PartyCode: must be a valid number",
      });
    }
    const data = JSON.stringify({
      PartyCode,
      ItemCode,
    });
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.BUSY_API}/Item/GetItemDiscount`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };
    const response = await axios.request(config);
    if (response.data.Status === 1) {
      const discountData = {
        partyCode: PartyCode,
        itemCode: ItemCode,
        discount1: response.data.Data.Discount1,
        discount2: response.data.Data.Discount2,
        discount3: response.data.Data.Discount3,
        discount4: response.data.Data.Discount4,
      };
      // ✅ Single operation: Update if exists, insert if not
      await ItemDiscount.findOneAndUpdate(
        { partyCode: partyCodeNum, itemCode: ItemCode },
        { $set: discountData },
        { upsert: true, new: true }
      );
      return res.send({
        status: 1,
        message: "Discount record updated/inserted successfully",
        data: response.data.Data,
      });
    } else {
      return res.status(400).send({
        message: response.data.ErrorMessage || "Error fetching discount",
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: err.message,
    });
  }
};


const getAllItemDiscounts = async (req, res) => {
  try {
    const itemDiscounts = await ItemDiscount.find({}).sort({ _id: -1 });
    res.send(itemDiscounts);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getItemDiscountById = async (req, res) => {
  try {
    const itemDiscount = await ItemDiscount.findById(req.params.id);
    if (!itemDiscount) {
      return res.status(404).send({ message: "Item Discount not found!" });
    }
    res.send(itemDiscount);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateItemDiscount = async (req, res) => {
  try {
    const itemDiscount = await ItemDiscount.findById(req.params.id);

    if (itemDiscount) {
      itemDiscount.partyCode = req.body.partyCode || itemDiscount.partyCode;
      itemDiscount.itemCode = req.body.itemCode || itemDiscount.itemCode;
      itemDiscount.discount1 = req.body.discount1 !== undefined ? req.body.discount1 : itemDiscount.discount1;
      itemDiscount.discount2 = req.body.discount2 !== undefined ? req.body.discount2 : itemDiscount.discount2;
      itemDiscount.discount3 = req.body.discount3 !== undefined ? req.body.discount3 : itemDiscount.discount3;
      itemDiscount.discount4 = req.body.discount4 !== undefined ? req.body.discount4 : itemDiscount.discount4;
      itemDiscount.status = req.body.status || itemDiscount.status;

      await itemDiscount.save();
      res.send({ message: "Item Discount Updated Successfully!" });
    } else {
      res.status(404).send({ message: "Item Discount not found!" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const deleteItemDiscount = async (req, res) => {
  try {
    const result = await ItemDiscount.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Item Discount not found!" });
    }
    res.status(200).send({
      message: "Item Discount Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  getItemAccordingDiscount,
  getAllItemDiscounts,
  getItemDiscountById,
  updateItemDiscount,
  deleteItemDiscount,
  itemDiscountDatabase
};