ecommerce-api
===========
An API built with node, express, and MongoDB to support the administrative and content management of an ecommerce website.

Getting Started
-----

Make sure MongoDB is running is a separate terminal window.

`sudo mongod`

Clone the repo and install dependencies

```
git clone https://github.com/stephlynpancho/reactredux_ecommerce_api.git
cd ecommerce-api
npm install
npm start
```

In a new terminal window, create a superuser, specifying email and password as command arguments.

`npm run createsuperuser -- -e admin@admin.com -p password`