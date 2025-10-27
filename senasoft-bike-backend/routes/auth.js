// =====================================================
// ARCHIVO: routes/auth.js
// FUNCIÓN: Maneja el registro e inicio de sesión (login)
// =====================================================

// Importamos las herramientas necesarias
const express = require('express');
const router = express.Router(); // Permite crear rutas independientes
const bcrypt = require('bcrypt'); // Se usa para encriptar contraseñas
const db = require('../db'); // Conexión a la base de datos PostgreSQL

// =====================================================
// RUTA 1: REGISTRO DE NUEVO USUARIO
// =====================================================
router.post('/register', async (req, res) => {
    // Extraemos los datos enviados desde el frontend o Postman
    const {
        nombre_completo,
        tipo_documento,
        numero_documento,
        fecha_nacimiento,
        estrato_socioeconomico,
        correo,
        contrasena
    } = req.body;

    // Validamos que ningún campo esté vacío
    if (
        !nombre_completo ||
        !tipo_documento ||
        !numero_documento ||
        !fecha_nacimiento ||
        !estrato_socioeconomico ||
        !correo ||
        !contrasena
    ) {
        return res.status(400).json({ error: '❌ Todos los campos son obligatorios.' });
    }

    try {
        // 🔐 Encriptamos la contraseña antes de guardarla en la base de datos
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        // Validamos y formateamos la fecha correctamente
        const fechaObj = new Date(fecha_nacimiento);
        if (isNaN(fechaObj.getTime())) {
            return res.status(400).json({ error: '❌ La fecha de nacimiento no es válida.' });
        }
        const fechaFormateada = fechaObj.toISOString().split('T')[0];

        // Guardamos el nuevo usuario en la base de datos
        const result = await db.query(
            `INSERT INTO usuarios 
            (nombre_completo, tipo_documento, numero_documento, fecha_nacimiento, estrato_socioeconomico, correo, contrasena, es_admin)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, nombre_completo, correo, es_admin`,
            [
                nombre_completo,
                tipo_documento,
                numero_documento,
                fechaFormateada,
                estrato_socioeconomico,
                correo,
                hashedPassword,
                false // Por defecto todos los usuarios NO son administradores
            ]
        );

        // Respondemos con éxito al cliente
        res.status(201).json({
            message: '🎉 Usuario registrado exitosamente.',
            user: result.rows[0]
        });

    } catch (err) {
        console.error('🚨 Error DETALLADO en registro:', err);

        // ⚠️ Control de errores por duplicidad (correo o documento)
        if (err.code === '23505') {
            if (err.constraint === 'usuarios_correo_key') {
                return res.status(409).json({ error: '❌ El correo electrónico ya está registrado. Usa otro correo.' });
            } else if (err.constraint === 'usuarios_numero_documento_key') {
                return res.status(409).json({ error: '❌ El número de documento ya está registrado.' });
            } else {
                return res.status(409).json({ error: '❌ Ya existe un usuario con esos datos.' });
            }
        }

        // Error general
        res.status(500).json({ error: 'Hubo un problema técnico. Por favor, intenta más tarde.' });
    }
});

// =====================================================
// RUTA 2: INICIO DE SESIÓN (LOGIN)
// Permite login de:
//  🔸 Usuarios (con número de documento y fecha de nacimiento)
//  🔸 Administradores (con correo y contraseña)
// =====================================================
router.post('/login', async (req, res) => {
    const { tipo_login, numero_documento, fecha_nacimiento, correo, contrasena } = req.body;

    // =====================================================
    // LOGIN PARA USUARIOS NORMALES
    // =====================================================
    if (tipo_login === 'usuario') {
        if (!numero_documento || !fecha_nacimiento) {
            return res.status(400).json({ error: '❌ El número de documento y la fecha de nacimiento son obligatorios.' });
        }

        try {
            // Convertimos la fecha al formato correcto (YYYY-MM-DD)
            const fechaFormateada = new Date(fecha_nacimiento).toISOString().split('T')[0];

            // Buscamos el usuario en la base de datos
            const result = await db.query(
                'SELECT * FROM usuarios WHERE numero_documento = $1 AND fecha_nacimiento = $2',
                [numero_documento, fechaFormateada]
            );

            // Si no existe el usuario
            if (result.rows.length === 0) {
                return res.status(401).json({ error: '📧 Usuario no encontrado o datos incorrectos.' });
            }

            // Si existe, devolvemos los datos básicos
            const user = result.rows[0];
            res.json({
                message: '✅ Login exitoso. ¡Bienvenido!',
                user: {
                    id: user.id,
                    nombre_completo: user.nombre_completo,
                    es_admin: user.es_admin
                }
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Hubo un problema al iniciar sesión. Intenta de nuevo.' });
        }
    }

    // =====================================================
    // LOGIN PARA ADMINISTRADORES
    // =====================================================
    else if (tipo_login === 'admin') {
        if (!correo || !contrasena) {
            return res.status(400).json({ error: '❌ El correo y la contraseña son obligatorios.' });
        }

        try {
            // Buscamos el administrador por correo
            const result = await db.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);

            if (result.rows.length === 0) {
                return res.status(401).json({ error: '📧 Usuario no encontrado.' });
            }

            const user = result.rows[0];

            // Solo permite login si el usuario es admin
            if (!user.es_admin) {
                return res.status(401).json({ error: '🔒 Solo los administradores pueden iniciar sesión con correo y contraseña.' });
            }

            // Comparamos la contraseña ingresada con la encriptada
            const validPassword = await bcrypt.compare(contrasena, user.contrasena);

            if (!validPassword) {
                return res.status(401).json({ error: '🔒 Contraseña incorrecta.' });
            }

            // Login exitoso
            res.json({
                message: '✅ Login exitoso. ¡Bienvenido!',
                user: {
                    id: user.id,
                    nombre_completo: user.nombre_completo,
                    es_admin: user.es_admin
                }
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Hubo un problema al iniciar sesión. Intenta de nuevo.' });
        }
    }

    // =====================================================
    // CONTROL PARA TIPO DE LOGIN INVÁLIDO
    // =====================================================
    else {
        return res.status(400).json({ error: '❌ Tipo de login no válido.' });
    }
});


// =====================================================
// EXPORTAMOS EL ROUTER PARA USARLO EN server.js
// =====================================================
module.exports = router;
