
const express = require('express');
const router = express.Router();
const solicitudesController = require('../controllers/solicitudesController');

router.get('/', solicitudesController.getAllSolicitudes);
router.get('/usuario/:userId', solicitudesController.getSolicitudesByUsuario);
router.get('/:id', solicitudesController.getSolicitudById);
router.post('/', solicitudesController.createSolicitud);
router.put('/:id', solicitudesController.updateSolicitud);
router.delete('/:id', solicitudesController.deleteSolicitud);

module.exports = router;
