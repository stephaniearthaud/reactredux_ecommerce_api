const fs = require('fs');
const mongoose = require('mongoose');
const router = require('express').Router();
const _ = require('lodash');

const authenticate = require('../../middleware/authenticate');
const validRouteParams = require('../../middleware/routeParams');
const History = mongoose.model('history');
const {collections} = require('../../app');

router.all('*', authenticate, validRouteParams);

router.get('/', (req, res) => {
  const models = Object.keys(collections).map(model => {
    return {
      name: model.includes('_') ? model.split('_').join(' ') : model,
      route: model
    };
  });

  // don't care about updates that didn't change data
  History
  .find(
    {$or: [
      {fields: {$gt: [] }},
      {action: 'added'},
      {action: 'deleted'}
    ]
  })
  .sort('-createdAt').limit(10)
  .then(history => {
    res.send({models, history});
  });
});

require('./collections')(router);

module.exports = router;
