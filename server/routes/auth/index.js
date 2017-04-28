const router = require('express').Router();
const Users = require('../../controllers/usersController');
const authenticate = require('../../middleware/authenticate');

router.route('/signin')
  .get(authenticate, Users.verify)
  .post(Users.login);

router.route('/signup')
  .post(Users.create);

router.route('/signout')
  .delete(authenticate, Users.logout);


module.exports = router;
