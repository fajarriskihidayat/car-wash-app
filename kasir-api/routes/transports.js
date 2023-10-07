const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const TransportsModel = require("../models/transports");

router.get("/all/:nib", async (req, res) => {
  const { nib } = req.params;

  const date = new Date();

  const transport = await TransportsModel.findAll({
    where: {
      [Op.and]: [
        { user_nib: nib },
        {
          tanggal: date,
        },
      ],
    },
  });
  res.status(200).json({
    data: transport,
    metadata: "Get all transports by nib",
  });
});

router.get("/details/:id", async (req, res) => {
  const { id } = req.params;

  const transport = await TransportsModel.findOne({
    where: { id: id },
  });
  res.status(200).json({
    data: transport,
    metadata: "Detail transport by id",
  });
});

router.get("/search", async (req, res) => {
  const { nib, tanggal } = req.query;

  const formattedTanggal = new Date(tanggal);

  const transport = await TransportsModel.findAll({
    where: {
      [Op.and]: [
        { user_nib: nib },
        {
          tanggal: formattedTanggal,
        },
      ],
    },
  });

  res.status(200).json({
    data: transport,
    metadata: "Get all transpot by tanggal",
  });
});

router.post("/", async (req, res) => {
  const { user_nib, nama_pemilik, jenis, tanggal, waktu, antrian, status } =
    req.body;

  if (!user_nib || !nama_pemilik || !jenis || !tanggal || !waktu) {
    res.status(400).json({
      error: "Bad request",
    });
  } else {
    const transport = await TransportsModel.create({
      user_nib,
      nama_pemilik,
      jenis,
      tanggal,
      waktu,
      antrian,
      status: "Belum Selesai",
    });

    res.status(200).json({
      data: transport,
      metadata: "Create transport success",
    });
  }
});

router.put("/", async (req, res) => {
  const { id, nama_pemilik, jenis, tanggal, waktu } = req.body;

  const transport = await TransportsModel.update(
    {
      nama_pemilik,
      jenis,
      tanggal,
      waktu,
    },
    { where: { id: id } }
  );

  if (transport[0] === 1) {
    res.status(200).json({
      data: { updated: transport[0] },
      metadata: "Update transport success",
    });
  } else {
    res.status(404).json({
      error: "Transport not found",
    });
  }
});

router.put("/waiting/:id", async (req, res) => {
  const { id } = req.params;

  const transport = await TransportsModel.update(
    {
      status: "Belum Selesai",
    },
    { where: { id: id } }
  );

  if (transport[0] === 1) {
    res.status(200).json({
      data: { updated: transport[0] },
      metadata: "Update transport success",
    });
  } else {
    res.status(404).json({
      error: "Transport not found",
    });
  }
});

router.put("/done/:id", async (req, res) => {
  const { id } = req.params;

  const transport = await TransportsModel.update(
    {
      status: "Selesai",
    },
    { where: { id: id } }
  );

  if (transport[0] === 1) {
    res.status(200).json({
      data: { updated: transport[0] },
      metadata: "Update transport success",
    });
  } else {
    res.status(404).json({
      error: "Transport not found",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const transport = await TransportsModel.destroy({ where: { id: id } });

  if (transport) {
    res.status(200).json({
      transport: { deleted: transport },
      metadata: "Delete transport success",
    });
  } else {
    res.status(404).json({
      error: "Transport not found",
    });
  }
});

module.exports = router;
