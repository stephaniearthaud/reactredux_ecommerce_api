const {expect, request, app, Category, Product} = require('../test_helper');

describe('Category Model Validation', () => {

  it('fails when name is invalid', (done) => {
    Category.create({
      name: 'a'
    }).then(category => {
      done(category);
    }).catch(err => {
      done();
    });
  });
  it('converts name to lowercase on save', done => {
    Category.create({
      name: 'a tEsT CaSE'
    }).then(category => {
      expect(category.name).toBe('a test case');
      done();
    }).catch(err => done(err));
  });


});
