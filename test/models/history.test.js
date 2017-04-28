const {expect, request, app, Product, Category, History} = require('../test_helper');

describe('History Model Validation', () => {
  let product;
  let category;
  let cat;
  before(done => {
    Category.findOne({name: 'cat two'})
    .then(result => {
      category = result;
      done();
    });
  });

  it('creates an added action when a product is saved', done => {
    Product.create({
      name: 'History Test',
      description: 'History Test',
      price: '34',
      category
    })
    .then(res => {
      product = res;
      return History.findOne({'doc.data._id': product._id});
    })
    .then(log => {
      expect(log.action).toBe('added');
      expect(log.createdAt).toEqual(product.createdAt);
      done();
    })
    .catch(err => done(err));
  });

  it('logs changed fields when a product is updated', done => {
    product.name = 'History Test Update';
    product.price = '100';
    product.save()
    .then(res => {
      product = res;
      return History.findOne({'doc.data._id': product._id, action: 'changed'});
    })
    .then(log => {
      expect(log.fields).toInclude('name').toInclude('price');
      expect(log.createdAt).toEqual(product.updatedAt);
      done();
    })
    .catch(err => done(err));
  });

  it('creates an deleted action when a product is removed', done => {
    product.remove()
    .then(res => {
      product = res;
      return History.findOne({'doc.data._id': product._id, action: 'deleted'});
    })
    .then(log => {
      expect(log).toExist();
      expect(log.action).toBe('deleted');
      done();
    })
    .catch(err => done(err));
  });

  it('creates an added action when a category is saved', done => {
    Category.create({
      name: 'History Test',
    })
    .then(res => {
      cat = res;
      return History.findOne({'doc.data._id': cat._id});
    })
    .then(log => {
      expect(log.action).toBe('added');
      expect(log.createdAt).toEqual(cat.createdAt);
      done();
    })
    .catch(err => done(err));
  });

  it('logs changed fields when a category is updated', done => {
    cat.name = 'History Test Update';
    cat.save()
    .then(res => {
      cat = res;
      return History.findOne({'doc.data._id': cat._id, action: 'changed'});
    })
    .then(log => {
      expect(log.fields).toInclude('name');
      expect(log.createdAt).toEqual(cat.updatedAt);
      done();
    })
    .catch(err => done(err));
  });

  it('creates an deleted action when a category is removed', done => {
    cat.remove()
    .then(res => {
      cat = res;
      return History.findOne({'doc.data._id': cat._id, action: 'deleted'});
    })
    .then(log => {
      expect(log).toExist();
      expect(log.action).toBe('deleted');
      done();
    })
    .catch(err => done(err));
  });


});
