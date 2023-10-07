const bcrypt = require("bcrypt");
const UsersModel = require("../models/users");

const passwordCheck = async (nib, password) => {
  const userData = await UsersModel.findOne({ where: { nib: nib } });
  const compare = await bcrypt.compare(password, userData.password);
  return { userData, compare };
};

module.exports = passwordCheck;
