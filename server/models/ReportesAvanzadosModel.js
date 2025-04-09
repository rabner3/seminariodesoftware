// server/models/ReportesAvanzadosModel.js
const db = require('../config/db');

class ReportesAvanzadosModel {
    static async getReporteInventarioCompleto() {
        const query = `
            SELECT e.*, d.nombre as departamento,
                   u.nombre as nombre_usuario, u.apellido as apellido_usuario,
                   (SELECT COUNT(*) FROM reparaciones r WHERE r.id_equipo = e.id_equipo) as total_reparaciones,
                   (SELECT MAX(fecha_fin) FROM reparaciones r WHERE r.id_equipo = e.id_equipo) as ultima_reparacion
            FROM equipos e
            LEFT JOIN departamentos d ON e.id_departamento = d.id_departamento
            LEFT JOIN asignaciones a ON e.id_equipo = a.id_equipo AND a.estado = 'activa'
            LEFT JOIN usuarios u ON a.id_usuario = u.id_usuarios
            ORDER BY e.id_equipo
        `;
        return db.query(query);
    }


    static async getReporteAsignacionesActivas() {
        const query = `
            SELECT a.*, 
                   e.tipo, e.marca, e.modelo, e.numero_serie,
                   u.nombre as nombre_usuario, u.apellido as apellido_usuario, u.email,
                   d.nombre as departamento,
                   cr.nombre as nombre_creador, cr.apellido as apellido_creador
            FROM asignaciones a
            JOIN equipos e ON a.id_equipo = e.id_equipo
            JOIN usuarios u ON a.id_usuario = u.id_usuarios
            LEFT JOIN departamentos d ON u.id_departamento = d.id_departamento
            LEFT JOIN usuarios cr ON a.creado_por = cr.id_usuarios
            WHERE a.estado = 'activa'
            ORDER BY a.fecha_asignacion DESC
        `;
        return db.query(query);
    }

    static async getReporteHistorialAsignaciones(filtros = {}) {
        let query = `
            SELECT a.*, 
                   e.tipo, e.marca, e.modelo, e.numero_serie,
                   u.nombre as nombre_usuario, u.apellido as apellido_usuario, 
                   d.nombre as departamento,
                   (SELECT COUNT(*) FROM bitacoras_asign ba WHERE ba.id_asignacion = a.id_asignacion) as total_eventos
            FROM asignaciones a
            JOIN equipos e ON a.id_equipo = e.id_equipo
            JOIN usuarios u ON a.id_usuario = u.id_usuarios
            LEFT JOIN departamentos d ON u.id_departamento = d.id_departamento
            WHERE 1=1
        `;

        const params = [];


        if (filtros.estado) {
            query += " AND a.estado = ?";
            params.push(filtros.estado);
        }

        if (filtros.id_equipo) {
            query += " AND a.id_equipo = ?";
            params.push(filtros.id_equipo);
        }

        if (filtros.id_usuario) {
            query += " AND a.id_usuario = ?";
            params.push(filtros.id_usuario);
        }

        if (filtros.id_departamento) {
            query += " AND u.id_departamento = ?";
            params.push(filtros.id_departamento);
        }

        if (filtros.fecha_desde) {
            query += " AND a.fecha_asignacion >= ?";
            params.push(filtros.fecha_desde);
        }

        if (filtros.fecha_hasta) {
            query += " AND a.fecha_asignacion <= ?";
            params.push(filtros.fecha_hasta);
        }

        query += " ORDER BY a.fecha_asignacion DESC";

        return db.query(query, params);
    }


    static async getReporteReparacionesEnProceso() {
        const query = `
            SELECT r.*, 
                   e.tipo, e.marca, e.modelo, e.numero_serie,
                   t.nombre as nombre_tecnico, t.apellido as apellido_tecnico,
                   s.descripcion as descripcion_solicitud, s.urgencia,
                   u.nombre as nombre_solicitante, u.apellido as apellido_solicitante,
                   DATEDIFF(CURDATE(), r.fecha_recepcion) as dias_en_reparacion
            FROM reparaciones r
            JOIN equipos e ON r.id_equipo = e.id_equipo
            LEFT JOIN tecnicos t ON r.id_tecnico = t.id_tecnico
            LEFT JOIN solicitudes s ON r.id_solicitud = s.id_solicitud
            LEFT JOIN usuarios u ON s.id_usuario = u.id_usuarios
            WHERE r.estado != 'completada' AND r.estado != 'descarte'
            ORDER BY r.fecha_recepcion ASC
        `;
        return db.query(query);
    }


    static async getReporteHistorialReparaciones(filtros = {}) {
        let query = `
            SELECT r.*, 
                   e.tipo, e.marca, e.modelo, e.numero_serie,
                   t.nombre as nombre_tecnico, t.apellido as apellido_tecnico,
                   s.descripcion as descripcion_solicitud, s.urgencia,
                   u.nombre as nombre_solicitante, u.apellido as apellido_solicitante,
                   (SELECT COUNT(*) FROM bitacoras_repar br WHERE br.id_reparacion = r.id_reparacion) as total_acciones,
                   DATEDIFF(r.fecha_fin, r.fecha_inicio) as dias_reparacion
            FROM reparaciones r
            JOIN equipos e ON r.id_equipo = e.id_equipo
            LEFT JOIN tecnicos t ON r.id_tecnico = t.id_tecnico
            LEFT JOIN solicitudes s ON r.id_solicitud = s.id_solicitud
            LEFT JOIN usuarios u ON s.id_usuario = u.id_usuarios
            WHERE 1=1
        `;

        const params = [];

        // Agregar filtros
        if (filtros.estado) {
            query += " AND r.estado = ?";
            params.push(filtros.estado);
        }

        if (filtros.id_equipo) {
            query += " AND r.id_equipo = ?";
            params.push(filtros.id_equipo);
        }

        if (filtros.id_tecnico) {
            query += " AND r.id_tecnico = ?";
            params.push(filtros.id_tecnico);
        }

        if (filtros.fecha_desde) {
            query += " AND r.fecha_recepcion >= ?";
            params.push(filtros.fecha_desde);
        }

        if (filtros.fecha_hasta) {
            query += " AND r.fecha_recepcion <= ?";
            params.push(filtros.fecha_hasta);
        }

        query += " ORDER BY r.fecha_recepcion DESC";

        return db.query(query, params);
    }


    static async getReporteSolicitudesPendientes() {
        const query = `
            SELECT s.*, 
                   u.nombre as nombre_solicitante, u.apellido as apellido_solicitante, 
                   d.nombre as departamento,
                   e.tipo, e.marca, e.modelo, e.numero_serie,
                   DATEDIFF(CURDATE(), s.fecha_solicitud) as dias_pendiente
            FROM solicitudes s
            JOIN usuarios u ON s.id_usuario = u.id_usuarios
            LEFT JOIN departamentos d ON u.id_departamento = d.id_departamento
            LEFT JOIN equipos e ON s.id_equipo = e.id_equipo
            WHERE s.estado != 'resuelta' AND s.estado != 'cancelada'
            ORDER BY 
                CASE s.urgencia 
                    WHEN 'critica' THEN 1
                    WHEN 'alta' THEN 2
                    WHEN 'media' THEN 3
                    WHEN 'baja' THEN 4
                END,
                s.fecha_solicitud ASC
        `;
        return db.query(query);
    }

    static async getReporteCostosReparacion(fechaDesde, fechaHasta) {
        const query = `
            SELECT r.id_reparacion, r.fecha_fin, r.costo_final, 
                   e.tipo, e.marca, e.modelo, e.numero_serie,
                   t.nombre as nombre_tecnico, t.apellido as apellido_tecnico,
                   rp.id_parte, p.nombre as nombre_parte, rp.cantidad, rp.costo_unitario,
                   (rp.cantidad * rp.costo_unitario) as costo_total_parte
            FROM reparaciones r
            JOIN equipos e ON r.id_equipo = e.id_equipo
            LEFT JOIN tecnicos t ON r.id_tecnico = t.id_tecnico
            LEFT JOIN reparaciones_partes rp ON r.id_reparacion = rp.id_reparacion
            LEFT JOIN partes p ON rp.id_parte = p.id_parte
            WHERE r.estado = 'completada'
                AND r.fecha_fin BETWEEN ? AND ?
                AND r.costo_final > 0
            ORDER BY r.fecha_fin, r.id_reparacion
        `;
        return db.query(query, [fechaDesde, fechaHasta]);
    }


    static async guardarReporte(reporteData) {
        return db.query('INSERT INTO reportes SET ?', [reporteData]);
    }


    static async getReporteById(id) {
        return db.query('SELECT * FROM reportes WHERE id_reporte = ?', [id]);
    }
}

module.exports = ReportesAvanzadosModel;