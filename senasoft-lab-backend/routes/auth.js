// senasoft-lab-backend/routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const axios = require('axios'); // Para hacer la petición a Google reCAPTCHA

router.post('/login', async (req, res) => {
    const { tipo_identificacion, numero_identificacion, fecha_nacimiento, recaptcha } = req.body;

    // Validaciones
    if (!tipo_identificacion || !numero_identificacion || !fecha_nacimiento || !recaptcha) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        // Validar el CAPTCHA con Google reCAPTCHA
        const secretKey = '6Ld3yNMrAAAAANo82mDDRQaReCa8ZBhhkYQb3hPp'; // 🔴 ¡Esta es la clave secreta!
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            `secret=${secretKey}&response=${recaptcha}`
        );

        if (!response.data.success) {
            return res.status(401).json({ error: 'Verificación CAPTCHA fallida. Por favor, inténtalo de nuevo.' });
        }

        // Consultar en la tabla 'pacientes'
        const result = await db.query(
            'SELECT * FROM pacientes WHERE tipo_documento = $1 AND numero_documento = $2 AND fecha_nacimiento = $3',
            [tipo_identificacion, numero_identificacion, fecha_nacimiento]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Paciente no encontrado. Verifica tus datos.' });
        }

        const paciente = result.rows[0];
        res.json({
            message: 'Login exitoso.',
            paciente: {
                id: paciente.id,
                tipo_documento: paciente.tipo_documento,
                numero_documento: paciente.numero_documento,
                nombre_completo: paciente.nombre_completo,
                fecha_nacimiento: paciente.fecha_nacimiento,
                sexo: paciente.sexo,
                direccion: paciente.direccion,
                celular: paciente.celular,
                correo: paciente.correo
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
});

module.exports = router;
