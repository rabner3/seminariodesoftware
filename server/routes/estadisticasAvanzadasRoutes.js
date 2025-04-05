// server/routes/estadisticasAvanzadasRoutes.js
const express = require('express');
const router = express.Router();
const estadisticasAvanzadasController = require('../controllers/estadisticasAvanzadasController');

router.get('/dashboard', estadisticasAvanzadasController.getDashboardCompleto);
router.get('/equipos-por-estado', estadisticasAvanzadasController.getEquiposPorEstado);
router.get('/equipos-por-departamento', estadisticasAvanzadasController.getEquiposPorDepartamento);
router.get('/reparaciones-por-tecnico', estadisticasAvanzadasController.getReparacionesPorTecnico);
router.get('/tiempo-promedio-reparacion', estadisticasAvanzadasController.getTiempoPromedioReparacion);
router.get('/solicitudes-por-departamento', estadisticasAvanzadasController.getSolicitudesPorDepartamento);
router.get('/equipos-con-mas-reparaciones', estadisticasAvanzadasController.getEquiposConMasReparaciones);
router.get('/asignaciones-mensuales', estadisticasAvanzadasController.getAsignacionesMensuales);
router.get('/reparaciones-mensuales', estadisticasAvanzadasController.getReparacionesMensuales);
router.get('/ranking-departamentos-costos', estadisticasAvanzadasController.getRankingDepartamentosPorCostos);

module.exports = router;