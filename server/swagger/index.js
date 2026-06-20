const admin = require('./admin.swagger');
const attribute = require('./attribute.swagger');
const attributeGroup = require('./attributeGroup.swagger');
const attributeValue = require('./attributeValue.swagger');
const banner = require('./banner.swagger');
const brand = require('./brand.swagger');
const catalog = require('./catalog.swagger');
const categories = require('./categories.swagger');
const category = require('./category.swagger');
const coupon = require('./coupon.swagger');
const currency = require('./currency.swagger');
const customer = require('./customer.swagger');
const customerOrder = require('./customerOrder.swagger');
const customerStore = require('./customerStore.swagger');
const dispatch = require('./dispatch.swagger');
const item = require('./item.swagger');
const itemGroup = require('./itemGroup.swagger');
const language = require('./language.swagger');
const location = require('./location.swagger');
const notification = require('./notification.swagger');
const offer = require('./offer.swagger');
const orderDetails = require('./orderDetails.swagger');
const orderRoutes = require('./orderRoutes.swagger');
const orders = require('./orders.swagger');
const productAttribute = require('./productAttribute.swagger');
const products = require('./products.swagger');
const promoCode = require('./promoCode.swagger');
const role = require('./role.swagger');
const salesman = require('./salesman.swagger');
const setting = require('./setting.swagger');
const shipping = require('./shipping.swagger');
const unit = require('./unit.swagger');
const vendorGroup = require('./vendorGroup.swagger');
const sync = require('./sync.swagger');
const itemDiscount = require('./itemDiscount.swagger');
const vendorSalesman = require('./vendorSalesman.swagger');

const mergeSwagger = (...modules) => {
  const merged = {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'Complete API Documentation',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5058}`,
      },
    ],
    tags: [],
    paths: {},
  };

  for (const mod of modules) {
    if (mod.tags) {
      merged.tags.push(...mod.tags);
    }
    if (mod.paths) {
      merged.paths = { ...merged.paths, ...mod.paths };
    }
  }

  return merged;
};

const swaggerDocument = mergeSwagger(
  admin,
  attribute,
  attributeGroup,
  attributeValue,
  banner,
  brand,
  catalog,
  categories,
  category,
  coupon,
  currency,
  customer,
  customerOrder,
  customerStore,
  dispatch,
  item,
  itemGroup,
  language,
  location,
  notification,
  offer,
  orderDetails,
  orderRoutes,
  orders,
  productAttribute,
  products,
  promoCode,
  role,
  salesman,
  setting,
  shipping,
  unit,
  vendorGroup,
  sync,
  itemDiscount,
  vendorSalesman
);

module.exports = swaggerDocument;
