// server/routes/notificacionesRoutes.js (corregido)
const express = require('express');
const router = express.Router();
const notificacionesController = require('../controllers/notificacionesController');

// Rutas específicas para usuario y técnico primero (más específicas primero)
router.get('/usuario/:idUsuario', notificacionesController.getNotificacionesByUsuario);
router.get('/tecnico/:idTecnico', notificacionesController.getNotificacionesByTecnico);

// Ruta para marcar como leída
router.put('/leer/:id', notificacionesController.marcarComoLeida);

// Ruta para notificaciones pendientes
router.get('/pendientes', notificacionesController.getNotificacionesPendientes);

// Rutas generales CRUD (deben ir después de las rutas específicas)
router.get('/', notificacionesController.getAllNotificaciones);
router.get('/:id', notificacionesController.getNotificacionById);
router.post('/', notificacionesController.createNotificacion);
router.put('/:id', notificacionesController.updateNotificacion);
router.delete('/:id', notificacionesController.deleteNotificacion);

module.exports = router;