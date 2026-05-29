# Biblioteca Digital - ORM

Proyecto del ejercicio final del Curso de ORM (Node.js + Sequelize).

## Entidades

- **Libro** — título, ISBN (único), año, copias disponibles, activo
- **Autor** — nombre, apellido, nacionalidad
- **Usuario** — nombre, email (único), activo
- **Préstamo** — libro, usuario, fecha préstamo, devolución esperada/real

## Relaciones

- `Libro` ⟷ `Autor`: N:M vía tabla intermedia `libro_autor`
- `Préstamo` → `Libro`: N:1
- `Préstamo` → `Usuario`: N:1

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Migraciones

```bash
npm run migrate
```

## Seed (datos de prueba)

```bash
npm run seed
```

## Ejecutar demo

```bash
npm start
```

## Estructura

```
├── config/
│   ├── config.json          # Configuración BD (SQLite)
│   └── database.js          # Conexión Sequelize
├── models/
│   ├── index.js             # Asociaciones
│   ├── Libro.js
│   ├── Autor.js
│   ├── Usuario.js
│   ├── Prestamo.js
│   └── LibroAutor.js        # Tabla intermedia
├── migrations/
│   └── 202...-crear-tablas.js
├── services/
│   └── bibliotecaService.js # CRUD + transacciones
├── seed.js                  # Datos iniciales
├── app.js                   # Demo de todas las operaciones
└── package.json
```

## Operaciones implementadas (R4)

1. Registrar libro con autores
2. Listar libros activos con autores (sin N+1)
3. Registrar préstamo (transaccional, descuenta stock)
4. Registrar devolución (transaccional, restaura stock)
5. Consultar préstamos activos
