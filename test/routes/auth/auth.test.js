const {expect, request, app, User} = require('../../test_helper');

describe('User Authentication Routes', () => {
  const user = {
    email: 'testUser@test.com',
    password: 'password',
    is_superuser: true
  };

  it('/auth/signup creates a user and generates an auth token', done => {
    request(app)
      .post('/auth/signup')
      .send(user)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers['x-auth']).toExist();
        expect(res.body.email).toBe(user.email);
        User.findOne({email: user.email})
        .then(found => {
          expect(found).toExist();
          expect(found.tokens[0].token).toBe(res.headers['x-auth']);
          done();
        })
        .catch(err => done(err));

      });
  });

  it('/auth/signin logs in a user and generates an auth token', done => {
    request(app)
      .post('/auth/signin')
      .send(user)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers['x-auth']).toExist();
        expect(res.body.email).toBe(user.email);
        User.findOne({email: user.email})
        .then(found => {
          expect(found).toExist();
          expect(found.tokens.length).toBe(2);
          done();
        })
        .catch(err => done(err));
      });
  });

  it('/auth/signout logs out a user and removes the auth token', done => {
    User.findOne({email: user.email})
    .then(({tokens}) => {
      const token = tokens[0].token;
      request(app)
        .delete('/auth/signout')
        .set('x-auth', token)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.headers['x-auth']).toNotExist();
          User.findOne({email: user.email})
          .then(found => {
            expect(found).toExist();
            expect(found.tokens.length).toBeLessThan(tokens.length);
            done();
          })
          .catch(err => done(err));
        });
    });
  });


});
