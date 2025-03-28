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
    const tipo_accion=(req.body.id_bitacora_reparacion);
    const descripcion=(req.body.descripcion);
    const duracion_minutos=(req.body.id_bitacora_reparacion);
    const id_departamento=(req.body.id_departamento);
    const nombre=(req.body.nombre);
    const codigo=(req.body.codigo);
    const id_responsable=(req.body.id_responsable);
    const estado=(req.body.estado);
    const fecha_actualizacion=(req.body.fecha_actualizacion);
    const id_diagnostico=(req.body.id_diagnostico);
    const causa_raiz=(req.body.causa_raiz);
    const solucion_propuesta=(req.body.solucion_propuesta);
    const fecha_dianostico=(req.body.fecha_dianostico);
    const tipo=(req.body.tipo);
    const marca=(req.body.marca);
    const modelo=(req.body.modelo);
    const numero_serie=(req.body.numero_serie);
    const procesador=(req.body.procesador);
    const ram=(req.body.ram);
    const almacenamiento=(req.almacenamiento);
    const sistema_operativo=(req.body.sistema_operativo);
    const fecha_compra_=(req.body.fecha_compra);
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
    const fecha_inicio=(req.body.id_inicio);
    const fecha_fin=(req.body.id_fin);
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
    const f=(req.body.puesto);
    
    conexion.query('insert into client set ?', {nombre:nombre,apellido:apellido,edad:edad,
    telefono:telefono,cuidad:cuidad},(error,resultado=>{
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
    const tipo_accion=(req.body.id_bitacora_reparacion);
    const descripcion=(req.body.descripcion);
    const duracion_minutos=(req.body.id_bitacora_reparacion);
    const id_departamento=(req.body.id_departamento);
    const nombre=(req.body.nombre);
    const codigo=(req.body.codigo);
    const id_responsable=(req.body.id_responsable);
    const estado=(req.body.estado);
    const fecha_actualizacion=(req.body.fecha_actualizacion);
    const id_diagnostico=(req.body.id_diagnostico);
    const causa_raiz=(req.body.causa_raiz);
    const solucion_propuesta=(req.body.solucion_propuesta);
    const fecha_dianostico=(req.body.fecha_dianostico);
    const tipo=(req.body.tipo);
    const marca=(req.body.marca);
    const modelo=(req.body.modelo);
    const numero_serie=(req.body.numero_serie);
    const procesador=(req.body.procesador);
    const ram=(req.body.ram);
    const almacenamiento=(req.almacenamiento);
    const sistema_operativo=(req.body.sistema_operativo);
    const fecha_compra_=(req.body.fecha_compra);
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
    const fecha_inicio=(req.body.id_inicio);
    const fecha_fin=(req.body.id_fin);
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
    const f=(req.body.puesto);
    
    conexion.query("update client set  ?  where codigo =?",[{nombre:nombre,apellido:apellido,edad:edad,
        telefono:telefono,cuidad:cuidad},codigo],(error,resultado)=>{
            if(error){
                console.log(error);
            }
            else{
                res.redirect('/client')
            }

                    
    });
 
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
    const tipo_accion=(req.body.id_bitacora_reparacion);
    const descripcion=(req.body.descripcion);
    const duracion_minutos=(req.body.id_bitacora_reparacion);
    const id_departamento=(req.body.id_departamento);
    const nombre=(req.body.nombre);
    const codigo=(req.body.codigo);
    const id_responsable=(req.body.id_responsable);
    const estado=(req.body.estado);
    const fecha_actualizacion=(req.body.fecha_actualizacion);
    const id_diagnostico=(req.body.id_diagnostico);
    const causa_raiz=(req.body.causa_raiz);
    const solucion_propuesta=(req.body.solucion_propuesta);
    const fecha_dianostico=(req.body.fecha_dianostico);
    const tipo=(req.body.tipo);
    const marca=(req.body.marca);
    const modelo=(req.body.modelo);
    const numero_serie=(req.body.numero_serie);
    const procesador=(req.body.procesador);
    const ram=(req.body.ram);
    const almacenamiento=(req.almacenamiento);
    const sistema_operativo=(req.body.sistema_operativo);
    const fecha_compra_=(req.body.fecha_compra);
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
    const fecha_inicio=(req.body.id_inicio);
    const fecha_fin=(req.body.id_fin);
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
    const f=(req.body.puesto);
        
        conexion.query("update client set  ?  where codigo =?",[{nombre:nombre,apellido:apellido,edad:edad,
            telefono:telefono,cuidad:cuidad},codigo],(error,resultado)=>{
                if(error){
                    console.log(error);
                }
                else{
                    res.redirect('/client')
                }
    
               
        });

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
    const tipo_accion=(req.body.id_bitacora_reparacion);
    const descripcion=(req.body.descripcion);
    const duracion_minutos=(req.body.id_bitacora_reparacion);
    const id_departamento=(req.body.id_departamento);
    const nombre=(req.body.nombre);
    const codigo=(req.body.codigo);
    const id_responsable=(req.body.id_responsable);
    const estado=(req.body.estado);
    const fecha_actualizacion=(req.body.fecha_actualizacion);
    const id_diagnostico=(req.body.id_diagnostico);
    const causa_raiz=(req.body.causa_raiz);
    const solucion_propuesta=(req.body.solucion_propuesta);
    const fecha_dianostico=(req.body.fecha_dianostico);
    const tipo=(req.body.tipo);
    const marca=(req.body.marca);
    const modelo=(req.body.modelo);
    const numero_serie=(req.body.numero_serie);
    const procesador=(req.body.procesador);
    const ram=(req.body.ram);
    const almacenamiento=(req.almacenamiento);
    const sistema_operativo=(req.body.sistema_operativo);
    const fecha_compra_=(req.body.fecha_compra);
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
    const fecha_inicio=(req.body.id_inicio);
    const fecha_fin=(req.body.id_fin);
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
    const f=(req.body.puesto); 
            
            conexion.query("update client set  ?  where codigo =?",[{nombre:nombre,apellido:apellido,edad:edad,
                telefono:telefono,cuidad:cuidad},codigo],(error,resultado)=>{
                    if(error){
                        console.log(error);
                    }
                    else{
                        res.redirect('/client')
                    }
        
                   
            });
        
    

};
