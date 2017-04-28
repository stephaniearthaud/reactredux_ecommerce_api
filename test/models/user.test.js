const {expect, request, app, User} = require('../test_helper');

describe('User validation model', () => {

  it('creates a user with a hashed password', (done) => {
    User.create({
      email: 'test@test.com',
      password: 'password'
    })
    .then(user => {
      expect(user.email).toBe('test@test.com');
      expect(user.password).toNotBe('password');
      expect(user.is_superuser).toBe(false);
      done();
    })
    .catch(err => done(err));
  });

  it('does not save a user with a duplicate email', done => {
    User.create({
      email: 'test@test.com',
      password: 'password'
    })
    .then(user => done(user))
    .catch(err => {
      expect(err.code).toBe(11000);
      done();
    });
  });

});
