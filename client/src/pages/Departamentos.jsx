// client/src/pages/Departamentos.jsx
import { useEffect, useContext, useState } from 'react';
import { TitleContext } from '../context/TitleContext';
import DepartamentosList from '../components/departamentos/DepartamentosList';
import DepartamentoDetalle from '../components/departamentos/DepartamentoDetalle';
import DepartamentoForm from '../components/departamentos/DepartamentoForm';
import '../assets/departamentos.css';

function Departamentos() {
    const { setTitle } = useContext(TitleContext);
    const [vista, setVista] = useState('lista'); // 'lista', 'detalle', 'form'
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);

    useEffect(() => {
        setTitle("DEPARTAMENTOS");
    }, [setTitle]);

    const handleVerDepartamento = (id) => {
        setDepartamentoSeleccionado(id);
        setVista('detalle');
    };

    const handleEditarDepartamento = (departamento) => {
        setDepartamentoSeleccionado(departamento);
        setVista('form');
    };

    const handleNuevoDepartamento = () => {
        setDepartamentoSeleccionado(null);
        setVista('form');
    };

    const handleVolverLista = () => {
        setVista('lista');
        setDepartamentoSeleccionado(null);
    };

    const handleGuardarDepartamento = () => {
        // Volver a la lista después de guardar
        setVista('lista');
    };

    const handleEliminarDepartamento = () => {
        // Volver a la lista después de eliminar
        setVista('lista');
    };

    // Renderizado condicional según la vista actual
    if (vista === 'detalle' && departamentoSeleccionado) {
        return (
            <div className="contenedor-padre" id="contenedor-padre">
                <DepartamentoDetalle
                    id={departamentoSeleccionado}
                    onClose={handleVolverLista}
                    onEdit={handleEditarDepartamento}
                    onDelete={handleEliminarDepartamento}
                />
            </div>
        );
    }

    if (vista === 'form') {
        return (
            <div className="contenedor-padre" id="contenedor-padre">
                <DepartamentoForm
                    departamento={departamentoSeleccionado}
                    onSave={handleGuardarDepartamento}
                    onCancel={handleVolverLista}
                />
            </div>
        );
    }

    // Vista por defecto (lista)
    return (
        <div className="contenedor-padre" id="contenedor-padre">
            <div className="container-widgets">
                <div className="container-botones">
                    <button
                        className="button azul-claro"
                        onClick={handleNuevoDepartamento}
                    >
                        Nuevo Departamento
                    </button>
                </div>

                <DepartamentosList
                    onView={handleVerDepartamento}
                    onEdit={handleEditarDepartamento}
                    onDelete={handleEliminarDepartamento}
                />
            </div>
        </div>
    );
}

export default Departamentos;