
const express = require('express');
const router = express.Router();
const notificacionesController = require('../controllers/notificacionesController');


router.get('/usuario/:idUsuario', notificacionesController.getNotificacionesByUsuario);
router.get('/tecnico/:idTecnico', notificacionesController.getNotificacionesByTecnico);
router.put('/leer/:id', notificacionesController.marcarComoLeida);
router.get('/pendientes', notificacionesController.getNotificacionesPendientes);
router.get('/', notificacionesController.getAllNotificaciones);
router.get('/:id', notificacionesController.getNotificacionById);
router.post('/', notificacionesController.createNotificacion);
router.put('/:id', notificacionesController.updateNotificacion);
router.delete('/:id', notificacionesController.deleteNotificacion);

module.exports = router;