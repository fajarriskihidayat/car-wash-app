const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db.config");

class User extends Model {}

User.init(
  {
    nib: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    nama: {
      type: DataTypes.STRING,
    },
    nama_usaha: {
      type: DataTypes.STRING,
    },
    harga_mobil: {
      type: DataTypes.INTEGER,
    },
    harga_motor: {
      type: DataTypes.INTEGER,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Users",
  }
);

module.exports = User;
