// db.js
// Cargamos las variables de entorno desde un archivo .env
require('dotenv').config();

// Importamos Pool de 'pg' para conectarnos a PostgreSQL
const { Pool } = require('pg');

// Creamos una instancia de Pool para manejar la conexión a la base de datos
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',       // Usuario de la base de datos, si no hay variable de entorno se usa 'postgres'
  host: process.env.DB_HOST || 'localhost',      // Host de la base de datos, por defecto 'localhost'
  database: process.env.DB_NAME || 'senasoft_bicicletas', // Nombre de la base de datos, por defecto 'senasoft_bicicletas'
  password: process.env.DB_PASS || '',   // Contraseña de la base de datos, por defecto 'Moni1981'
  port: process.env.DB_PORT || 5432,             // Puerto de conexión, por defecto 5432 (PostgreSQL)
});

// Exportamos una función 'query' que permite ejecutar consultas a la base de datos
// Recibe un texto SQL y parámetros opcionales
module.exports = {
  query: (text, params) => pool.query(text, params),
};
