const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true, // ou false, dependendo da configuração do seu banco de dados
    },
  },
});

module.exports = db;