const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const ProductCategorySchema = new Schema({
  name: {
    type: String,
    required: [true, '{PATH} is required.'],
    minlength: [2, '{PATH} must be more than {MINLENGTH} characters'],
    unique: true,
    lowercase: true,
    trim: true
  },
}, {timestamps:{}});

ProductCategorySchema.plugin(uniqueValidator, {message: 'category already exists ({PATH} must be unique)'});

ProductCategorySchema.statics.getRelated = function(_id) {
  const Product = mongoose.model('product');
  return new Promise((resolve, reject) => {
    const names = {
      single: 'product',
      plural: 'products'
    };
    Product.find({category: _id})
    .then(documents => {
      if (documents.length === 0) {
        resolve({});
      } else {
        const results = {
          products: {
            documents,
            names
          }
        };
        resolve(results);
      }
    })
    .catch(err => {
      console.log(err);
      reject(err);
    });
  });
};

ProductCategorySchema.pre('save', require('../hooks/preSave'));

ProductCategorySchema.post('save', function(doc) {
  require('../hooks/postSave')(doc, 'product_category');
});

ProductCategorySchema.pre('remove', function(next) {
  const category = this;
  const Product = mongoose.model('product');
  const {_id} = category;
  Product.find({category: _id})
  .then(products => {
    const promises = products.map(product => {
      product.__user = category.__user;
      return product.remove();
    });
    Promise.all(promises).then(() => {
      next();
    });
  }).catch(err => {
    console.log(err);
    next(err);
  });
});

ProductCategorySchema.post('remove', function(doc) {
  require('../hooks/postRemove')(doc, 'product_category');
});

const ProductCategory = mongoose.model('product_category', ProductCategorySchema);

module.exports = ProductCategory;
