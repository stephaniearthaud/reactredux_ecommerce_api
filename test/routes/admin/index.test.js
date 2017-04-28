const {expect, request, app, User, History, users, createUser} = require('../../test_helper');

before(createUser);

describe('Admin Index', () => {

  it('Unauthorized GET to /admin responds with status 401', done => {
    request(app)
      .get('/admin')
      .expect(401)
      .end((err, response) => {
        if (err) return done(err);
        done();
      });
  });
  it('invalid x-auth with GET to /admin responds with status 401', done => {
    request(app)
      .get('/admin')
      .set('x-auth', 'lkjasdfiouwrqeklasdf')
      .expect(401)
      .end((err, response) => {
        if (err) return done(err);
        done();
      });
  });

  it('non superuser GET to /admin responds with status 401', done => {
    expect(users.regular.tokens[0].token).toExist();
    expect(users.regular.is_superuser).toBe(false);
    request(app)
      .get('/admin')
      .set('x-auth', users.regular.tokens[0].token)
      .expect(401)
      .end((err, response) => {
        if (err) return done(err);
        done();
      });
  });
  it('superuser GET to /admin responds with status 200', done => {
    expect(users.admin.tokens[0].token).toExist();
    expect(users.admin.is_superuser).toBe(true);
    request(app)
      .get('/admin')
      .set('x-auth', users.admin.tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  it('superuser GET to /admin responds data', done => {
    expect(users.admin.tokens[0].token).toExist();
    expect(users.admin.is_superuser).toBe(true);
    request(app)
      .get('/admin')
      .set('x-auth', users.admin.tokens[0].token)
      .expect(200)
      .end((err, {body}) => {
        if (err) return done(err);
        expect(body.models).toExist();
        expect(body.history).toExist();
        done();
      });
  });
});
