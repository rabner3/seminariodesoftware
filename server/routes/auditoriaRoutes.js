
const express = require('express');
const router = express.Router();
const auditoriaController = require('../controllers/auditoriaController');

router.get('/', auditoriaController.getAllAuditoria);
router.get('/:id', auditoriaController.getAuditoriaById);
router.post('/', auditoriaController.createAuditoria);
router.put('/:id', auditoriaController.updateAuditoria);
router.delete('/:id', auditoriaController.deleteAuditoria);

module.exports = router;
