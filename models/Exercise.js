const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Exercise = sequelize.define("Exercise", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: DataTypes.STRING,
  series: DataTypes.INTEGER,
  charge: DataTypes.INTEGER,
  movements: DataTypes.INTEGER,
  description: DataTypes.STRING,
  trainingBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});



module.exports = Exercise;
