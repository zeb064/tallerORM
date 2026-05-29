const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Prestamo extends Model {}

Prestamo.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fecha_prestamo: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_devolucion_esp: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fecha_devolucion_real: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Prestamo',
  tableName: 'prestamos',
  timestamps: true
});

module.exports = Prestamo;
