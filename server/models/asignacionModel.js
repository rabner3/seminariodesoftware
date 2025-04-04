db = require('../config/db'); // Asegúrate que la ruta es correcta

class AsignacionModel {
    // Modificamos getAllAsignaciones para incluir datos básicos de usuario y equipo
    static getAllAsignaciones() {
        // Seleccionamos campos específicos y les damos alias para claridad
        const sql = `
            SELECT
                a.id_asignacion,
                a.fecha_asignacion,
                a.motivo_asignacion,
                a.estado AS estado_asignacion,
                a.fecha_finalizacion,
                a.motivo_finalizacion,
                a.fecha_creacion AS fecha_creacion_asignacion,
                -- Datos del Equipo (ejemplo, añade más si necesitas)
                e.id_equipo,
                e.tipo AS tipo_equipo,
                e.marca AS marca_equipo,
                e.modelo AS modelo_equipo,
                e.numero_serie AS serie_equipo,
                -- Datos del Usuario (ejemplo, añade más si necesitas)
                u.id_usuarios,
                u.nombre AS nombre_usuario,
                u.apellido AS apellido_usuario,
                u.email AS email_usuario,
                -- Datos del Creador (opcional, si quieres mostrar quién la creó)
                cr.id_usuarios AS id_creador,
                cr.nombre AS nombre_creador,
                cr.apellido AS apellido_creador
            FROM asignaciones AS a
            LEFT JOIN equipos AS e ON a.id_equipo = e.id_equipo       -- JOIN con equipos
            LEFT JOIN usuarios AS u ON a.id_usuario = u.id_usuarios   -- JOIN con usuarios (asignado)
            LEFT JOIN usuarios AS cr ON a.creado_por = cr.id_usuarios -- JOIN con usuarios (creador)
            ORDER BY a.fecha_asignacion DESC; -- O el orden que prefieras
        `;
        // db.query devuelve una promesa con [rows, fields]
        // Solo necesitamos las filas (rows)
        return db.query(sql);
    }

    // Modificamos getAsignacionById para incluir datos detallados
    static getAsignacionById(id) {
        const sql = `
            SELECT
                a.*,
                e.id_equipo,
                e.tipo AS tipo_equipo,
                e.marca AS marca_equipo,
                e.modelo AS modelo_equipo,
                e.numero_serie AS serie_equipo,
                e.estado AS estado_equipo, -- etc.
                u.id_usuarios,
                u.nombre AS nombre_usuario,
                u.apellido AS apellido_usuario,
                u.email AS email_usuario,
                u.puesto AS puesto_usuario, -- etc.
                d.nombre AS nombre_departamento_usuario, -- Si quieres el depto del usuario
                cr.id_usuarios AS id_creador,
                cr.nombre AS nombre_creador,
                cr.apellido AS apellido_creador
            FROM asignaciones AS a
            LEFT JOIN equipos AS e ON a.id_equipo = e.id_equipo
            LEFT JOIN usuarios AS u ON a.id_usuario = u.id_usuarios
            LEFT JOIN departamentos AS d ON u.id_departamento = d.id_departamento -- JOIN extra para depto
            LEFT JOIN usuarios AS cr ON a.creado_por = cr.id_usuarios
            WHERE a.id_asignacion = ?;
        `;
        // db.query devuelve una promesa con [rows, fields]
        // Para getById, esperamos una sola fila o ninguna
        return db.query(sql, [id]);
    }

    // Los métodos create, update, delete no necesitan cambiar JOINs generalmente
    static createAsignacion(asignacionData) {
        // Solo insertamos en la tabla asignaciones
        return db.query('INSERT INTO asignaciones SET ?', asignacionData);
    }

    static updateAsignacion(id, asignacionData) {
        // Solo actualizamos la tabla asignaciones
        return db.query('UPDATE asignaciones SET ? WHERE id_asignacion = ?', [asignacionData, id]);
    }

    static deleteAsignacion(id) {
        // Solo eliminamos de la tabla asignaciones
        return db.query('DELETE FROM asignaciones WHERE id_asignacion = ?', [id]);
    }
}

module.exports = AsignacionModel;