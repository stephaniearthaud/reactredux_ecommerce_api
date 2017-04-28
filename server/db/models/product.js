const _ = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const History = mongoose.model('history');

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, '{PATH} is required'],
    minlength: [2, '{PATH} must be more than {MINLENGTH} characters'],
    trim: true
  },
  description: {
    type: String,
    required: [true, '{PATH} is required'],
    minlength: [2, '{PATH} must be more than {MINLENGTH} characters'],
    maxlength: [255, '{PATH} must be less than {MAXLENGTH} characters'],
    widget: {el: 'textarea'}, // custom option
    trim: true
  },
  price: {
    type: Schema.Types.Currency,
    required: [true, '{PATH} is required'],
    min: [1, '$1.00 minimum required'],
    helpText: 'Whole numbers only', // custom option
    validate: {
      validator: validatePrice,
      message: 'Price entered is not valid currency'
    }
  },
  image_url: {
    type: Schema.Types.Url,
    validate: {
      validator: validateUrl,
      message: 'Not a valid url. Is http(s):// present?'
    }
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'product_category',
    required: [true, '{PATH} is required. Create a product category if no options are listed']
  }
}, {timestamps: {}});

function validatePrice(price, next) {
  if (!validator.isCurrency(''+price, {allow_negatives: false})) {
    next(false);
  } else {
    next(true);
  }

}

function validateUrl(val, next) {
  if (!val) {
    return next(true);
  }
  const isUrl = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(val);

  if (!isUrl) {
    next(false);
  } else {
    next(true);
  }
}

ProductSchema.pre('save', require('../hooks/preSave'));

ProductSchema.post('save', function(doc) {
  require('../hooks/postSave')(doc, 'product');
});

ProductSchema.pre('find', function(next) {
  this.populate('category');
  next();
});

ProductSchema.post('remove', function(doc) {
  require('../hooks/postRemove')(doc, 'product');
});

ProductSchema.statics.getRelated = function(_id) {
  // no associations
  return Promise.resolve({});
};

const Product = mongoose.model('product', ProductSchema);
module.exports = Product;
