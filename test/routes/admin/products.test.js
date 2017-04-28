const {expect, request, app, users, Product, Category} = require('../../test_helper');

let category;
before(done => {
  Category.findOne({name: 'cat one'})
  .then(result => {
    category = result;
    done();
  });
});

describe('Admin Product routes', () => {
  let token;
  beforeEach(() => {
    token = users.admin.tokens[0].token;
  });

  it('invalid auth to GET /admin/product responds with status 401', done => {
    request(app)
      .get('/admin/product')
      .set('x-auth', users.regular.tokens[0].token)
      .expect(401)
      .end((err, {body}) => {
        if (err) return done(err);
        done();
      });
  });

  it('GET /admin/product responds with products', done => {
    request(app)
      .get('/admin/product')
      .set('x-auth', token)
      .expect(200)
      .end((err, {body}) => {
        if (err) return done(err);
        expect(body.form.length).toBe(5);
        expect(body.documents[0]).toIncludeKeys(['price', 'description']);
        expect(body.names.single).toBe('product');
        expect(body.names.plural).toBe('products');
        done();
      });
  });

  it('POST to /admin/product saves a new product', (done) => {

    const data = {
      name: 'Test Product',
      description: 'A great test',
      price: '19',
      image_url: 'http://www.google.com',
      category
    };
    request(app)
      .post('/admin/product')
      .set('x-auth', token)
      .send(data)
      .end((err, {body}) => {
        if (err) return done(err);
        expect(body.documents[0]).toIncludeKeys(['price', 'description']);
        expect(body.document).toInclude({image_url: data.image_url});
        done();
      });

  });

  it('POST to /admin/product DOES NOT save a new product with invalid data', (done) => {
    request(app)
      .post('/admin/product')
      .send({name: 'Invalid Product'})
      .set('x-auth', token)
      .expect(422)
      .end((err, {body}) => {
        if (err) return done(err);
        Product.findOne({name: 'Invalid Product'})
          .then(product => {
            expect(product).toNotExist();
            expect(body.errors).toIncludeKeys(['category', 'price', 'description']);
            done();
          })
          .catch(err => done(err));
      });
  });
});

describe('Admin Products ID', () => {
  let token;
  beforeEach(() => {
    token = users.admin.tokens[0].token;
  });

  it('GET to /admin/product/:id finds product history', done => {

    Product.create({
      name: 'Test Product',
      description: 'A great test',
      price: '19.99',
      category
    })
    .then(product  => {
      request(app)
        .get(`/admin/product/${product._id}`)
        .set('x-auth', token)
        .expect(200)
        .end((err, {body}) => {
          if (err) done(err);
          expect(body[0]).toInclude({
            action: 'added',
            doc: {
              data: {_id: product._id, name: product.name}
            }
          });
          done();
        });
    }).catch(err => done(err));

  });

  it('GET to /admin/product/:id DOES NOT find a product', done => {

    request(app)
      .get(`/admin/product/123123123123`)
      .set('x-auth', token)
      .expect(404)
      .end((err, response) => {
        if (err) return done(err);
        done();
      });

  });

  it('PUT to /admin/product/:id updates a product', done => {
    Product.findOne({name: 'One'})
      .then(product => {
        const data = {
          name: 'Updated One',
          description: 'Updated One',
          price: '88.88',
          category
        };
        request(app)
          .put(`/admin/product/${product._id}`)
          .set('x-auth', token)
          .send(data)
          .expect(200)
          .end((err, {body}) => {
            if (err) return done(err);
            expect(body.documents[0]).toIncludeKeys(['name', 'description', 'price']);
            expect(body.document).toInclude({name: data.name, price: 88});
            done();
          });

      });
  });

  it('DELETE to /admin/product/:id removes a product', done => {
    Product.findOne({name: 'One'})
      .then(product => {
        request(app)
          .delete(`/admin/product/${product._id}`)
          .set('x-auth', token)
          .expect(response => {
            expect(response.body).toInclude({name: 'One'});
          })
          .end((err, response) => {
            if (err) done(err);
            Product.findOne({name:'One'})
              .then(res => {
                expect(res).toNotExist();
                done();
              }).catch(err => done(err));
          });
      }).catch(err => done(err));
  });

});
