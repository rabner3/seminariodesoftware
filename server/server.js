
require('dotenv').config(); // Carga .env al inicio
const express = require('express');
const cors = require('cors');

// Importar todas las rutas
const asignacionRoutes = require('./routes/asignacionRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const equiposRoutes = require('./routes/equiposRoutes');
const departamentosRoutes = require('./routes/departamentosRoutes');
const tecnicosRoutes = require('./routes/tecnicosRoutes');
const solicitudesRoutes = require('./routes/solicitudesRoutes');
const reparacionesRoutes = require('./routes/reparacionesRoutes');
const diagnosticosRoutes = require('./routes/diagnosticosRoutes');
const partesRoutes = require('./routes/partesRoutes');
const reportesRoutes = require('./routes/reportesRoutes');
const notificacionesRoutes = require('./routes/notificacionesRoutes');
const estadisticasRoutes = require('./routes/estadisticasRoutes');
const auditoriaRoutes = require('./routes/auditoriaRoutes');
const bitacorasAsignRoutes = require('./routes/bitacorasAsignRoutes');
const bitacorasReparRoutes = require('./routes/bitacorasReparRoutes');
const estadisticasAvanzadasRoutes = require('./routes/estadisticasAvanzadasRoutes');
const reportesAvanzadosRoutes = require('./routes/reportesAvanzadosRoutes');
const authRoutes = require('./routes/authRoutes');
const reparacionesPartesRoutes = require('./routes/reparacionesPartesRoutes');

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
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/departamentos', departamentosRoutes);
app.use('/api/tecnicos', tecnicosRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/reparaciones', reparacionesRoutes);
app.use('/api/diagnosticos', diagnosticosRoutes);
app.use('/api/partes', partesRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/auditoria', auditoriaRoutes);
app.use('/api/bitacoras-asignacion', bitacorasAsignRoutes);
app.use('/api/bitacoras-reparacion', bitacorasReparRoutes);
app.use('/api/estadisticas-avanzadas', estadisticasAvanzadasRoutes);
app.use('/api/reportes-avanzados', reportesAvanzadosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reparaciones-partes', reparacionesPartesRoutes);



app.get('/api', (req, res) => {
    res.json({ message: "Bienvenido a la API del proyecto." });
});

// Middleware básico de manejo de errores
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