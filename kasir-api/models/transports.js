const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db.config");
const Users = require("./users");

class Transports extends Model {}

Transports.init(
  {
    user_nib: {
      type: DataTypes.INTEGER,
      references: {
        model: Users,
        key: "nib",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    nama_pemilik: {
      type: DataTypes.STRING,
    },
    jenis: {
      type: DataTypes.STRING,
    },
    tanggal: {
      type: DataTypes.DATEONLY,
    },
    waktu: {
      type: DataTypes.TIME,
    },
    antrian: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM("Belum Selesai", "Selesai"),
    },
  },
  {
    sequelize,
    modelName: "Transports",
  }
);

module.exports = Transports;
