
const AsignacionModel = require('../models/asignacionModel');

exports.getAllAsignaciones = async (req, res, next) => {
    try {
        let asignaciones;


        if (req.query.id_equipo) {
            const [filtradas] = await AsignacionModel.getAsignacionesByEquipo(req.query.id_equipo);
            asignaciones = filtradas;
        } else {
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

        if (asignaciones.length === 0) {

            return res.status(404).json({ message: 'Asignacion not found' });
        }

        res.json(asignaciones[0]);
    } catch (error) {
        next(error);
    }
};

exports.createAsignacion = async (req, res, next) => {
    try {
        // Validaciones básicas
        if (!req.body.id_equipo || !req.body.id_usuario) {
            return res.status(400).json({
                message: 'Se requieren id_equipo e id_usuario para crear una asignación'
            });
        }




        if (!req.body.fecha_asignacion) {
            req.body.fecha_asignacion = new Date().toISOString().split('T')[0];
        }


        if (!req.body.estado) {
            req.body.estado = 'activa';
        }


        if (!req.body.fecha_creacion) {
            req.body.fecha_creacion = new Date().toISOString();
        }


        const [result] = await AsignacionModel.createAsignacion(req.body);


        res.status(201).json({
            id_asignacion: result.insertId,
            ...req.body,
            message: 'Asignación creada exitosamente'
        });
    } catch (error) {
        next(error);
    }
};

exports.updateAsignacion = async (req, res, next) => {
    try {

        if (!req.params.id || isNaN(req.params.id)) {
            return res.status(400).json({ message: 'ID de asignación inválido' });
        }


        const [asignacionActual] = await AsignacionModel.getAsignacionById(req.params.id);
        if (asignacionActual.length === 0) {
            return res.status(404).json({ message: 'Asignación no encontrada' });
        }


        if (req.body.estado === 'finalizada' && !req.body.fecha_finalizacion) {
            req.body.fecha_finalizacion = new Date().toISOString();
        }


        const [result] = await AsignacionModel.updateAsignacion(req.params.id, req.body);




        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'No se realizó ningún cambio' });
        }

        res.json({
            message: 'Asignación actualizada exitosamente',
            id_asignacion: req.params.id
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteAsignacion = async (req, res, next) => {
    try {

        if (!req.params.id || isNaN(req.params.id)) {
            return res.status(400).json({ message: 'ID de asignación inválido' });
        }


        const [asignacionActual] = await AsignacionModel.getAsignacionById(req.params.id);
        if (asignacionActual.length === 0) {
            return res.status(404).json({ message: 'Asignación no encontrada' });
        }


        const [result] = await AsignacionModel.deleteAsignacion(req.params.id);


        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'No se pudo eliminar la asignación' });
        }

        res.json({
            message: 'Asignación eliminada exitosamente',
            id_asignacion: req.params.id
        });
    } catch (error) {
        next(error);
    }
};