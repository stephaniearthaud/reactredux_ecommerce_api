const {expect, request, app} = require('../test_helper');

describe('Index route', () => {
  it('get / should respond', (done) => {
    request(app)
      .get('/')
      .end((err, response) => {
        expect(response.body).toEqual({hello: 'world'});
        done();
      });
  });
});
