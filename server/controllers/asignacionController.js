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
        
        // Verificar que el equipo exista y no esté ya asignado
        // Esto sería ideal para implementar
        /*
        const [equipoActual] = await EquiposModel.getEquipoById(req.body.id_equipo);
        if (equipoActual.length === 0) {
            return res.status(404).json({ message: 'El equipo no existe' });
        }
        if (equipoActual[0].estado === 'asignado') {
            return res.status(400).json({ message: 'El equipo ya está asignado' });
        }
        */
        
        // Si no hay fecha_asignacion, establecer la fecha actual
        if (!req.body.fecha_asignacion) {
            req.body.fecha_asignacion = new Date().toISOString().split('T')[0];
        }
        
        // Si no hay estado, establecer como 'activa'
        if (!req.body.estado) {
            req.body.estado = 'activa';
        }
        
        // Si no hay fecha_creacion, establecer la fecha y hora actual
        if (!req.body.fecha_creacion) {
            req.body.fecha_creacion = new Date().toISOString();
        }
        
        // Crear la asignación
        const [result] = await AsignacionModel.createAsignacion(req.body);
        
        // Actualizar el estado del equipo a 'asignado'
        // Esto sería ideal para mantener la consistencia
        /*
        await EquiposModel.updateEquipo(req.body.id_equipo, { estado: 'asignado' });
        */
        
        // También sería ideal registrar esta acción en la bitácora de asignaciones
        /*
        const datoBitacora = {
            id_asignacion: result.insertId,
            accion: 'asignacion',
            fecha_accion: new Date(),
            observaciones: req.body.motivo_asignacion || 'Asignación inicial',
            id_usuarios_responsable: req.body.creado_por
        };
        await BitacoraAsignModel.createBitacora(datoBitacora);
        */
        
        // Devolvemos el ID insertado y los datos enviados
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
        // Validar que el ID sea válido
        if (!req.params.id || isNaN(req.params.id)) {
            return res.status(400).json({ message: 'ID de asignación inválido' });
        }
        
        // Verificar que la asignación exista antes de actualizar
        const [asignacionActual] = await AsignacionModel.getAsignacionById(req.params.id);
        if (asignacionActual.length === 0) {
            return res.status(404).json({ message: 'Asignación no encontrada' });
        }
        
        // Si se está finalizando la asignación, verificar campos necesarios
        if (req.body.estado === 'finalizada' && !req.body.fecha_finalizacion) {
            req.body.fecha_finalizacion = new Date().toISOString();
        }
        
        // Realizar la actualización
        const [result] = await AsignacionModel.updateAsignacion(req.params.id, req.body);
        
        // Si la asignación se finaliza, actualizar el estado del equipo a 'disponible'
        /*
        if (req.body.estado === 'finalizada' && asignacionActual[0].estado !== 'finalizada') {
            await EquiposModel.updateEquipo(asignacionActual[0].id_equipo, { estado: 'disponible' });
            
            // Registrar en bitácora
            const datoBitacora = {
                id_asignacion: req.params.id,
                accion: 'devolucion',
                fecha_accion: new Date(),
                observaciones: req.body.motivo_finalizacion || 'Devolución de equipo',
                id_usuarios_responsable: req.body.modificado_por || asignacionActual[0].creado_por
            };
            await BitacoraAsignModel.createBitacora(datoBitacora);
        }
        */
        
        // Verificar si se actualizó algo
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
        // Validar que el ID sea válido
        if (!req.params.id || isNaN(req.params.id)) {
            return res.status(400).json({ message: 'ID de asignación inválido' });
        }
        
        // Verificar que la asignación exista antes de eliminar
        const [asignacionActual] = await AsignacionModel.getAsignacionById(req.params.id);
        if (asignacionActual.length === 0) {
            return res.status(404).json({ message: 'Asignación no encontrada' });
        }
        
        // Si la asignación está activa, deberíamos actualizar el estado del equipo
        // antes de eliminarla
        /*
        if (asignacionActual[0].estado === 'activa') {
            await EquiposModel.updateEquipo(asignacionActual[0].id_equipo, { estado: 'disponible' });
        }
        */
        
        // Eliminar bitácoras relacionadas sería recomendable
        /*
        await BitacoraAsignModel.deleteBitacorasByAsignacion(req.params.id);
        */
        
        // Ejecutar la eliminación
        const [result] = await AsignacionModel.deleteAsignacion(req.params.id);
        
        // AffectedRows indica si se eliminó algo
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