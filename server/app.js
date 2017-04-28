require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const _ = require('lodash');

const mongoose = require('./db/mongoose');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

const corsOptions = {
	origin: process.env.CORS_ORIGIN,
	exposedHeaders: 'x-auth'
};
app.use(cors(corsOptions));

app.use((req, res, next) => {

	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;

	console.log(log);

	next();
});

// register db models to edit in admin portal
module.exports.collections = _.pick(mongoose.models, 'product', 'product_category');

// routes
app.use('/', require('./routes'));
app.use('/admin', require('./routes/admin'));
app.use('/auth', require('./routes/auth'));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});

module.exports.app = app;
