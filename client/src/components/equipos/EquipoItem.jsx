// client/src/components/equipos/EquipoItem.jsx
import React from 'react';

function EquipoItem({ equipo, onView, onEdit }) {
    // Función para mostrar un color según el estado
    const getEstadoClass = (estado) => {
        switch (estado) {
            case 'disponible': return 'estado-disponible';
            case 'asignado': return 'estado-asignado';
            case 'en_reparacion': return 'estado-reparacion';
            case 'descarte': return 'estado-descarte';
            case 'baja': return 'estado-baja';
            default: return '';
        }
    };

    return (
        <tr>
            <td>{equipo.id_equipo}</td>
            <td>{equipo.tipo}</td>
            <td>{equipo.marca}</td>
            <td>{equipo.modelo}</td>
            <td>{equipo.numero_serie}</td>
            <td className={getEstadoClass(equipo.estado)}>
                {equipo.estado}
            </td>
            <td>{equipo.departamento_nombre || '-'}</td>
            <td>
                <div className="botones-accion">
                    <button
                        className="button azul-claro"
                        onClick={() => onView(equipo.id_equipo)}
                    >
                        Ver
                    </button>
                    <button
                        className="button"
                        onClick={() => onEdit(equipo)}
                    >
                        Editar
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default EquipoItem;