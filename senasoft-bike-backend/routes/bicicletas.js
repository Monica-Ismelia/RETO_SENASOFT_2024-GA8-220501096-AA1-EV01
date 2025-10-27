// Importamos Express y creamos el router para manejar las rutas de bicicletas
const express = require('express');
const router = express.Router();

// Importamos la conexión a la base de datos desde db.js
const db = require('../db');

// =====================================================
// 🟢 RUTA 1: OBTENER TODAS LAS BICICLETAS
// Método: GET
// URL: http://localhost:5000/api/bicicletas
// =====================================================
router.get('/', async (req, res) => {
    try {
        // Consulta SQL para traer todas las bicicletas ordenadas por su ID
        const result = await db.query('SELECT * FROM bicicletas ORDER BY id ASC');
        res.json(result.rows); // Devuelve el resultado en formato JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las bicicletas.' });
    }
});


// =====================================================
// 🟢 RUTA 2: OBTENER SOLO LAS BICICLETAS DISPONIBLES
// Método: GET
// URL: http://localhost:5000/api/bicicletas/disponibles
// =====================================================
router.get('/disponibles', async (req, res) => {
    try {
        // Consulta SQL para traer solo las bicicletas con estado "disponible"
        const result = await db.query('SELECT * FROM bicicletas WHERE estado = $1', ['disponible']);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las bicicletas disponibles.' });
    }
});


// =====================================================
// 🟡 RUTA 3: ALQUILAR UNA BICICLETA
// Método: POST
// URL: http://localhost:5000/api/bicicletas/alquilar
// =====================================================
router.post('/alquilar', async (req, res) => {
    const { usuario_id, bicicleta_id } = req.body;

    // Validar que los datos requeridos estén presentes
    if (!usuario_id || !bicicleta_id) {
        return res.status(400).json({ error: 'El ID del usuario y el ID de la bicicleta son obligatorios.' });
    }

    try {
        // Verificar que la bicicleta esté disponible para alquilar
        const bicicletaResult = await db.query('SELECT * FROM bicicletas WHERE id = $1 AND estado = $2', [bicicleta_id, 'disponible']);
        if (bicicletaResult.rows.length === 0) {
            return res.status(400).json({ error: 'La bicicleta no está disponible o no existe.' });
        }

        const bicicleta = bicicletaResult.rows[0];
        const tarifaInicial = bicicleta.precio_por_hora;

        // Cambiar el estado de la bicicleta a "alquilada"
        await db.query('UPDATE bicicletas SET estado = $1 WHERE id = $2', ['alquilada', bicicleta_id]);

        // Crear un registro del alquiler
        const alquilerResult = await db.query(
            'INSERT INTO alquileres (usuario_id, bicicleta_id, tarifa_inicial) VALUES ($1, $2, $3) RETURNING *',
            [usuario_id, bicicleta_id, tarifaInicial]
        );

        res.status(201).json({
            message: 'Bicicleta alquilada exitosamente.',
            alquiler: alquilerResult.rows[0]
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al alquilar la bicicleta.' });
    }
});


// =====================================================
// 🔵 RUTA 4: DEVOLVER UNA BICICLETA
// Método: POST
// URL: http://localhost:5000/api/bicicletas/devolver
// =====================================================
router.post('/devolver', async (req, res) => {
    const { alquiler_id, horas_uso } = req.body;

    // Validar datos requeridos
    if (!alquiler_id || !horas_uso) {
        return res.status(400).json({ error: 'El ID del alquiler y las horas de uso son obligatorios.' });
    }

    try {
        // Consultar el alquiler junto con la información del usuario y la bicicleta
        const alquilerResult = await db.query(
            'SELECT a.*, u.estrato_socioeconomico, b.precio_por_hora ' +
            'FROM alquileres a ' +
            'JOIN usuarios u ON a.usuario_id = u.id ' +
            'JOIN bicicletas b ON a.bicicleta_id = b.id ' +
            'WHERE a.id = $1',
            [alquiler_id]
        );

        if (alquilerResult.rows.length === 0) {
            return res.status(404).json({ error: 'Alquiler no encontrado.' });
        }

        const alquiler = alquilerResult.rows[0];
        const precioPorHora = alquiler.precio_por_hora;
        const estrato = alquiler.estrato_socioeconomico;

        // Calcular valor final del alquiler
        let valorBruto = precioPorHora * horas_uso;
        let descuento = 0;

        // Aplicar descuento según estrato socioeconómico
        if (estrato === 1 || estrato === 2) {
            descuento = 0.10; // 10%
        } else if (estrato === 3 || estrato === 4) {
            descuento = 0.05; // 5%
        }

        let valorFinal = valorBruto - (valorBruto * descuento);

        // Actualizar el registro de alquiler con el valor final y la fecha de devolución
        await db.query(
            'UPDATE alquileres SET fecha_hora_fin = NOW(), valor_final = $1 WHERE id = $2',
            [valorFinal, alquiler_id]
        );

        // Cambiar estado de la bicicleta a "disponible"
        await db.query('UPDATE bicicletas SET estado = $1 WHERE id = $2', ['disponible', alquiler.bicicleta_id]);

        res.json({
            message: 'Bicicleta devuelta exitosamente.',
            valor_a_pagar: parseFloat(valorFinal).toFixed(2),
            descuento_aplicado: (descuento * 100) + '%'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al devolver la bicicleta.' });
    }
});


// =====================================================
// 🧮 RUTA 5: CALCULAR GANANCIAS MENSUALES (ADMIN)
// Método: GET
// URL: http://localhost:5000/api/bicicletas/ganancias-mensuales?mes=5&anio=2024
// =====================================================
router.get('/ganancias-mensuales', async (req, res) => {
    const { mes, anio } = req.query;

    if (!mes || !anio) {
        return res.status(400).json({ error: 'Mes y año son obligatorios.' });
    }

    try {
        // Calcular la suma de todas las ganancias del mes/año
        const result = await db.query(
            'SELECT SUM(valor_final) AS ganancias_netas ' +
            'FROM alquileres ' +
            'WHERE EXTRACT(MONTH FROM fecha_hora_fin) = $1 AND EXTRACT(YEAR FROM fecha_hora_fin) = $2',
            [mes, anio]
        );

        const ganancias = result.rows[0].ganancias_netas || 0;

        res.json({
            mes: mes,
            anio: anio,
            ganancias_netas: parseFloat(ganancias).toFixed(2)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al calcular las ganancias.' });
    }
});


// =====================================================
// 🗺️ RUTA 6: OBTENER BICICLETAS ALQUILADAS CON UBICACIÓN (MAPA)
// Método: GET
// URL: http://localhost:5000/api/bicicletas/alquiladas
// =====================================================
router.get('/alquiladas', async (req, res) => {
    try {
        // Trae las bicicletas que están alquiladas
        const result = await db.query(
            'SELECT b.id, b.marca, b.color, b.ubicacion_regional ' +
            'FROM bicicletas b ' +
            'WHERE b.estado = $1',
            ['alquilada']
        );

        // Coordenadas simuladas para las regionales (en un sistema real vendrían de GPS)
        const ubicaciones = {
        'Bogotá': [-74.0721, 4.7110],
        'Medellín': [-75.5636, 6.2442],
        'Cali': [-76.5320, 3.4372], 
        'Barranquilla': [-74.7969, 10.9685],
        'Cartagena': [-75.5182, 10.3910]
    };

        // Añadir las coordenadas según la ubicación registrada
        const bicicletasConUbicacion = result.rows.map(bici => {
  const ubicacionLimpia = bici.ubicacion_regional.trim();
  return {
    ...bici,
    coordenadas: ubicaciones[ubicacionLimpia] || [-74.0721, 4.7110]
  };
});

        res.json(bicicletasConUbicacion);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las bicicletas alquiladas.' });
    }
});


// =====================================================
// 🔵 RUTA 7: OBTENER LA BICICLETA ACTIVA DE UN USUARIO
// Método: GET
// URL: http://localhost:5000/api/bicicletas/usuario/:usuarioId/activa
// =====================================================

// RUTA: Obtener bicicleta activa de un usuario
router.get('/usuario/:usuarioId/activa', async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const result = await db.query(
            `SELECT 
                a.id AS alquiler_id,
                b.id, 
                b.marca, 
                b.color, 
                b.precio_por_hora,
                b.ubicacion_regional,
                a.fecha_hora_inicio
            FROM alquileres a
            JOIN bicicletas b ON a.bicicleta_id = b.id
            WHERE a.usuario_id = $1 AND a.fecha_hora_fin IS NULL`,
            [usuarioId]
        );

        if (result.rows.length === 0) {
            return res.json(null);
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al obtener bicicleta activa:', err);
        res.status(500).json({ error: 'Error al consultar la bicicleta activa.' });
    }
});
// =====================================================
// 🔵 RUTA 8: DEVOLVER BICICLETA POR USUARIO (sin alquiler_id)
// Método: POST
// URL: http://localhost:5000/api/bicicletas/devolver-por-usuario
// Body: { "usuario_id": 1, "horas_uso": 2 }
// =====================================================
router.post('/devolver-por-usuario', async (req, res) => {
    const { usuario_id, horas_uso } = req.body;

    if (!usuario_id || !horas_uso) {
        return res.status(400).json({ error: 'El ID del usuario y las horas de uso son obligatorios.' });
    }

    try {
        // Buscar el alquiler activo del usuario
        const alquilerActivo = await db.query(
            `SELECT a.id, a.bicicleta_id, b.precio_por_hora, u.estrato_socioeconomico
             FROM alquileres a
             JOIN bicicletas b ON a.bicicleta_id = b.id
             JOIN usuarios u ON a.usuario_id = u.id
             WHERE a.usuario_id = $1 AND a.fecha_hora_fin IS NULL`,
            [usuario_id]
        );

        if (alquilerActivo.rows.length === 0) {
            return res.status(400).json({ error: 'No tienes una bicicleta alquilada activa.' });
        }

        const alquiler = alquilerActivo.rows[0];
        const { id: alquiler_id, bicicleta_id, precio_por_hora, estrato_socioeconomico } = alquiler;

        // Aplicar descuento según estrato
        let descuento = 0;
        if (estrato_socioeconomico === 1 || estrato_socioeconomico === 2) {
            descuento = 0.10;
        } else if (estrato_socioeconomico === 3 || estrato_socioeconomico === 4) {
            descuento = 0.05;
        }

        const valorBruto = precio_por_hora * horas_uso;
        const valorFinal = valorBruto - (valorBruto * descuento);

        // Actualizar alquiler
        await db.query(
            'UPDATE alquileres SET fecha_hora_fin = NOW(), valor_final = $1 WHERE id = $2',
            [valorFinal, alquiler_id]
        );

        // Liberar bicicleta
        await db.query('UPDATE bicicletas SET estado = $1 WHERE id = $2', ['disponible', bicicleta_id]);

        res.json({
            message: 'Bicicleta devuelta exitosamente.',
            valor_a_pagar: parseFloat(valorFinal).toFixed(2),
            descuento_aplicado: (descuento * 100) + '%'
        });

    } catch (err) {
        console.error('Error al devolver bicicleta por usuario:', err);
        res.status(500).json({ error: 'Error al procesar la devolución.' });
    }
});
// NUEVA RUTA: para el panel de administrador
router.get('/alquiladas/detallado', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        b.id AS bicicleta_id,
        b.marca,
        b.color,
        b.ubicacion_regional,
        a.id AS alquiler_id,
        a.fecha_hora_inicio,
        u.nombre_completo,
        u.numero_documento,
        u.estrato_socioeconomico
      FROM alquileres a
      JOIN bicicletas b ON a.bicicleta_id = b.id
      JOIN usuarios u ON a.usuario_id = u.id
      WHERE a.fecha_hora_fin IS NULL
      ORDER BY a.fecha_hora_inicio DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en /alquiladas/detallado:', err);
    res.status(500).json({ error: 'Error al cargar bicicletas alquiladas.' });
  }
});
// Exportamos el router para usarlo en server.js
module.exports = router;
