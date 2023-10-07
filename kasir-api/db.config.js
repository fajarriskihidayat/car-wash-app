const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("kasir_pencucian", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
