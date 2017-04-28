const mongoose = require('mongoose');
const fs = require('fs');
const util = require('util');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

// custom type for dynamic form creation
function Url(key, options) {
  mongoose.SchemaType.call(this, key, options, 'Url');
}
Url.prototype = Object.create(mongoose.SchemaType.prototype);
Url.prototype.cast = val => {
  return val;
};

//custom type for dynamic form creation
function Currency(path, options) {
    mongoose.SchemaType.call(this, path, options, 'Currency');
}
util.inherits(Currency, mongoose.SchemaTypes.Number);
Currency.prototype.cast = val => {
  // parseInt for whole dollars
  return Number(parseInt(val));
};

mongoose.Schema.Types.Url = Url;
mongoose.Schema.Types.Currency = Currency;

fs.readdirSync(__dirname + '/models').forEach(file => {
  if (file.includes('.js')) {
    try {
      require(`./models/${file}`);
    } catch (e) {
      console.log(e);
      console.warn('Unable to require file', file);
    }
  }
});

module.exports = mongoose;
