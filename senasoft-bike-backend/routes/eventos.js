// =====================================================
// 📦 Importaciones necesarias
// =====================================================
const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa la conexión a la base de datos PostgreSQL

// =====================================================
// 🟢 RUTA 1: PUBLICAR UN NUEVO EVENTO (SOLO ADMIN)
// -----------------------------------------------------
// Método: POST
// URL: http://localhost:5000/api/eventos
// Cuerpo (Body):
// {
//    "nombre": "Carrera ecológica",
//    "descripcion": "Evento de ciclismo urbano",
//    "fecha_hora": "2025-11-05 09:00:00",
//    "ubicacion": "Bogotá",
//    "creado_por_admin": true
// }
// -----------------------------------------------------
// Esta ruta permite que un administrador publique un nuevo evento.
// Valida que todos los campos requeridos estén presentes antes de insertarlo en la BD.
// =====================================================
router.post('/', async (req, res) => {
    const { nombre, descripcion, fecha_hora, ubicacion, creado_por_admin } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !fecha_hora || !ubicacion || !creado_por_admin) {
        return res.status(400).json({ error: 'Nombre, fecha, ubicación y admin son obligatorios.' });
    }

    try {
        // Inserta el nuevo evento en la tabla 'eventos'
        const result = await db.query(
            'INSERT INTO eventos (nombre, descripcion, fecha_hora, ubicacion, creado_por_admin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, descripcion, fecha_hora, ubicacion, creado_por_admin]
        );

        // Respuesta exitosa al cliente
        res.status(201).json({
            message: 'Evento publicado exitosamente.',
            evento: result.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al publicar el evento.' });
    }
});


// =====================================================
// 🔵 RUTA 2: LISTAR TODOS LOS EVENTOS
// -----------------------------------------------------
// Método: GET
// URL: http://localhost:5000/api/eventos
// -----------------------------------------------------
// Esta ruta devuelve todos los eventos almacenados en la base de datos,
// ordenados cronológicamente por fecha y hora.
// =====================================================
router.get('/', async (req, res) => {
    try {
        // Consulta SQL que obtiene todos los eventos ordenados por fecha
        const result = await db.query('SELECT * FROM eventos ORDER BY fecha_hora ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los eventos.' });
    }
});


// =====================================================
// 🟣 RUTA 3: PARTICIPAR EN UN EVENTO
// -----------------------------------------------------
// Método: POST
// URL: http://localhost:5000/api/eventos/participar
// Cuerpo (Body):
// {
//    "usuario_id": 1,
//    "evento_id": 5
// }
// -----------------------------------------------------
// Esta ruta permite que un usuario se inscriba en un evento disponible.
// Se validan los datos y se impide la doble inscripción.
// =====================================================
router.post('/participar', async (req, res) => {
    const { usuario_id, evento_id } = req.body;

    // Validar campos requeridos
    if (!usuario_id || !evento_id) {
        return res.status(400).json({ error: 'ID de usuario y ID de evento son obligatorios.' });
    }

    try {
        // Verificar que el evento exista en la base de datos
        const eventoResult = await db.query('SELECT * FROM eventos WHERE id = $1', [evento_id]);
        if (eventoResult.rows.length === 0) {
            return res.status(404).json({ error: 'Evento no encontrado.' });
        }

        // Verificar que el usuario no esté ya inscrito
        const participacionResult = await db.query(
            'SELECT * FROM participaciones WHERE usuario_id = $1 AND evento_id = $2',
            [usuario_id, evento_id]
        );

        if (participacionResult.rows.length > 0) {
            return res.status(409).json({ error: 'Ya estás inscrito en este evento.' });
        }

        // Registrar la participación en la tabla 'participaciones'
        await db.query(
            'INSERT INTO participaciones (usuario_id, evento_id) VALUES ($1, $2)',
            [usuario_id, evento_id]
        );

        res.json({ message: '¡Te has inscrito exitosamente en el evento!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al inscribirse en el evento.' });
    }
});

// =====================================================
// 📤 Exportar el router para que pueda usarse en server.js
// =====================================================
module.exports = router;
