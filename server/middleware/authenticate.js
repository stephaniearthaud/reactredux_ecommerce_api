const mongoose = require('mongoose');
const User = mongoose.model('user');

const authenticate = (req, res, next) => {

	const token = req.header('x-auth');

	User.findByToken(token)
	.then(user => {
		if (!user) {
			return Promise.reject({access_error: 'Access Denied'});
		}
		if (!user.is_superuser) {
			return Promise.reject({access_error: 'This user does not have administrator access.'});
		}

		req.user = user;
		req.token = token;
		next();
	}).catch(e => {
		res.status(401).send(e);
	});

};

module.exports = authenticate;
