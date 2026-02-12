import { useEffect, useState } from 'react';
import { useAuth } from '../../context/useAuth';
import {
  getIncidencias,
  updateEstadoIncidencia,
} from '../../services/incidencia.service';
import './IncidenciasAdmin.css';

export const IncidenciasAdmin = () => {
  const { user } = useAuth();
  const [incidencias, setIncidencias] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [loading, setLoading] = useState(false);

  const cargarIncidencias = async () => {
    try {
      setLoading(true);
      const data = await getIncidencias(user.token, {
        estado: estadoFiltro || undefined,
      });
      setIncidencias(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarIncidencias();
  }, [estadoFiltro]);

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await updateEstadoIncidencia(user.token, id, nuevoEstado);
      cargarIncidencias();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="incidencias-card">
      <div className="incidencias-header">
        <h2>Gestión de Incidencias</h2>

        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="revision">Revisión</option>
          <option value="arreglado">Arreglado</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-text">Cargando incidencias...</p>
      ) : (
        <table className="incidencias-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Espacio</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Actualizar</th>
            </tr>
          </thead>
          <tbody>
            {incidencias.map((inc) => (
              <tr key={inc.id}>
                <td>{inc.id}</td>
                <td>{inc.Espacio?.nombre}</td>
                <td>{inc.Espacio?.tipo}</td>
                <td>
                  <span className={`badge ${inc.estado}`}>
                    {inc.estado}
                  </span>
                </td>
                <td>
                  <select
                    value={inc.estado}
                    onChange={(e) =>
                      handleEstadoChange(inc.id, e.target.value)
                    }
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="revision">Revisión</option>
                    <option value="arreglado">Arreglado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
