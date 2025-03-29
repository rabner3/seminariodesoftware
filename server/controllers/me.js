const conexion =require('../database/db');

exports.save=(req,res)=>{
    const id_asignacion=(req.body.id_asignacion);
    const id_usuario=(req.body.id_usuario);
    const id_equipo=(req.body.id_equipo);
    const fecha_asignacion=(req.body.fecha_asignacion);
    const motivo_asignacion=(req.body.motivo_asignacion);
    const creado_por=(req.body.creado_por);
    const fecha_creacion=(req.body.fecha_creacion);
    const id_auditoria=(req.body.id_auditoria);
    const tabla_afectada=(req.body.tabla_afectada);
    const id_registro=(req.body.id_registro);
    const accion=(req.body.accion);
    const id_tecnico=(req.body.id_tecnico);
    const fecha_accion=(req.body.fecha_accion);
    const valores_anteriores=(req.body.valores_anteriores);
    const valores_nuevos=(req.body.valores_nuevos);
    const id_origen=(req.body.id_origen);
    const id_bitacora=(req.body.id_bitacora);
    const observaciones=(req.body.observaciones);
    const id_usuario_responsable=(req.body.id_usuario_responsable);
    const id_reparacion=(req.body.id_reparacion);
    const tipo_accion=(req.body.tipo_accion);
    const descripcion=(req.body.descripcion);
    const duracion_minutos=(req.body.duracion_minutos);
    const id_departamento=(req.body.id_departamento);
    const nombre=(req.body.nombre);
    const codigo=(req.body.codigo);
    const id_responsable=(req.body.id_responsable);
    const estado=(req.body.estado);
    const fecha_actualizacion=(req.body.fecha_actualizacion);
    const id_diagnostico=(req.body.id_diagnostico);
    const causa_raiz=(req.body.causa_raiz);
    const solucion_propuesta=(req.body.solucion_propuesta);
    const fecha_diagnostico=(req.body.fecha_diagnostico);
    const tipo=(req.body.tipo);
    const marca=(req.body.marca);
    const modelo=(req.body.modelo);
    const numero_serie=(req.body.numero_serie);
    const procesador=(req.body.procesador);
    const ram=(req.body.ram);
    const almacenamiento=(req.body.almacenamiento);
    const sistema_operativo=(req.body.sistema_operativo);
    const fecha_compra=(req.body.fecha_compra);
    const garantia_hasta=(req.body.garantia_hasta);
    const fecha_registro=(req.body.fecha_registro);
    const actualizacion=(req.body.actualizacion);
    const id_estadistica=(req.body.id_estadistica);
    const periodo=(req.body.periodo);
    const fecha=(req.body.fecha);
    const valor=(req.body.valor);
    const detalle=(req.body.detalle);
    const id_notificacion=(req.body.id_notificacion);
    const id_usuario_destino=(req.body.id_usuario_destino);
    const id_tecnico_destino=(req.body.id_tecnico_destino);
    const titulo=(req.body.titulo);
    const mensaje=(req.body.mensaje);
    const fecha_envio=(req.body.fecha_envio);
    const fecha_lectura=(req.body.fecha_lectura);
    const id_referencia=(req.body.id_referencia);
    const id_parte=(req.body.id_parte);
    const id_cantidad=(req.body.id_cantidad);
    const proveedor=(req.body.proveedor);
    const codigo_referencia=(req.body.codigo_referencia);
    const id_solicitud=(req.body.id_solicitud);
    const fecha_reparacion=(req.body.fecha_reparacion);
    const fecha_inicio=(req.body.fecha_inicio);
    const fecha_fin=(req.body.fecha_fin);
    const costo_estimado=(req.body.costo_estimado);
    const costo_final=(req.body.costo_final);
    const tiempo_final=(req.body.tiempo_final);
    const id_reparacion_partes=(req.body.id_reparacion_partes);
    const cantidad=(req.body.cantidad);
    const costo_unitario=(req.body.costo_unitario);
    const id_reporte=(req.body.id_reporte);
    const id_usuario_generador=(req.body.id_usuario_generador);
    const formato=(req.body.formato);
    const ruta_archivo=(req.body.ruta_archivo);
    const fecha_generacion=(req.body.fecha_generacion);
    const parametro=(req.body.parametro);
    const urgencia=(req.body.urgencia);
    const fecha_solicitud=(req.body.fecha_solicitud);
    const fecha_cierre=(req.body.fecha_cierre);
    const comentario_cierre=(req.body.comentario_cierre);
    const email=(req.body.email);
    const especialidad=(req.body.especialidad);
    const puesto=(req.body.puesto);
    
    
    conexion.query('insert into client set ?', {id_asignacion:id_asignacion,id_usuario:id_usuario,id_equipo:id_equipo,
    fecha_asignacion:fecha_asignacion,motivo_asignacion:motivo_asignacion,creado_por:creado_por,fecha_creacion:fecha_creacion,id_auditoria:id_auditoria,tabla_afectada:tabla_afectada,id_registro:id_registro,accion:accion,id_tecnico:id_tecnico,fecha_accion:fecha_accion,valores_anteriores:valores_anteriores,valores_nuevos:valores_nuevos,id_origen:id_origen,id_bitacora:id_bitacora,observaciones:observaciones,id_usuario_responsable:id_usuario_responsable,id_reparacion:id_reparacion,tipo_accion:tipo_accion,descripcion:descripcion,duracion_minutos:duracion_minutos,id_departamento:id_departamento,nombre:nombre,codigo:codigo,id_responsable:id_responsable,estado:estado,fecha_actualizacion:fecha_actualizacion,id_diagnostico:id_diagnostico,causa_raiz:causa_raiz,solucion_propuesta:solucion_propuesta,fecha_diagnostico:fecha_diagnostico,tipo:tipo,marca:marca,modelo:modelo,numero_serie:numero_serie,procesador:procesador,ram:ram,almacenamiento:almacenamiento,sistema_operativo:sistema_operativo,fecha_compra:fecha_compra,garantia_hasta:garantia_hasta,fecha_registro:fecha_registro,actualizacion:actualizacion,id_estadistica:id_estadistica,periodo:periodo,fecha:fecha,valor:valor,detalle:detalle,id_notificacion:id_notificacion,id_usuario_destino:id_usuario_destino,id_tecnico_destino:id_tecnico_destino,titulo:titulo,mensaje:mensaje,fecha_envio:fecha_envio,fecha_lectura:fecha_lectura,id_referencia:id_referencia,id_parte:id_parte,id_cantidad:id_cantidad,proveedor:proveedor,codigo_referencia:codigo_referencia,id_solicitud:id_solicitud,fecha_reparacion:fecha_reparacion,fecha_inicio:fecha_inicio,fecha_fin:fecha_fin,costo_estimado:costo_estimado,costo_final:costo_final,tiempo_final:tiempo_final,id_reparacion_partes:id_reparacion_partes,cantidad:cantidad,costo_unitario:costo_unitario,id_reporte:id_reporte,id_usuario_generador:id_usuario_generador,formato:formato,ruta_archivo:ruta_archivo,fecha_generacion:fecha_generacion,parametro:parametro,urgencia:urgencia,fecha_solicitud:fecha_solicitud,fecha_cierre:fecha_cierre,comentario_cierre:comentario_cierre,email:email,especialidad:especialidad,puesto:puesto},codigo,(error,resultado=>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/client')
        }


    }
    
    ));


}

exports.edit=(req,res)=>{
    const id_asignacion=(req.body.id_asignacion);
    const id_usuario=(req.body.id_usuario);
    const id_equipo=(req.body.id_equipo);
    const fecha_asignacion=(req.body.fecha_asignacion);
    const motivo_asignacion=(req.body.motivo_asignacion);
    const creado_por=(req.body.creado_por);
    const fecha_creacion=(req.body.fecha_creacion);
    const id_auditoria=(req.body.id_auditoria);
    const tabla_afectada=(req.body.tabla_afectada);
    const id_registro=(req.body.id_registro);
    const accion=(req.body.accion);
    const id_tecnico=(req.body.id_tecnico);
    const fecha_accion=(req.body.fecha_accion);
    const valores_anteriores=(req.body.valores_anteriores);
    const valores_nuevos=(req.body.valores_nuevos);
    const id_origen=(req.body.id_origen);
    const id_bitacora=(req.body.id_bitacora);
    const observaciones=(req.body.observaciones);
    const id_usuario_responsable=(req.body.id_usuario_responsable);
    const id_reparacion=(req.body.id_reparacion);
    const tipo_accion=(req.body.tipo_accion);
    const descripcion=(req.body.descripcion);
    const duracion_minutos=(req.body.duracion_minutos);
    const id_departamento=(req.body.id_departamento);
    const nombre=(req.body.nombre);
    const codigo=(req.body.codigo);
    const id_responsable=(req.body.id_responsable);
    const estado=(req.body.estado);
    const fecha_actualizacion=(req.body.fecha_actualizacion);
    const id_diagnostico=(req.body.id_diagnostico);
    const causa_raiz=(req.body.causa_raiz);
    const solucion_propuesta=(req.body.solucion_propuesta);
    const fecha_diagnostico=(req.body.fecha_diagnostico);
    const tipo=(req.body.tipo);
    const marca=(req.body.marca);
    const modelo=(req.body.modelo);
    const numero_serie=(req.body.numero_serie);
    const procesador=(req.body.procesador);
    const ram=(req.body.ram);
    const almacenamiento=(req.body.almacenamiento);
    const sistema_operativo=(req.body.sistema_operativo);
    const fecha_compra=(req.body.fecha_compra);
    const garantia_hasta=(req.body.garantia_hasta);
    const fecha_registro=(req.body.fecha_registro);
    const actualizacion=(req.body.actualizacion);
    const id_estadistica=(req.body.id_estadistica);
    const periodo=(req.body.periodo);
    const fecha=(req.body.fecha);
    const valor=(req.body.valor);
    const detalle=(req.body.detalle);
    const id_notificacion=(req.body.id_notificacion);
    const id_usuario_destino=(req.body.id_usuario_destino);
    const id_tecnico_destino=(req.body.id_tecnico_destino);
    const titulo=(req.body.titulo);
    const mensaje=(req.body.mensaje);
    const fecha_envio=(req.body.fecha_envio);
    const fecha_lectura=(req.body.fecha_lectura);
    const id_referencia=(req.body.id_referencia);
    const id_parte=(req.body.id_parte);
    const id_cantidad=(req.body.id_cantidad);
    const proveedor=(req.body.proveedor);
    const codigo_referencia=(req.body.codigo_referencia);
    const id_solicitud=(req.body.id_solicitud);
    const fecha_reparacion=(req.body.fecha_reparacion);
    const fecha_inicio=(req.body.fecha_inicio);
    const fecha_fin=(req.body.fecha_fin);
    const costo_estimado=(req.body.costo_estimado);
    const costo_final=(req.body.costo_final);
    const tiempo_final=(req.body.tiempo_final);
    const id_reparacion_partes=(req.body.id_reparacion_partes);
    const cantidad=(req.body.cantidad);
    const costo_unitario=(req.body.costo_unitario);
    const id_reporte=(req.body.id_reporte);
    const id_usuario_generador=(req.body.id_usuario_generador);
    const formato=(req.body.formato);
    const ruta_archivo=(req.body.ruta_archivo);
    const fecha_generacion=(req.body.fecha_generacion);
    const parametro=(req.body.parametro);
    const urgencia=(req.body.urgencia);
    const fecha_solicitud=(req.body.fecha_solicitud);
    const fecha_cierre=(req.body.fecha_cierre);
    const comentario_cierre=(req.body.comentario_cierre);
    const email=(req.body.email);
    const especialidad=(req.body.especialidad);
    const puesto=(req.body.puesto);
    
    
    conexion.query('insert into client set ?', {id_asignacion:id_asignacion,id_usuario:id_usuario,id_equipo:id_equipo,
        fecha_asignacion:fecha_asignacion,motivo_asignacion:motivo_asignacion,creado_por:creado_por,fecha_creacion:fecha_creacion,id_auditoria:id_auditoria,tabla_afectada:tabla_afectada,id_registro:id_registro,accion:accion,id_tecnico:id_tecnico,fecha_accion:fecha_accion,valores_anteriores:valores_anteriores,valores_nuevos:valores_nuevos,id_origen:id_origen,id_bitacora:id_bitacora,observaciones:observaciones,id_usuario_responsable:id_usuario_responsable,id_reparacion:id_reparacion,tipo_accion:tipo_accion,descripcion:descripcion,duracion_minutos:duracion_minutos,id_departamento:id_departamento,nombre:nombre,codigo:codigo,id_responsable:id_responsable,estado:estado,fecha_actualizacion:fecha_actualizacion,id_diagnostico:id_diagnostico,causa_raiz:causa_raiz,solucion_propuesta:solucion_propuesta,fecha_dianostico:fecha_dianostico,tipo:tipo,marca:marca,modelo:modelo,numero_serie:numero_serie,procesador:procesador,ram:ram,almacenamiento:almacenamiento,sistema_operativo:sistema_operativo,fecha_compra:fecha_compra,garantia_hasta:garantia_hasta,fecha_registro:fecha_registro,actualizacion:actualizacion,id_estadistica:id_estadistica,periodo:periodo,fecha:fecha,valor:valor,detalle:detalle,id_notificacion:id_notificacion,id_usuario_destino:id_usuario_destino,id_tecnico_destino:id_tecnico_destino,titulo:titulo,mensaje:mensaje,fecha_envio:fecha_envio,fecha_lectura:fecha_lectura,id_referencia:id_referencia,id_parte:id_parte,id_cantidad:id_cantidad,proveedor:proveedor,codigo_referencia:codigo_referencia,id_solicitud:id_solicitud,fecha_reparacion:fecha_reparacion,fecha_inicio:fecha_inicio,fecha_fin:fecha_fin,costo_estimado:costo_estimado,costo_final:costo_final,tiempo_final:tiempo_final,id_reparacion_partes:id_reparacion_partes,cantidad:cantidad,costo_unitario:costo_unitario,id_reporte:id_reporte,id_usuario_generador:id_usuario_generador,formato:formato,ruta_archivo:ruta_archivo,fecha_generacion:fecha_generacion,parametro:parametro,urgencia:urgencia,fecha_solicitud:fecha_solicitud,fecha_cierre:fecha_cierre,comentario_cierre:comentario_cierre,email:email,especialidad:especialidad,puesto:puesto},codigo,(error,resultado=>{
            if(error){
                console.log(error);
            }
            else{
                res.redirect('/client')
            }
    
    
        }
        
        ));
    



   
}

    exports.eliminar=(req,res)=>{
        const id_asignacion=(req.body.id_asignacion);
        const id_usuario=(req.body.id_usuario);
        const id_equipo=(req.body.id_equipo);
        const fecha_asignacion=(req.body.fecha_asignacion);
        const motivo_asignacion=(req.body.motivo_asignacion);
        const creado_por=(req.body.creado_por);
        const fecha_creacion=(req.body.fecha_creacion);
        const id_auditoria=(req.body.id_auditoria);
        const tabla_afectada=(req.body.tabla_afectada);
        const id_registro=(req.body.id_registro);
        const accion=(req.body.accion);
        const id_tecnico=(req.body.id_tecnico);
        const fecha_accion=(req.body.fecha_accion);
        const valores_anteriores=(req.body.valores_anteriores);
        const valores_nuevos=(req.body.valores_nuevos);
        const id_origen=(req.body.id_origen);
        const id_bitacora=(req.body.id_bitacora);
        const observaciones=(req.body.observaciones);
        const id_usuario_responsable=(req.body.id_usuario_responsable);
        const id_reparacion=(req.body.id_reparacion);
        const tipo_accion=(req.body.tipo_accion);
        const descripcion=(req.body.descripcion);
        const duracion_minutos=(req.body.duracion_minutos);
        const id_departamento=(req.body.id_departamento);
        const nombre=(req.body.nombre);
        const codigo=(req.body.codigo);
        const id_responsable=(req.body.id_responsable);
        const estado=(req.body.estado);
        const fecha_actualizacion=(req.body.fecha_actualizacion);
        const id_diagnostico=(req.body.id_diagnostico);
        const causa_raiz=(req.body.causa_raiz);
        const solucion_propuesta=(req.body.solucion_propuesta);
        const fecha_diagnostico=(req.body.fecha_diagnostico);
        const tipo=(req.body.tipo);
        const marca=(req.body.marca);
        const modelo=(req.body.modelo);
        const numero_serie=(req.body.numero_serie);
        const procesador=(req.body.procesador);
        const ram=(req.body.ram);
        const almacenamiento=(req.body.almacenamiento);
        const sistema_operativo=(req.body.sistema_operativo);
        const fecha_compra=(req.body.fecha_compra);
        const garantia_hasta=(req.body.garantia_hasta);
        const fecha_registro=(req.body.fecha_registro);
        const actualizacion=(req.body.actualizacion);
        const id_estadistica=(req.body.id_estadistica);
        const periodo=(req.body.periodo);
        const fecha=(req.body.fecha);
        const valor=(req.body.valor);
        const detalle=(req.body.detalle);
        const id_notificacion=(req.body.id_notificacion);
        const id_usuario_destino=(req.body.id_usuario_destino);
        const id_tecnico_destino=(req.body.id_tecnico_destino);
        const titulo=(req.body.titulo);
        const mensaje=(req.body.mensaje);
        const fecha_envio=(req.body.fecha_envio);
        const fecha_lectura=(req.body.fecha_lectura);
        const id_referencia=(req.body.id_referencia);
        const id_parte=(req.body.id_parte);
        const id_cantidad=(req.body.id_cantidad);
        const proveedor=(req.body.proveedor);
        const codigo_referencia=(req.body.codigo_referencia);
        const id_solicitud=(req.body.id_solicitud);
        const fecha_reparacion=(req.body.fecha_reparacion);
        const fecha_inicio=(req.body.fecha_inicio);
        const fecha_fin=(req.body.fecha_fin);
        const costo_estimado=(req.body.costo_estimado);
        const costo_final=(req.body.costo_final);
        const tiempo_final=(req.body.tiempo_final);
        const id_reparacion_partes=(req.body.id_reparacion_partes);
        const cantidad=(req.body.cantidad);
        const costo_unitario=(req.body.costo_unitario);
        const id_reporte=(req.body.id_reporte);
        const id_usuario_generador=(req.body.id_usuario_generador);
        const formato=(req.body.formato);
        const ruta_archivo=(req.body.ruta_archivo);
        const fecha_generacion=(req.body.fecha_generacion);
        const parametro=(req.body.parametro);
        const urgencia=(req.body.urgencia);
        const fecha_solicitud=(req.body.fecha_solicitud);
        const fecha_cierre=(req.body.fecha_cierre);
        const comentario_cierre=(req.body.comentario_cierre);
        const email=(req.body.email);
        const especialidad=(req.body.especialidad);
        const puesto=(req.body.puesto);
        
    conexion.query('insert into client set ?', {id_asignacion:id_asignacion,id_usuario:id_usuario,id_equipo:id_equipo,
        fecha_asignacion:fecha_asignacion,motivo_asignacion:motivo_asignacion,creado_por:creado_por,fecha_creacion:fecha_creacion,id_auditoria:id_auditoria,tabla_afectada:tabla_afectada,id_registro:id_registro,accion:accion,id_tecnico:id_tecnico,fecha_accion:fecha_accion,valores_anteriores:valores_anteriores,valores_nuevos:valores_nuevos,id_origen:id_origen,id_bitacora:id_bitacora,observaciones:observaciones,id_usuario_responsable:id_usuario_responsable,id_reparacion:id_reparacion,tipo_accion:tipo_accion,descripcion:descripcion,duracion_minutos:duracion_minutos,id_departamento:id_departamento,nombre:nombre,codigo:codigo,id_responsable:id_responsable,estado:estado,fecha_actualizacion:fecha_actualizacion,id_diagnostico:id_diagnostico,causa_raiz:causa_raiz,solucion_propuesta:solucion_propuesta,fecha_dianostico:fecha_dianostico,tipo:tipo,marca:marca,modelo:modelo,numero_serie:numero_serie,procesador:procesador,ram:ram,almacenamiento:almacenamiento,sistema_operativo:sistema_operativo,fecha_compra:fecha_compra,garantia_hasta:garantia_hasta,fecha_registro:fecha_registro,actualizacion:actualizacion,id_estadistica:id_estadistica,periodo:periodo,fecha:fecha,valor:valor,detalle:detalle,id_notificacion:id_notificacion,id_usuario_destino:id_usuario_destino,id_tecnico_destino:id_tecnico_destino,titulo:titulo,mensaje:mensaje,fecha_envio:fecha_envio,fecha_lectura:fecha_lectura,id_referencia:id_referencia,id_parte:id_parte,id_cantidad:id_cantidad,proveedor:proveedor,codigo_referencia:codigo_referencia,id_solicitud:id_solicitud,fecha_reparacion:fecha_reparacion,fecha_inicio:fecha_inicio,fecha_fin:fecha_fin,costo_estimado:costo_estimado,costo_final:costo_final,tiempo_final:tiempo_final,id_reparacion_partes:id_reparacion_partes,cantidad:cantidad,costo_unitario:costo_unitario,id_reporte:id_reporte,id_usuario_generador:id_usuario_generador,formato:formato,ruta_archivo:ruta_archivo,fecha_generacion:fecha_generacion,parametro:parametro,urgencia:urgencia,fecha_solicitud:fecha_solicitud,fecha_cierre:fecha_cierre,comentario_cierre:comentario_cierre,email:email,especialidad:especialidad,puesto:puesto},codigo,(error,resultado=>{
            if(error){
                console.log(error);
            }
            else{
                res.redirect('/client')
            }
    
    
        }
        
        ));
    
}

        exports.ver=(req,res)=>{
            const id_asignacion=(req.body.id_asignacion);
            const id_usuario=(req.body.id_usuario);
            const id_equipo=(req.body.id_equipo);
            const fecha_asignacion=(req.body.fecha_asignacion);
            const motivo_asignacion=(req.body.motivo_asignacion);
            const creado_por=(req.body.creado_por);
            const fecha_creacion=(req.body.fecha_creacion);
            const id_auditoria=(req.body.id_auditoria);
            const tabla_afectada=(req.body.tabla_afectada);
            const id_registro=(req.body.id_registro);
            const accion=(req.body.accion);
            const id_tecnico=(req.body.id_tecnico);
            const fecha_accion=(req.body.fecha_accion);
            const valores_anteriores=(req.body.valores_anteriores);
            const valores_nuevos=(req.body.valores_nuevos);
            const id_origen=(req.body.id_origen);
            const id_bitacora=(req.body.id_bitacora);
            const observaciones=(req.body.observaciones);
            const id_usuario_responsable=(req.body.id_usuario_responsable);
            const id_reparacion=(req.body.id_reparacion);
            const tipo_accion=(req.body.tipo_accion);
            const descripcion=(req.body.descripcion);
            const duracion_minutos=(req.body.duracion_minutos);
            const id_departamento=(req.body.id_departamento);
            const nombre=(req.body.nombre);
            const codigo=(req.body.codigo);
            const id_responsable=(req.body.id_responsable);
            const estado=(req.body.estado);
            const fecha_actualizacion=(req.body.fecha_actualizacion);
            const id_diagnostico=(req.body.id_diagnostico);
            const causa_raiz=(req.body.causa_raiz);
            const solucion_propuesta=(req.body.solucion_propuesta);
            const fecha_diagnostico=(req.body.fecha_diagnostico);
            const tipo=(req.body.tipo);
            const marca=(req.body.marca);
            const modelo=(req.body.modelo);
            const numero_serie=(req.body.numero_serie);
            const procesador=(req.body.procesador);
            const ram=(req.body.ram);
            const almacenamiento=(req.body.almacenamiento);
            const sistema_operativo=(req.body.sistema_operativo);
            const fecha_compra=(req.body.fecha_compra);
            const garantia_hasta=(req.body.garantia_hasta);
            const fecha_registro=(req.body.fecha_registro);
            const actualizacion=(req.body.actualizacion);
            const id_estadistica=(req.body.id_estadistica);
            const periodo=(req.body.periodo);
            const fecha=(req.body.fecha);
            const valor=(req.body.valor);
            const detalle=(req.body.detalle);
            const id_notificacion=(req.body.id_notificacion);
            const id_usuario_destino=(req.body.id_usuario_destino);
            const id_tecnico_destino=(req.body.id_tecnico_destino);
            const titulo=(req.body.titulo);
            const mensaje=(req.body.mensaje);
            const fecha_envio=(req.body.fecha_envio);
            const fecha_lectura=(req.body.fecha_lectura);
            const id_referencia=(req.body.id_referencia);
            const id_parte=(req.body.id_parte);
            const id_cantidad=(req.body.id_cantidad);
            const proveedor=(req.body.proveedor);
            const codigo_referencia=(req.body.codigo_referencia);
            const id_solicitud=(req.body.id_solicitud);
            const fecha_reparacion=(req.body.fecha_reparacion);
            const fecha_inicio=(req.body.fecha_inicio);
            const fecha_fin=(req.body.fecha_fin);
            const costo_estimado=(req.body.costo_estimado);
            const costo_final=(req.body.costo_final);
            const tiempo_final=(req.body.tiempo_final);
            const id_reparacion_partes=(req.body.id_reparacion_partes);
            const cantidad=(req.body.cantidad);
            const costo_unitario=(req.body.costo_unitario);
            const id_reporte=(req.body.id_reporte);
            const id_usuario_generador=(req.body.id_usuario_generador);
            const formato=(req.body.formato);
            const ruta_archivo=(req.body.ruta_archivo);
            const fecha_generacion=(req.body.fecha_generacion);
            const parametro=(req.body.parametro);
            const urgencia=(req.body.urgencia);
            const fecha_solicitud=(req.body.fecha_solicitud);
            const fecha_cierre=(req.body.fecha_cierre);
            const comentario_cierre=(req.body.comentario_cierre);
            const email=(req.body.email);
            const especialidad=(req.body.especialidad);
            const puesto=(req.body.puesto); 
    
            
    conexion.query('insert into client set ?', {id_asignacion:id_asignacion,id_usuario:id_usuario,id_equipo:id_equipo,
        fecha_asignacion:fecha_asignacion,motivo_asignacion:motivo_asignacion,creado_por:creado_por,fecha_creacion:fecha_creacion,id_auditoria:id_auditoria,tabla_afectada:tabla_afectada,id_registro:id_registro,accion:accion,id_tecnico:id_tecnico,fecha_accion:fecha_accion,valores_anteriores:valores_anteriores,valores_nuevos:valores_nuevos,id_origen:id_origen,id_bitacora:id_bitacora,observaciones:observaciones,id_usuario_responsable:id_usuario_responsable,id_reparacion:id_reparacion,tipo_accion:tipo_accion,descripcion:descripcion,duracion_minutos:duracion_minutos,id_departamento:id_departamento,nombre:nombre,codigo:codigo,id_responsable:id_responsable,estado:estado,fecha_actualizacion:fecha_actualizacion,id_diagnostico:id_diagnostico,causa_raiz:causa_raiz,solucion_propuesta:solucion_propuesta,fecha_dianostico:fecha_dianostico,tipo:tipo,marca:marca,modelo:modelo,numero_serie:numero_serie,procesador:procesador,ram:ram,almacenamiento:almacenamiento,sistema_operativo:sistema_operativo,fecha_compra:fecha_compra,garantia_hasta:garantia_hasta,fecha_registro:fecha_registro,actualizacion:actualizacion,id_estadistica:id_estadistica,periodo:periodo,fecha:fecha,valor:valor,detalle:detalle,id_notificacion:id_notificacion,id_usuario_destino:id_usuario_destino,id_tecnico_destino:id_tecnico_destino,titulo:titulo,mensaje:mensaje,fecha_envio:fecha_envio,fecha_lectura:fecha_lectura,id_referencia:id_referencia,id_parte:id_parte,id_cantidad:id_cantidad,proveedor:proveedor,codigo_referencia:codigo_referencia,id_solicitud:id_solicitud,fecha_reparacion:fecha_reparacion,fecha_inicio:fecha_inicio,fecha_fin:fecha_fin,costo_estimado:costo_estimado,costo_final:costo_final,tiempo_final:tiempo_final,id_reparacion_partes:id_reparacion_partes,cantidad:cantidad,costo_unitario:costo_unitario,id_reporte:id_reporte,id_usuario_generador:id_usuario_generador,formato:formato,ruta_archivo:ruta_archivo,fecha_generacion:fecha_generacion,parametro:parametro,urgencia:urgencia,fecha_solicitud:fecha_solicitud,fecha_cierre:fecha_cierre,comentario_cierre:comentario_cierre,email:email,especialidad:especialidad,puesto:puesto},codigo,(error,resultado=>{
            if(error){
                console.log(error);
            }
            else{
                res.redirect('/client')
            }
    
    
        }
        
        ));
    
    

};
