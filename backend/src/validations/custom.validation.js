const username = (value, helpers) => {
  if (value.length < 5 || value.length > 15) {
    return helpers.message('username must be in range 5-15 characters');
  }
  if (value.match(/ /)) {
    return helpers.message('username must not contain spaces');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

module.exports = {
  password,
  username,
};
