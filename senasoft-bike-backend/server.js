require('dotenv').config(); // principio absoluto
// IMPORTAMOS LAS HERRAMIENTAS QUE VAMOS A USAR
const express = require('express'); // Herramienta para crear servidores web
const cors = require('cors');      // Permite que otros programas se conecten
const app = express();             // Crearla aplicación/servidor
const PORT = process.env.PORT || 5000; // Puerto 5000

// CONFIGURAMOS EL SERVIDOR
app.use(cors());
app.use(express.json());

// RUTA DE PRUEBA
app.get('/', (req, res) => {
    res.json({ message: '🚀 Backend del Sistema de Bicicletas del SENA funcionando!' });
});

// IMPORTAMOS Y USAMOS LAS RUTAS DE AUTENTICACIÓN
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// IMPORTAMOS Y USAMOS LAS RUTAS DE BICICLETAS
const bicicletasRoutes = require('./routes/bicicletas');
app.use('/api/bicicletas', bicicletasRoutes);

// IMPORTAMOS Y USAMOS LAS RUTAS DE EVENTOS
const eventosRoutes = require('./routes/eventos');
app.use('/api/eventos', eventosRoutes);

// INICIAMOS EL SERVIDOR
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo y listo en http://localhost:${PORT}`);
});

// IMPORTAMOS Y USAMOS LAS RUTAS DE USUARIOS
const usuariosRoutes = require('./routes/usuarios');
app.use('/api/usuarios', usuariosRoutes);