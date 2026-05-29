const { sequelize, Libro, Autor, Usuario, Prestamo } = require('./models');

async function seed() {
  await sequelize.sync({ force: true });

  // Autores
  const autor1 = await Autor.create({ nombre: 'Gabriel', apellido: 'García Márquez', nacionalidad: 'Colombiana' });
  const autor2 = await Autor.create({ nombre: 'Isabel', apellido: 'Allende', nacionalidad: 'Chilena' });
  const autor3 = await Autor.create({ nombre: 'Jorge Luis', apellido: 'Borges', nacionalidad: 'Argentina' });

  // Libros
  const libro1 = await Libro.create({ titulo: 'Cien Años de Soledad', isbn: '978-84-376-0494-7', anio_publicacion: 1967, copias_disponibles: 3 });
  const libro2 = await Libro.create({ titulo: 'El Amor en los Tiempos del Cólera', isbn: '978-84-376-0495-4', anio_publicacion: 1985, copias_disponibles: 2 });
  const libro3 = await Libro.create({ titulo: 'La Casa de los Espíritus', isbn: '978-84-322-0777-3', anio_publicacion: 1982, copias_disponibles: 2 });
  const libro4 = await Libro.create({ titulo: 'Ficciones', isbn: '978-84-206-3329-5', anio_publicacion: 1944, copias_disponibles: 1 });
  const libro5 = await Libro.create({ titulo: 'El Aleph', isbn: '978-84-206-3330-1', anio_publicacion: 1949, copias_disponibles: 1 });

  // Asociar libros con autores
  await libro1.setAutores([autor1]);
  await libro2.setAutores([autor1]);
  await libro3.setAutores([autor2]);
  await libro4.setAutores([autor3]);
  await libro5.setAutores([autor3]);

  // Usuarios
  const usuario1 = await Usuario.create({ nombre: 'Ana López', email: 'ana@example.com' });
  const usuario2 = await Usuario.create({ nombre: 'Carlos Ruiz', email: 'carlos@example.com' });

  // Préstamos
  const hoy = new Date();
  const dentroDe14 = new Date(hoy); dentroDe14.setDate(dentroDe14.getDate() + 14);
  const dentroDe7 = new Date(hoy); dentroDe7.setDate(dentroDe7.getDate() + 7);

  await Prestamo.create({
    libro_id: libro1.id,
    usuario_id: usuario1.id,
    fecha_prestamo: hoy,
    fecha_devolucion_esp: dentroDe14
  });

  await Prestamo.create({
    libro_id: libro3.id,
    usuario_id: usuario2.id,
    fecha_prestamo: hoy,
    fecha_devolucion_esp: dentroDe7
  });

  // Actualizar copias disponibles por los préstamos
  await libro1.decrement('copias_disponibles', { by: 1 });
  await libro3.decrement('copias_disponibles', { by: 1 });

  console.log('Datos de prueba insertados correctamente.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Error al insertar datos:', err);
  process.exit(1);
});
