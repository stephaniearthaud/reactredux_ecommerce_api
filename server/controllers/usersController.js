const mongoose = require('mongoose');
const User = mongoose.model('user');

class UsersController {

  create(req, res) {
    const {email, password, is_superuser} = req.body;

    const user = new User({email, password, is_superuser});
    user.save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(({user, token}) => {
      res.header('x-auth', token).send(user);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
  }

  login(req, res) {
    const {email, password} = req.body;
    User.findByCredentials(email, password)
    .then(user => {
      return user.generateAuthToken();
    })
    .then(({user, token}) => {
      res.header('x-auth', token).send(user);
    })
    .catch(err => {
      console.log(err);
      res.status(422).send();
    });
  }

  verify(req, res) {
    res.send();
  }

  logout(req, res) {
    req.user.removeToken(req.token)
      .then(() => {
        res.send();
      })
      .catch(() => {
        res.status(400).send();
      });
  }
}

module.exports = new UsersController();
