const expect = require('expect');
const request = require('supertest');
const {app} = require('../server/app');
const mongoose = require('mongoose');
const Product = mongoose.model('product');
const Category = mongoose.model('product_category');
const History = mongoose.model('history');
const User = mongoose.model('user');


let categoryOne;
let categoryTwo;
let categoryThree;
const users = {};

const createUser = done => {
  const admin = new User({
    email: 'admin@admin.com',
    password: 'password',
    is_superuser: 'true'
  });
  const regular = new User({
    email: 'regular@regular.com',
    password: 'password',
  });

  User.remove({})
  .then(() => {
    return Promise.all([admin.save(), regular.save()]);
  })
  .then(res => {
    return Promise.all([res[0].generateAuthToken(), res[1].generateAuthToken()]);
  })
  .then(([admin, regular]) => {
    users.admin = admin.user;
    users.regular = regular.user;
    done();
  })
  .catch(err => done(err));
};


const populateCategories = done => {
  categoryOne = new Category({
    name: 'Cat One'
  });
  categoryTwo = new Category({
    name: 'Cat Two'
  });
  categoryThree = new Category({
    name: 'Cat Three'
  });

  History.remove({})
  .then(() => {
    return Category.remove({});
  })
  .then(() => {
    return Promise.all([categoryOne.save(), categoryTwo.save(), categoryThree.save()]);
  })
  .then((res) => {
    done();
  })
  .catch(err => done(err));



};

const populateProducts = done => {
  const productOne = new Product({
    name: 'One',
    description: 'One',
    price: '19.64',
    category: categoryOne
  });
  const productTwo = new Product({
    name: 'Two',
    description: 'Two',
    price: '9.00',
    category: categoryTwo
  });
  const productThree = new Product({
    name: 'Three',
    description: 'Three',
    price: '199',
    category: categoryThree
  });
  Product.remove({})
    .then(() => {
      return Promise.all([productOne.save(), productTwo.save(), productThree.save()]);
    })
    .then(() => done())
    .catch(err => {
      done(err);
    });
};


module.exports = {
  expect,
  request,
  app,
  Product,
  Category,
  History,
  User,
  users,
  populateProducts,
  populateCategories,
  createUser
};
