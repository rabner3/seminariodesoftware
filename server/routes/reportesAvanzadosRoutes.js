// server/routes/reportesAvanzadosRoutes.js
const express = require('express');
const router = express.Router();
const reportesAvanzadosController = require('../controllers/reportesAvanzadosController');

// Rutas para obtener reportes específicos
router.get('/inventario', reportesAvanzadosController.getReporteInventarioCompleto);
router.get('/asignaciones-activas', reportesAvanzadosController.getReporteAsignacionesActivas);
router.get('/historial-asignaciones', reportesAvanzadosController.getReporteHistorialAsignaciones);
router.get('/reparaciones-en-proceso', reportesAvanzadosController.getReporteReparacionesEnProceso);
router.get('/historial-reparaciones', reportesAvanzadosController.getReporteHistorialReparaciones);
router.get('/solicitudes-pendientes', reportesAvanzadosController.getReporteSolicitudesPendientes);
router.get('/costos-reparacion', reportesAvanzadosController.getReporteCostosReparacion);

// Ruta para generar y guardar un reporte
router.post('/generar', reportesAvanzadosController.generarYGuardarReporte);

// Ruta para obtener un reporte previamente generado
router.get('/:id', reportesAvanzadosController.getReporteById);

module.exports = router;