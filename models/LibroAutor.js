const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class LibroAutor extends Model {}

LibroAutor.init({
  libro_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: { model: 'libros', key: 'id' }
  },
  autor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: { model: 'autores', key: 'id' }
  }
}, {
  sequelize,
  modelName: 'LibroAutor',
  tableName: 'libro_autor',
  timestamps: false
});

module.exports = LibroAutor;
