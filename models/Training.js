const { DataTypes } = require("sequelize");
const db = require("../db/db"); // importando configuração do banco

const Training = db.define(
  "Training",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Training;
