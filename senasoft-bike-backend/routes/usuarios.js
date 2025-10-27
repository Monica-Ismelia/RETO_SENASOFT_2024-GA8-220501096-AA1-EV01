const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Listar todos los usuarios
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, nombre_completo, tipo_documento, numero_documento, 
             fecha_nacimiento, estrato_socioeconomico, correo, es_admin
      FROM usuarios
      ORDER BY nombre_completo
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios.' });
  }
});

// Crear usuario (admin)
router.post('/', async (req, res) => {
  const { nombre_completo, tipo_documento, numero_documento, fecha_nacimiento, 
          estrato_socioeconomico, correo, contrasena, es_admin = false } = req.body;

  try {
    const hashed = await bcrypt.hash(contrasena, 10);
    const fechaFormateada = new Date(fecha_nacimiento).toISOString().split('T')[0];
    const result = await db.query(`
      INSERT INTO usuarios (nombre_completo, tipo_documento, numero_documento, 
                            fecha_nacimiento, estrato_socioeconomico, correo, 
                            contrasena, es_admin)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, nombre_completo, correo, es_admin
    `, [nombre_completo, tipo_documento, numero_documento, fecha_nacimiento,
        estrato_socioeconomico, correo, hashed, es_admin]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El correo o documento ya existe.' });
    }
    res.status(500).json({ error: 'Error al crear usuario.' });
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_completo, estrato_socioeconomico, es_admin } = req.body;

  try {
    const result = await db.query(`
      UPDATE usuarios 
      SET nombre_completo = $1, estrato_socioeconomico = $2, es_admin = $3
      WHERE id = $4
      RETURNING id, nombre_completo, estrato_socioeconomico, es_admin
    `, [nombre_completo, estrato_socioeconomico, es_admin, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario.' });
  }
});

module.exports = router;