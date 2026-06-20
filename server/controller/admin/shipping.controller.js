const ShippingSetting = require('../../models/shippingSetting.model');
const PharmacySetting = require('../../models/pharmacySetting.model');
const ShippingRule = require('../../models/shippingRule.model');

// Settings
const getShippingSettings = async (req, res) => {
  try {
    let settings = await ShippingSetting.findOne();
    if (!settings) {
      settings = await ShippingSetting.create({ shippingStrategy: 'both' });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateShippingSettings = async (req, res) => {
  try {
    const { shippingStrategy } = req.body;
    let settings = await ShippingSetting.findOne();
    if (!settings) {
      settings = new ShippingSetting({ shippingStrategy });
    } else {
      settings.shippingStrategy = shippingStrategy;
    }
    await settings.save();
    res.status(200).json({ success: true, data: settings, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Pharmacy Settings
const getPharmacySettings = async (req, res) => {
  try {
    const settings = await PharmacySetting.findOne();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePharmacySettings = async (req, res) => {
  try {
    const { officeName, officeAddress, officeLatitude, officeLongitude } = req.body;
    let settings = await PharmacySetting.findOne();
    if (!settings) {
      settings = new PharmacySetting({ officeName, officeAddress, officeLatitude, officeLongitude });
    } else {
      settings.officeName = officeName;
      settings.officeAddress = officeAddress;
      settings.officeLatitude = officeLatitude;
      settings.officeLongitude = officeLongitude;
    }
    await settings.save();
    res.status(200).json({ success: true, data: settings, message: 'Pharmacy settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Rules
const createShippingRule = async (req, res) => {
  try {
    const rule = new ShippingRule(req.body);
    await rule.save();
    res.status(201).json({ success: true, data: rule, message: 'Rule created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getShippingRules = async (req, res) => {
  try {
    const rules = await ShippingRule.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: rules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getShippingRuleById = async (req, res) => {
  try {
    const rule = await ShippingRule.findById(req.params.id);
    if (!rule) {
      return res.status(404).json({ success: false, message: 'Rule not found' });
    }
    res.status(200).json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateShippingRule = async (req, res) => {
  try {
    const rule = await ShippingRule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!rule) {
      return res.status(404).json({ success: false, message: 'Rule not found' });
    }
    res.status(200).json({ success: true, data: rule, message: 'Rule updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteShippingRule = async (req, res) => {
  try {
    const rule = await ShippingRule.findByIdAndDelete(req.params.id);
    if (!rule) {
      return res.status(404).json({ success: false, message: 'Rule not found' });
    }
    res.status(200).json({ success: true, message: 'Rule deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getShippingSettings,
  updateShippingSettings,
  getPharmacySettings,
  updatePharmacySettings,
  createShippingRule,
  getShippingRules,
  getShippingRuleById,
  updateShippingRule,
  deleteShippingRule
};
