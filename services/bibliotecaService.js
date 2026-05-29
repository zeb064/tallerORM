const { Op } = require('sequelize');
const { Libro, Autor, Usuario, Prestamo, sequelize } = require('../models');

class BibliotecaService {

  // R4.1 — Registrar un libro con sus autores
  async registrarLibro(datosLibro, autorIds) {
    const libro = await Libro.create(datosLibro);
    if (autorIds && autorIds.length > 0) {
      const autores = await Autor.findAll({ where: { id: autorIds } });
      await libro.setAutores(autores);
    }
    return Libro.findByPk(libro.id, {
      include: [{ model: Autor, as: 'autores' }]
    });
  }

  // R4.2 — Listar libros activos con sus autores (sin N+1)
  async listarLibrosActivos() {
    return Libro.findAll({
      where: { activo: true },
      include: [{ model: Autor, as: 'autores' }],
      order: [['titulo', 'ASC']]
    });
  }

  // R4.3 — Registrar un préstamo (descontar copias_disponibles)
  async registrarPrestamo(libroId, usuarioId, diasPrestamo = 14) {
    const t = await sequelize.transaction();
    try {
      const libro = await Libro.findByPk(libroId, { transaction: t });
      if (!libro) throw new Error('Libro no encontrado');
      if (!libro.activo) throw new Error('El libro no está activo');
      if (libro.copias_disponibles <= 0) {
        throw new Error('No hay copias disponibles para prestar');
      }

      const ahora = new Date();
      const devolucionEsp = new Date(ahora);
      devolucionEsp.setDate(devolucionEsp.getDate() + diasPrestamo);

      const prestamo = await Prestamo.create({
        libro_id: libroId,
        usuario_id: usuarioId,
        fecha_prestamo: ahora,
        fecha_devolucion_esp: devolucionEsp
      }, { transaction: t });

      await libro.decrement('copias_disponibles', { by: 1, transaction: t });

      await t.commit();
      return Prestamo.findByPk(prestamo.id, {
        include: [
          { model: Libro, as: 'libro' },
          { model: Usuario, as: 'usuario' }
        ]
      });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // R4.4 — Registrar devolución (restablecer copias)
  async registrarDevolucion(prestamoId) {
    const t = await sequelize.transaction();
    try {
      const prestamo = await Prestamo.findByPk(prestamoId, { transaction: t });
      if (!prestamo) throw new Error('Préstamo no encontrado');
      if (prestamo.fecha_devolucion_real) {
        throw new Error('Este préstamo ya fue devuelto');
      }

      prestamo.fecha_devolucion_real = new Date();
      await prestamo.save({ transaction: t });

      await Libro.increment('copias_disponibles', {
        by: 1,
        where: { id: prestamo.libro_id },
        transaction: t
      });

      await t.commit();
      return Prestamo.findByPk(prestamoId, {
        include: [
          { model: Libro, as: 'libro' },
          { model: Usuario, as: 'usuario' }
        ]
      });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  // R4.5 — Consultar préstamos activos (sin fecha_devolucion_real)
  async listarPrestamosActivos() {
    return Prestamo.findAll({
      where: { fecha_devolucion_real: null },
      include: [
        { model: Libro, as: 'libro' },
        { model: Usuario, as: 'usuario' }
      ],
      order: [['fecha_prestamo', 'DESC']]
    });
  }

  // — Helper: crear autor
  async crearAutor(datos) {
    return Autor.create(datos);
  }

  // — Helper: crear usuario
  async crearUsuario(datos) {
    return Usuario.create(datos);
  }

  // — Helper: consultar préstamos por usuario
  async listarPrestamosPorUsuario(usuarioId) {
    return Prestamo.findAll({
      where: { usuario_id: usuarioId },
      include: [{ model: Libro, as: 'libro' }],
      order: [['fecha_prestamo', 'DESC']]
    });
  }
}

module.exports = new BibliotecaService();
