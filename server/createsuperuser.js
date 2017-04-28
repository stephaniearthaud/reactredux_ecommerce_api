const yargs = require('yargs');
const axios = require('axios');

const SERVER_ROOT = 'https://ab-ecommerce-api.herokuapp.com';
const SIGNUP_URL = `${SERVER_ROOT}/auth/signup`;

const argv = yargs
  .options({
    e: {
      demand: true,
      alias: 'email',
      describe: 'Email address of superuser',
      string: true
    },
    p: {
      demand: true,
      alias: 'password',
      describe: 'Password of superuser',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

const {email, password} = argv;

axios.post(SIGNUP_URL, {email, password, is_superuser: true})
  .then(response => {
    console.log(`***** \n Superuser created with email = ${email} and password = ${password} \n*****`);
  })
  .catch(err => {
    console.log(err);
    if (err.code === 'ECONNREFUSED') {
      console.log(
        `
          \n Connection to ${SIGNUP_URL} refused.  Is this the correct URL?
          \n Make sure app server is running (npm start) in a separate terminal window.
        `
      );
    }
  });
