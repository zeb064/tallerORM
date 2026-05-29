const { sequelize } = require('./models');
const service = require('./services/bibliotecaService');

async function main() {
  // Sincronizar esquema
  await sequelize.sync({ force: true });
  console.log('Base de datos sincronizada.\n');

  // Crear autores
  const autor1 = await service.crearAutor({ nombre: 'Gabriel', apellido: 'García Márquez', nacionalidad: 'Colombiana' });
  const autor2 = await service.crearAutor({ nombre: 'Isabel', apellido: 'Allende', nacionalidad: 'Chilena' });
  console.log('Autores creados.');

  // R4.1 — Registrar libro con autores
  const libro = await service.registrarLibro(
    { titulo: 'Cien Años de Soledad', isbn: '978-84-376-0494-7', anio_publicacion: 1967, copias_disponibles: 3 },
    [autor1.id]
  );
  console.log('Libro registrado:', libro.titulo, '- Autores:', libro.autores.map(a => a.nombre).join(', '));

  await service.registrarLibro(
    { titulo: 'Ficciones', isbn: '978-84-206-3329-5', anio_publicacion: 1944, copias_disponibles: 1 },
    [autor2.id]
  );

  // R4.2 — Listar libros activos con autores (sin N+1)
  const activos = await service.listarLibrosActivos();
  console.log('\nLibros activos:');
  activos.forEach(l => console.log(`  - ${l.titulo} (${l.copias_disponibles} copias) [${l.autores.map(a => `${a.nombre} ${a.apellido}`).join(', ')}]`));

  // Crear usuario
  const usuario = await service.crearUsuario({ nombre: 'Ana López', email: 'ana@example.com' });
  console.log('\nUsuario creado:', usuario.nombre);

  // R4.3 — Registrar préstamo (transaccional)
  const prestamo = await service.registrarPrestamo(libro.id, usuario.id);
  console.log('Préstamo registrado:', prestamo.libro.titulo, '→', prestamo.usuario.nombre);

  // R4.5 — Listar préstamos activos
  const activosP = await service.listarPrestamosActivos();
  console.log('\nPréstamos activos:');
  activosP.forEach(p => console.log(`  - "${p.libro.titulo}" → ${p.usuario.nombre} (desde ${p.fecha_prestamo})`));

  // R4.4 — Registrar devolución (transaccional)
  const devuelto = await service.registrarDevolucion(prestamo.id);
  console.log('\nDevolución registrada para:', devuelto.libro.titulo);

  const activosFinal = await service.listarPrestamosActivos();
  console.log('Préstamos activos restantes:', activosFinal.length);

  console.log('\n¡Todos los requerimientos funcionan correctamente!');
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
