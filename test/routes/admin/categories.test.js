const {expect, request, app, users, Category} = require('../../test_helper');

describe('Admin Category routes', () => {
  let token;
  beforeEach(() => {
    token = users.admin.tokens[0].token;
  });

  it('invalid auth to GET /admin/product_category responds with status 401', done => {
    request(app)
      .get('/admin/product_category')
      .set('x-auth', users.regular.tokens[0].token)
      .expect(401)
      .end((err, {body}) => {
        if (err) return done(err);
        done();
      });
  });

  it('GET /admin/product_category responds with categories', (done) => {
    request(app)
      .get('/admin/product_category')
      .set('x-auth', token)
      .expect(200)
      .end((err, {body}) => {
        if (err) return done(err);
        expect(body.form.length).toBe(1);
        expect(body.documents[0]).toIncludeKeys(['_id', 'name']);
        expect(body.documents[0]).toExcludeKeys(['price']);
        expect(body.names.single).toBe('product category');
        expect(body.names.plural).toBe('product categories');
        done();
      });
  });

  it('POST to /admin/productcategories saves a new category', done => {
    const data = {
      name: 'a new cat'
    };

    request(app)
      .post('/admin/product_category')
      .set('x-auth', token)
      .send(data)
      .expect(200)
      .end((err, {body}) => {
        if (err) return done(err);
        expect(body.documents[0]).toIncludeKeys(['_id', 'name']);
        expect(body.documents[0]).toExcludeKeys(['price']);
        expect(body.document).toInclude({name: data.name});
        done();
      });
  });

  it('POST to /admin/productcategories DOES NOT save a new product with invalid data', done => {
    request(app)
      .post('/admin/product_category')
      .set('x-auth', token)
      .send({name: 'a'})
      .expect(422)
      .end((err, {body}) => {
        Category.findOne({name: 'a'})
          .then(product => {
            expect(product).toNotExist();
            expect(body.errors).toIncludeKey('name');
            done();
          }).catch(err => done(err));
      });
  });

});

describe('Admin Categories ID', () => {
  let category;
  let token;
  beforeEach(() => {
    token = users.admin.tokens[0].token;
  });

  beforeEach(done => {
    Category.create({
      name: 'another category'
    }).then(newCat => {
      category = newCat;
      done();
    }).catch(err => done(err));
  });

  afterEach(done => {
    Category.remove({name: 'another category'})
      .then(() => done())
      .catch(err => done(err));
  });

  it('GET to /admin/product_category/:id finds category history', done => {
    request(app)
      .get(`/admin/product_category/${category._id}`)
      .set('x-auth', token)
      .expect(200)
      .end((err, {body}) => {
        if (err) return done(err);
        expect(body[0]).toInclude({action: 'added', doc: {data: {name: 'another category'}}});
        done();
      });
  });

  it('GET to /admin/product_category/:id with invalid :id DOES NOT responds with 404', done => {

    request(app)
      .get(`/admin/product_category/12312312123`)
      .set('x-auth', token)
      .expect(404)
      .end((err, response) => {
        if (err) return done(err);
        done();
      });

  });

  it('PUT to /admin/product_category/:id updates a category', done => {
    category.name = 'updated name';
    request(app)
      .put(`/admin/product_category/${category._id}`)
      .set('x-auth', token)
      .send(category)
      .expect(200)
      .end((err, {body}) => {
        if (err) return done(err);
        expect(body).toIncludeKeys(['documents', 'document']);
        expect(body.document).toInclude({name: category.name});
        done();
      });
  });

  it('DELETE to /admin/product_category/:id removes a category', done => {
    request(app)
      .delete(`/admin/product_category/${category._id}`)
      .set('x-auth', token)
      .expect(200)
      .expect(({body}) => {
        expect(body).toInclude({name: 'another category'});
      })
      .end((err, respone) => {
        if (err) return done(err);
        Category.findOne({name: 'another category'})
          .then(response => {
            expect(response).toNotExist();
            done();
          }).catch(err => done(err));
      });
  });


});
