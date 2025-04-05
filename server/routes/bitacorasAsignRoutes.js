// server/routes/bitacorasAsignRoutes.js
const express = require('express');
const router = express.Router();
const bitacorasAsignController = require('../controllers/bitacorasAsignController');

router.get('/', bitacorasAsignController.getAllBitacoras);
router.get('/:id', bitacorasAsignController.getBitacoraById);
router.post('/', bitacorasAsignController.createBitacora);
router.put('/:id', bitacorasAsignController.updateBitacora);
router.delete('/:id', bitacorasAsignController.deleteBitacora);

module.exports = router;