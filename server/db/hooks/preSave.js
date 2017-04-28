module.exports = function(next, user) {
  this.__user = user;
  this.wasNew = this.isNew;
  this.updatedFields = this.modifiedPaths().filter(path => path !== 'updatedAt');
  next();
};
