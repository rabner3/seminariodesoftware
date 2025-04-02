-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.32-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para proyecto
CREATE DATABASE IF NOT EXISTS `proyecto` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `proyecto`;

-- Volcando estructura para tabla proyecto.asignaciones
CREATE TABLE IF NOT EXISTS `asignaciones` (
  `id_asignacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_equipo` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `fecha_asignacion` date DEFAULT NULL,
  `motivo_asignacion` text DEFAULT NULL,
  `estado` enum('activa','finalizada') DEFAULT NULL,
  `fecha_finalizacion` datetime DEFAULT NULL,
  `motivo_finalizacion` text DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_asignacion`),
  KEY `id_equipo` (`id_equipo`),
  KEY `id_usuario` (`id_usuario`),
  KEY `fk_asignacion_creador` (`creado_por`),
  CONSTRAINT `fk_asignacion_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_asignacion_equipo` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id_equipo`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_asignacion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.asignaciones: ~0 rows (aproximadamente)

-- Volcando estructura para tabla proyecto.auditoria
CREATE TABLE IF NOT EXISTS `auditoria` (
  `id_auditoria` int(11) NOT NULL AUTO_INCREMENT,
  `tabla_afectada` varchar(50) DEFAULT NULL,
  `id_registro` int(11) DEFAULT NULL,
  `accion` enum('insert','update','delete') DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_tecnico` int(11) DEFAULT NULL,
  `fecha_accion` datetime DEFAULT NULL,
  `valores_anteriores` text DEFAULT NULL,
  `valores_nuevos` text DEFAULT NULL,
  `ip_origen` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_auditoria`),
  KEY `tabla_afectada` (`tabla_afectada`),
  KEY `id_registro` (`id_registro`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_tecnico` (`id_tecnico`),
  CONSTRAINT `fk_auditoria_tecnico` FOREIGN KEY (`id_tecnico`) REFERENCES `tecnicos` (`id_tecnico`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_auditoria_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.auditoria: ~0 rows (aproximadamente)

-- Volcando estructura para tabla proyecto.bitacoras_asign
CREATE TABLE IF NOT EXISTS `bitacoras_asign` (
  `id_bitacora` int(11) NOT NULL AUTO_INCREMENT,
  `id_asignacion` int(11) DEFAULT NULL,
  `accion` enum('asignacion','reasignacion','devolucion') DEFAULT NULL,
  `fecha_accion` date DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `id_usuarios_responsable` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_bitacora`),
  KEY `id_asignacion` (`id_asignacion`),
  KEY `id_usuarios_responsables` (`id_usuarios_responsable`) USING BTREE,
  CONSTRAINT `fk_bitacora_asignacion` FOREIGN KEY (`id_asignacion`) REFERENCES `asignaciones` (`id_asignacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bitacora_usuario_responsable` FOREIGN KEY (`id_usuarios_responsable`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.bitacoras_asign: ~0 rows (aproximadamente)

-- Volcando estructura para tabla proyecto.bitacoras_repar
CREATE TABLE IF NOT EXISTS `bitacoras_repar` (
  `id_bitacora` int(11) NOT NULL AUTO_INCREMENT,
  `id_reparacion` int(11) DEFAULT NULL,
  `id_tecnico` int(11) DEFAULT NULL,
  `tipo_accion` enum('recepcion','diagnostico','reparacion','espera','prueba','entrega','otro') DEFAULT NULL,
  `accion` varchar(50) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_accion` datetime DEFAULT NULL,
  `duracion_minutos` int(11) DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_bitacora`),
  KEY `id_tecnico` (`id_tecnico`),
  KEY `id_repacion` (`id_reparacion`) USING BTREE,
  KEY `fecha_accion` (`fecha_accion`),
  KEY `fk_bitacora_creador` (`creado_por`),
  CONSTRAINT `fk_bitacora_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_bitacora_reparacion` FOREIGN KEY (`id_reparacion`) REFERENCES `reparaciones` (`id_reparacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bitacora_tecnico` FOREIGN KEY (`id_tecnico`) REFERENCES `tecnicos` (`id_tecnico`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.bitacoras_repar: ~0 rows (aproximadamente)

-- Volcando estructura para tabla proyecto.departamentos
CREATE TABLE IF NOT EXISTS `departamentos` (
  `id_departamento` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `id_responsable` int(11) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `fecha_actualizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_departamento`),
  UNIQUE KEY `nombre` (`nombre`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `id_responsable` (`id_responsable`),
  CONSTRAINT `fk_departamento_responsable` FOREIGN KEY (`id_responsable`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.departamentos: ~0 rows (aproximadamente)

-- Volcando estructura para tabla proyecto.diagnosticos
CREATE TABLE IF NOT EXISTS `diagnosticos` (
  `id_diagnostico` int(11) NOT NULL AUTO_INCREMENT,
  `id_reparacion` int(11) DEFAULT NULL,
  `id_tecnico` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `causa_raiz` text DEFAULT NULL,
  `solucion_propuesta` text DEFAULT NULL,
  `fecha_diagnostico` datetime DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_diagnostico`),
  KEY `id_reparacion` (`id_reparacion`),
  KEY `id_tecnico` (`id_tecnico`),
  KEY `fk_diagnostico_creador` (`creado_por`),
  CONSTRAINT `fk_diagnostico_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_diagnostico_reparacion` FOREIGN KEY (`id_reparacion`) REFERENCES `reparaciones` (`id_reparacion`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_diagnostico_tecnico` FOREIGN KEY (`id_tecnico`) REFERENCES `tecnicos` (`id_tecnico`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.diagnosticos: ~0 rows (aproximadamente)

-- Volcando estructura para tabla proyecto.equipos
CREATE TABLE IF NOT EXISTS `equipos` (
  `id_equipo` int(11) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `marca` varchar(50) DEFAULT NULL,
  `modelo` varchar(50) DEFAULT NULL,
  `numero_serie` varchar(50) DEFAULT NULL,
  `procesador` varchar(50) DEFAULT NULL,
  `ram` varchar(50) DEFAULT NULL,
  `almacenamiento` varchar(50) DEFAULT NULL,
  `sistema_operativo` varchar(20) DEFAULT NULL,
  `fecha_compra` date DEFAULT NULL,
  `garantia_hasta` date DEFAULT NULL,
  `id_departamento` int(11) DEFAULT NULL,
  `estado` enum('disponible','asignado','en_reparacion','descarte','baja') DEFAULT NULL,
  `observaciones` varchar(100) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL,
  `actualizacion` datetime DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_equipo`),
  UNIQUE KEY `numero_serie` (`numero_serie`),
  KEY `id_departamento` (`id_departamento`),
  KEY `estado` (`estado`),
  KEY `fk_equipo_creador` (`creado_por`),
  CONSTRAINT `fk_equipo_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_equipo_departamento` FOREIGN KEY (`id_departamento`) REFERENCES `departamentos` (`id_departamento`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.equipos: ~0 rows (aproximadamente)

-- Volcando estructura para tabla proyecto.estadisticas
CREATE TABLE IF NOT EXISTS `estadisticas` (
  `id_estadistica` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) DEFAULT NULL,
  `periodo` varchar(50) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `valor` decimal(20,6) DEFAULT NULL,
  `detalle` text DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_estadistica`),
  KEY `tipo` (`tipo`),
  KEY `periodo` (`periodo`),
  KEY `fecha` (`fecha`),
  KEY `fk_estadistica_creador` (`creado_por`),
  CONSTRAINT `fk_estadistica_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.estadisticas: ~0 rows (aproximadamente)

-- Volcando estructura para tabla proyecto.notificaciones
CREATE TABLE IF NOT EXISTS `notificaciones` (
  `id_notificacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario_destino` int(11) DEFAULT NULL,
  `id_tecnico_destino` int(11) DEFAULT NULL,
  `tipo` enum('asignacion','reparacion','solicitud','sistema','alerta') DEFAULT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `fecha_envio` datetime DEFAULT NULL,
  `fecha_lectura` datetime DEFAULT NULL,
  `estado` enum('pendiente','leida','archivada') DEFAULT NULL,
  `id_referencia` int(11) DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_notificacion`),
  KEY `id_usuario_destino` (`id_usuario_destino`),
  KEY `id_tecnico_destino` (`id_tecnico_destino`),
  KEY `fecha_envio` (`fecha_envio`),
  KEY `fk_notificacion_creador` (`creado_por`),
  CONSTRAINT `fk_notificacion_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_notificacion_tecnico_destino` FOREIGN KEY (`id_tecnico_destino`) REFERENCES `tecnicos` (`id_tecnico`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_notificacion_usuario_destino` FOREIGN KEY (`id_usuario_destino`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.notificaciones: ~0 rows (aproximadamente)

-- Volcando estructura para tabla proyecto.partes
CREATE TABLE IF NOT EXISTS `partes` (
  `id_parte` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `costo_unitario` decimal(20,6) DEFAULT NULL,
  `proveedor` varchar(50) DEFAULT NULL,
  `codigo_referencia` varchar(50) DEFAULT NULL,
  `estado` enum('disponible','agotado','descontinuado') DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `fecha_actualizacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_parte`),
  KEY `nombre` (`nombre`),
  KEY `estado` (`estado`),
  KEY `fk_parte_creador` (`creado_por`),
  CONSTRAINT `fk_parte_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.partes: ~0 rows (aproximadamente)

-- Volcando estructura para tabla proyecto.reparaciones
CREATE TABLE IF NOT EXISTS `reparaciones` (
  `id_reparacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_solicitud` int(11) DEFAULT NULL,
  `id_equipo` int(11) DEFAULT NULL,
  `id_tecnico` int(11) DEFAULT NULL,
  `fecha_recepcion` datetime DEFAULT NULL,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `estado` enum('pendiente','diagnostico','en_reparacion','espera_repuestos','completada','descarte') DEFAULT NULL,
  `costo_estimado` decimal(20,6) DEFAULT NULL,
  `costo_final` decimal(20,6) DEFAULT NULL,
  `tiempo_total` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_reparacion`),
  KEY `id_solicitud` (`id_solicitud`),
  KEY `id_tecnico` (`id_tecnico`),
  KEY `id_equipo` (`id_equipo`),
  KEY `fk_reparacion_creador` (`creado_por`),
  CONSTRAINT `fk_reparacion_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_reparacion_equipo` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id_equipo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reparacion_solicitud` FOREIGN KEY (`id_solicitud`) REFERENCES `solicitudes` (`id_solicitud`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_reparacion_tecnico` FOREIGN KEY (`id_tecnico`) REFERENCES `tecnicos` (`id_tecnico`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.reparaciones: ~0 rows (aproximadamente)

-- Volcando estructura para tabla proyecto.reparaciones_partes
CREATE TABLE IF NOT EXISTS `reparaciones_partes` (
  `id_reparacion_partes` int(11) NOT NULL AUTO_INCREMENT,
  `id_reparacion` int(11) DEFAULT NULL,
  `id_parte` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `costo_unitario` decimal(20,6) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_reparacion_partes`),
  KEY `id_reparacion` (`id_reparacion`),
  KEY `id_partes` (`id_parte`) USING BTREE,
  KEY `fk_reparacion_parte_creador` (`creado_por`),
  CONSTRAINT `fk_reparacion_parte_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_reparacion_parte_parte` FOREIGN KEY (`id_parte`) REFERENCES `partes` (`id_parte`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reparacion_parte_reparacion` FOREIGN KEY (`id_reparacion`) REFERENCES `reparaciones` (`id_reparacion`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.reparaciones_partes: ~0 rows (aproximadamente)

-- Volcando estructura para tabla proyecto.reportes
CREATE TABLE IF NOT EXISTS `reportes` (
  `id_reporte` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `tipo` enum('inventario','asignaciones','reparaciones','solicitudes','estadisticas') DEFAULT NULL,
  `id_usuario_generador` int(11) DEFAULT NULL,
  `formato` enum('pdf','excel') DEFAULT NULL,
  `ruta_archivo` varchar(255) DEFAULT NULL,
  `fecha_generacion` datetime DEFAULT NULL,
  `parametro` text DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_reporte`),
  KEY `id_usuario_generador` (`id_usuario_generador`),
  KEY `fecha_generacion` (`fecha_generacion`),
  KEY `fk_reporte_creador` (`creado_por`),
  CONSTRAINT `fk_reporte_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_reporte_usuario_generador` FOREIGN KEY (`id_usuario_generador`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.reportes: ~0 rows (aproximadamente)

-- Volcando estructura para tabla proyecto.solicitudes
CREATE TABLE IF NOT EXISTS `solicitudes` (
  `id_solicitud` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `id_equipo` int(11) DEFAULT NULL,
  `tipo` enum('soporte','reparacion','mantenimiento') DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `urgencia` enum('baja','media','alta','critica') DEFAULT NULL,
  `fecha_solicitud` date DEFAULT NULL,
  `estado` enum('pendiente','asignada','en_proceso','resuelta','cancelada') DEFAULT NULL,
  `fecha_cierre` datetime DEFAULT NULL,
  `comentario_cierre` text DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  PRIMARY KEY (`id_solicitud`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_equipo` (`id_equipo`),
  KEY `fk_solicitud_creador` (`creado_por`),
  CONSTRAINT `fk_solicitud_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_solicitud_equipo` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id_equipo`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_solicitud_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.solicitudes: ~0 rows (aproximadamente)

-- Volcando estructura para tabla proyecto.tecnicos
CREATE TABLE IF NOT EXISTS `tecnicos` (
  `id_tecnico` int(11) NOT NULL,
  `nombre` varchar(20) DEFAULT NULL,
  `apellido` varchar(20) DEFAULT NULL,
  `email` varchar(20) DEFAULT NULL,
  `especialidad` varchar(30) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL,
  `fecha_actualizacion` datetime DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_tecnico`),
  UNIQUE KEY `email` (`email`),
  KEY `nombre` (`nombre`),
  KEY `fk_tecnico_creador` (`creado_por`),
  CONSTRAINT `fk_tecnico_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.tecnicos: ~0 rows (aproximadamente)

-- Volcando estructura para tabla proyecto.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuarios` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `telefono` varchar(8) DEFAULT NULL,
  `puesto` varchar(50) DEFAULT NULL,
  `id_departamento` int(11) DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL,
  `fecha_actualizacion` datetime DEFAULT NULL,
  `creado_por` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_usuarios`),
  UNIQUE KEY `email` (`email`),
  KEY `id_departamento` (`id_departamento`),
  KEY `fk_usuario_creador` (`creado_por`),
  CONSTRAINT `fk_usuario_creador` FOREIGN KEY (`creado_por`) REFERENCES `usuarios` (`id_usuarios`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_usuario_departamento` FOREIGN KEY (`id_departamento`) REFERENCES `departamentos` (`id_departamento`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla proyecto.usuarios: ~0 rows (aproximadamente)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
