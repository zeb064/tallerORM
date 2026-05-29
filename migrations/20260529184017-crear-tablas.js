'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Tabla: autores
    await queryInterface.createTable('autores', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      apellido: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      nacionalidad: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Tabla: libros
    await queryInterface.createTable('libros', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      titulo: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      isbn: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      anio_publicacion: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      copias_disponibles: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Tabla: usuarios
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true
      },
      activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Tabla intermedia: libro_autor
    await queryInterface.createTable('libro_autor', {
      libro_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'libros', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      autor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'autores', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });

    await queryInterface.addConstraint('libro_autor', {
      fields: ['libro_id', 'autor_id'],
      type: 'primary key',
      name: 'pk_libro_autor'
    });

    // Tabla: prestamos
    await queryInterface.createTable('prestamos', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      libro_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'libros', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      fecha_prestamo: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      fecha_devolucion_esp: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      fecha_devolucion_real: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Índices para FK
    await queryInterface.addIndex('prestamos', ['libro_id']);
    await queryInterface.addIndex('prestamos', ['usuario_id']);
    await queryInterface.addIndex('libro_autor', ['libro_id']);
    await queryInterface.addIndex('libro_autor', ['autor_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('prestamos');
    await queryInterface.dropTable('libro_autor');
    await queryInterface.dropTable('usuarios');
    await queryInterface.dropTable('libros');
    await queryInterface.dropTable('autores');
  }
};
