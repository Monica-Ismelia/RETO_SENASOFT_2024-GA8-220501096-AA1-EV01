require('dotenv').config(); // principio absoluto
// F:\Documentos\reto\senasoft-lab-backend\server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001; // Usamos el puerto 5001 para no interferir con el backend de bicicletas

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'Backend del Portal de Resultados de Laboratorio funcionando!' });
});

// Importar rutas de autenticación
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
