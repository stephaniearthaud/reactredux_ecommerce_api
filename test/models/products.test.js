const {expect, request, app, Product, Category, History, populateProducts, populateCategories} = require('../test_helper');

before(populateCategories);
before(populateProducts);

describe('Product Model Validation', () => {
  let category;
  before(done => {
    Category.findOne({name: 'cat one'})
    .then(result => {
      category = result;
      done();
    });
  });

  it('fails when name is invalid', (done) => {
    Product.create({
      name: 'a',
      description: 'Valid Desc',
      price: '19',
      category
    }).then(product => {
      done(product);
    }).catch(err => {
      done();
    });
  });
  it('fails when description is invalid', (done) => {
    Product.create({
      name: 'Valid Name',
      description: 'a',
      price: '19999',
      category
    }).then(product => {
      done(product);
    }).catch(err => {
      done();
    });
  });
  it('fails when price is invalid', (done) => {
    Product.create({
      name: 'Valid Name',
      description: 'Valid Desc',
      price: '0.99',
      category
    }).then(product => {
      done(product);
    }).catch(err => {
      done();
    });
  });

  it('saves price in whole dollars', done => {
    const productOne = new Product({
      name: 'One',
      description: 'One',
      price: '19.64',
      category
    });
    const productTwo = new Product({
      name: 'Two',
      description: 'Two',
      price: '9.00',
      category
    });
    const productThree = new Product({
      name: 'Three',
      description: 'Three',
      price: '199',
      category
    });

    Promise.all([productOne.save(), productTwo.save(), productThree.save()])
      .then(products => {
        products.forEach(product => {
          switch (product.name) {
            case 'One':
              expect(product.price).toEqual(19);
              break;
            case 'Two':
              expect(product.price).toEqual(9);
              break;
            case 'Three':
              expect(product.price).toEqual(199);
          }
        });
        done();
      })
      .catch(err => done(err));
  });
});
