const mongoose = require('mongoose');
const History = mongoose.model('history');

module.exports = function(doc, kind) {
  const {_id, email} = doc.__user;
  History.create({
    doc: {
      kind,
      data: {_id: doc._id, name: doc.name}
    },
    createdAt: doc.wasNew ? doc.createdAt : doc.updatedFields.length ? doc.updatedAt : Date.now(),
    action: doc.wasNew ? 'added' : 'changed',
    fields: doc.wasNew ? undefined : doc.updatedFields,
    user: {
      _id,
      email
    }
  });
};
