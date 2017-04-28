const ModelForm = require('../db/forms/form');
const mongoose = require('mongoose');
const _ = require('lodash');
const History = mongoose.model('history');
const {collections} = require('../app');

function getSchema({collection}) {
  return collections[collection];
}

class CollectionsController {

  index(req, res, next) {
    const Schema = getSchema(req.params);
    const form = new ModelForm(Schema.schema);
    Schema.find({})
      .then(documents => {
        setTimeout(() => {
          res.send({
            form: form.form,
            documents,
            names: {
              single: Schema.modelName.split('_').join(' '),
              plural: Schema.collection.collectionName.split('_').join(' ')
            }
          });
        });
      })
      .catch(err => next(err));
  }

  create(req, res, next) {
    const Schema = getSchema(req.params);
    const schema = new Schema(req.body);
    // send req.user to save() for logging history
    schema.save(req.user)
      .then((newDoc) => {
        Schema.find({})
        .then(documents => res.send({documents, document:newDoc}));
      }).catch(err => next(err));
  }

  update(req, res, next) {
    const Schema = getSchema(req.params);
    const _id = req.params.id;
    // findOne then save uses pre/post hooks
    Schema.findOne({_id})
    .then(doc => {
      _.merge(doc, req.body);
      // send req.user to save() for logging history
      return doc.save(req.user);
    })
    .then(newDoc => {
      Schema.find({})
      .then(documents => {
        res.send({documents, document:newDoc});
      });
    })
    .catch(err => {
      next(err)
    });
  }

  getRelated(req, res, next) {
    const Schema = getSchema(req.params);
    Schema.getRelated(req.params.id)
    .then(results => {
      res.send(results);
    })
    .catch(err => next(err));

  }

  getOne(req, res) {
    const Schema = getSchema(req.params);
    const _id = req.params.id;

    Schema.findById(_id)
      .then(document => {
        if (!document) {
          return Promise.reject();
        }
        return History.find({
          'doc.data._id': document._id
        });

      })
      .then(docHistory => {
        res.send(docHistory);
      })
      .catch(err => res.status(404).send({}));
  }

  remove(req, res) {
    const Schema = getSchema(req.params);
    const _id = req.params.id;
    Schema.findOne({_id})
      .then(document => {
        if (!document) {
          return Promise.reject();
        }
        // add req.user to document object for loggin history
        document.__user = req.user;
        return document.remove();
      }).then(document => {
        res.send(document);
      })
      .catch(err => {
        console.log(err);
        res.status(404).send({});
      });
  }

}

module.exports = new CollectionsController();
