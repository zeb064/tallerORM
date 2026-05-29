const sequelize = require('../config/database');
const Libro = require('./Libro');
const Autor = require('./Autor');
const Usuario = require('./Usuario');
const Prestamo = require('./Prestamo');
const LibroAutor = require('./LibroAutor');

// Libro ↔ Autor (N:M via tabla intermedia)
Libro.belongsToMany(Autor, {
  through: LibroAutor,
  foreignKey: 'libro_id',
  otherKey: 'autor_id',
  as: 'autores'
});

Autor.belongsToMany(Libro, {
  through: LibroAutor,
  foreignKey: 'autor_id',
  otherKey: 'libro_id',
  as: 'libros'
});

// Prestamo → Libro (N:1)
Prestamo.belongsTo(Libro, {
  foreignKey: 'libro_id',
  as: 'libro'
});
Libro.hasMany(Prestamo, {
  foreignKey: 'libro_id',
  as: 'prestamos'
});

// Prestamo → Usuario (N:1)
Prestamo.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario'
});
Usuario.hasMany(Prestamo, {
  foreignKey: 'usuario_id',
  as: 'prestamos'
});

module.exports = {
  sequelize,
  Libro,
  Autor,
  Usuario,
  Prestamo,
  LibroAutor
};
