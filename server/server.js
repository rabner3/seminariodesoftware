
require('dotenv').config(); // Carga .env al inicio
const express = require('express');
const cors = require('cors');

// Importar Rutas (solo las que existen)
const asignacionRoutes = require('./routes/asignacionRoutes');
// Importa otras rutas aquí si las tienes (ej: equiposRoutes, usuariosRoutes, etc.)

const app = express();

// Configuración de CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
app.use(cors(corsOptions));

// Middleware para parsear JSON y URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API (con prefijo /api)
app.use('/api/asignaciones', asignacionRoutes);
// Monta otras rutas aquí: app.use('/api/equipos', equipoRoutes);

// Ruta simple de bienvenida (opcional)
app.get('/api', (req, res) => {
    res.json({ message: "Bienvenido a la API del proyecto." });
});

// Middleware básico de manejo de errores (colocar al final)
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
    res.status(statusCode).json({ error: message });
});

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Accepting requests from origin: ${corsOptions.origin}`);
});