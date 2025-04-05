// server/controllers/asignacionController.js
const AsignacionModel = require('../models/asignacionModel');

exports.getAllAsignaciones = async (req, res, next) => {
    try {
        let asignaciones;
        
        // Si hay un id_equipo en la consulta, filtramos por ese equipo
        if (req.query.id_equipo) {
            const [filtradas] = await AsignacionModel.getAsignacionesByEquipo(req.query.id_equipo);
            asignaciones = filtradas;
        } else {
            // Obtener todas las asignaciones si no hay filtro
            const [todas] = await AsignacionModel.getAllAsignaciones();
            asignaciones = todas;
        }
        
        res.json(asignaciones);
    } catch (error) {
        next(error);
    }
};

exports.getAsignacionById = async (req, res, next) => {
    try {
        const [asignaciones] = await AsignacionModel.getAsignacionById(req.params.id);
        // Como getById devuelve un array, verificamos si tiene elementos
        if (asignaciones.length === 0) {
            // Usamos return para salir después de enviar la respuesta
            return res.status(404).json({ message: 'Asignacion not found' });
        }
        // Devolvemos el primer (y único) elemento del array
        res.json(asignaciones[0]); // El objeto ahora contiene datos unidos
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};

exports.createAsignacion = async (req, res, next) => {
    try {
        // Validar req.body aquí sería ideal
        const [result] = await AsignacionModel.createAsignacion(req.body);
        // Devolvemos el ID insertado y los datos enviados
        res.status(201).json({ id_asignacion: result.insertId, ...req.body });
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};

exports.updateAsignacion = async (req, res, next) => {
    try {
        // Validar req.body y req.params.id aquí sería ideal
        const [result] = await AsignacionModel.updateAsignacion(req.params.id, req.body);
        // AffectedRows indica si se actualizó algo
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Asignacion not found or no data changed' });
        }
        res.json({ message: 'Asignacion updated successfully' });
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};

exports.deleteAsignacion = async (req, res, next) => {
    try {
        // Validar req.params.id aquí sería ideal
        const [result] = await AsignacionModel.deleteAsignacion(req.params.id);
        // AffectedRows indica si se eliminó algo
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Asignacion not found' });
        }
        res.json({ message: 'Asignacion deleted successfully' });
        // Algunas APIs devuelven 204 No Content en DELETE exitoso
        // res.status(204).send();
    } catch (error) {
        next(error);
        // O manejo básico: res.status(500).json({ error: error.message });
    }
};