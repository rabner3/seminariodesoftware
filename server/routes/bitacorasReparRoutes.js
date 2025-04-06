// server/routes/bitacorasReparRoutes.js
const express = require('express');
const router = express.Router();
const bitacorasReparController = require('../controllers/bitacorasReparController');

router.get('/', bitacorasReparController.getAllBitacoras);
router.get('/:id', bitacorasReparController.getBitacoraById);
router.post('/', bitacorasReparController.createBitacora);
router.put('/:id', bitacorasReparController.updateBitacora);
router.delete('/:id', bitacorasReparController.deleteBitacora);

module.exports = router;