const errorHandler = (err, req, res, next) => {
  const errors = {};

  try {
    Object.keys(err.errors).forEach(error => {
      errors[error] = err.errors[error].message;
    });
    res.status(422).send({errors});

  } catch (e) {
    if (err.path) {
      errors[err.path] = `${err.path} entered is invalid`;
      return res.status(422).send({errors});
    }
    res.status(422).send(err);

  } finally {
    console.log(err);
    next();
  };

};

module.exports = errorHandler;
