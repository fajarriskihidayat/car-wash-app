const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const UsersModel = require("../models/users");
// const ListsModel = require("../models/lists");
const passwordCheck = require("../utils/passwordCheck");

router.get("/:nib", async (req, res) => {
  const { nib } = req.params;

  const users = await UsersModel.findOne({ where: { nib: nib } });

  res.status(200).json({
    data: users,
    metadata: "Get all users",
  });
});

router.post("/", async (req, res) => {
  const { nib, nama, nama_usaha, harga_mobil, harga_motor, password } =
    req.body;

  const encryptPwd = await bcrypt.hash(password, 10);

  if (
    !nib ||
    !nama ||
    !nama_usaha ||
    !harga_mobil ||
    !harga_motor ||
    !password
  ) {
    res.status(400).json({
      error: "Bad request",
    });
  } else {
    const users = await UsersModel.create({
      nib,
      nama,
      nama_usaha,
      harga_mobil,
      harga_motor,
      password: encryptPwd,
    });
    res.status(200).json({
      data: users,
      metadata: "Create user success",
    });
  }
});

router.put("/", async (req, res) => {
  const {
    nib,
    nama,
    nama_usaha,
    harga_mobil,
    harga_motor,
    password,
    passwordBaru,
  } = req.body;

  const user = await UsersModel.findOne({ where: { nib: nib } });
  if (!user) {
    res.status(404).json({
      error: "User Not Found",
    });
  } else {
    const check = await passwordCheck(nib, password);
    const encryptPwd = await bcrypt.hash(passwordBaru, 10);

    if (check.compare === true) {
      const users = await UsersModel.update(
        {
          nama,
          nama_usaha,
          harga_mobil,
          harga_motor,
          password: encryptPwd,
        },
        { where: { nib: nib } }
      );

      res.status(200).json({
        user: { updated: users[0] },
        metadata: "Update Data success",
      });
    } else {
      res.status(400).json({
        error: "Bad request",
      });
    }
  }
});

router.delete("/:nib", async (req, res) => {
  const { nib } = req.params;

  const user = await UsersModel.destroy({ where: { nib: nib } });

  if (!user) {
    res.status(404).json({
      error: "User Not Found",
    });
  } else {
    res.status(200).json({
      user: { deleted: user },
      metadata: "Delete user success",
    });
  }
});

router.post("/login", async (req, res) => {
  const { nib, password } = req.body;

  const check = await passwordCheck(nib, password);

  if (check.compare === true) {
    res.status(200).json({
      user: check.userData,
      metadata: "Login success",
    });
  } else {
    res.status(400).json({
      error: "Bad request",
    });
  }
});

module.exports = router;
