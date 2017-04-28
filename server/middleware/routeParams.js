const {collections} = require('../app');
const {ObjectID} = require('mongodb');

const validRouteParams = (req, res, next) => {
  const [,collection,id] = req.path.split('/');

  if (!collection && !id) {
    return next();
  }

  if (!collections[collection]) {
    return res.status(404).send({});
  }

  if (!id) {
    return next();
  }

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }
  return next();

}

module.exports = validRouteParams;
