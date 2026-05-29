const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Libro extends Model {}

Libro.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: { notEmpty: true }
  },
  isbn: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: { notEmpty: true }
  },
  anio_publicacion: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { min: 1000, max: 9999 }
  },
  copias_disponibles: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: { min: 0 }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Libro',
  tableName: 'libros',
  timestamps: true
});

module.exports = Libro;
