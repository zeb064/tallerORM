const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Autor extends Model {}

Autor.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: true }
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { notEmpty: true }
  },
  nacionalidad: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Autor',
  tableName: 'autores',
  timestamps: true
});

module.exports = Autor;
