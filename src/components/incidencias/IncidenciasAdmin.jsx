import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/useAuth';
import {
  getIncidencias,
  updateEstadoIncidencia,
} from '../../services/incidencia.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './IncidenciasAdmin.css';

export const IncidenciasAdmin = () => {
  const { user } = useAuth();

  const [incidencias, setIncidencias] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState(null);

  // 🔥 CARGA SOLO UNA VEZ (SIN FILTROS)
  const cargarIncidencias = async () => {
    try {
      setLoading(true);
      const data = await getIncidencias(user.token);
      setIncidencias(data);
    } catch (error) {
      console.error('Error al cargar incidencias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarIncidencias();
  }, []);

  // 🔥 FILTROS LOCALES
  const incidenciasFiltradas = useMemo(() => {
    return incidencias.filter((inc) => {
      const fechaIncidencia = new Date(inc.fecha);

      const cumpleEstado =
        !estadoFiltro || inc.estado === estadoFiltro;

      const cumpleDesde =
        !fechaDesde ||
        fechaIncidencia >= new Date(fechaDesde);

      const cumpleHasta =
        !fechaHasta ||
        fechaIncidencia <= new Date(fechaHasta + 'T23:59:59');

      return cumpleEstado && cumpleDesde && cumpleHasta;
    });
  }, [incidencias, estadoFiltro, fechaDesde, fechaHasta]);

  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await updateEstadoIncidencia(user.token, id, nuevoEstado);

      // 🔥 Actualización local optimizada
      setIncidencias((prev) =>
        prev.map((inc) =>
          inc.id_incidencia === id
            ? { ...inc, estado: nuevoEstado }
            : inc
        )
      );
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const abrirModal = (inc) => {
    setIncidenciaSeleccionada(inc);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setIncidenciaSeleccionada(null);
  };

  const descargarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Reporte de Incidencias', 14, 15);

    doc.setFontSize(10);
    doc.text(
      `Fecha generación: ${new Date().toLocaleString()}`,
      14,
      22
    );

    const tableData = incidenciasFiltradas.map((inc) => [
      inc.id_incidencia,
      inc.Espacio?.nombre || 'N/A',
      inc.tipo,
      inc.estado,
      new Date(inc.fecha).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [['ID', 'Espacio', 'Tipo', 'Estado', 'Fecha']],
      body: tableData,
      startY: 28,
    });

    doc.save('reporte_incidencias.pdf');
  };

  return (
    <div className="incidencias-card">
      <div className="incidencias-header">
        <h2>Gestión de Incidencias</h2>

        <div className="filtros-container">
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Reportado">Reportado</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Arreglado">Arreglado</option>
          </select>

          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />

          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />

          <button onClick={descargarPDF} className="btn-pdf">
            Descargar PDF
          </button>
        </div>
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
              <th>Fecha</th>
              <th>Actualizar</th>
            </tr>
          </thead>
          <tbody>
            {incidenciasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No hay incidencias registradas
                </td>
              </tr>
            ) : (
              incidenciasFiltradas.map((inc) => (
                <tr
                  key={inc.id_incidencia}
                  onClick={() => abrirModal(inc)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{inc.id_incidencia}</td>
                  <td>{inc.Espacio?.nombre}</td>
                  <td>{inc.tipo}</td>
                  <td>
                    <span className={`badge ${inc.estado?.toLowerCase()}`}>
                      {inc.estado}
                    </span>
                  </td>
                  <td>
                    {new Date(inc.fecha).toLocaleDateString()}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      value={inc.estado}
                      onChange={(e) =>
                        handleEstadoChange(
                          inc.id_incidencia,
                          e.target.value
                        )
                      }
                    >
                      <option value="Reportado">Reportado</option>
                      <option value="Mantenimiento">Mantenimiento</option>
                      <option value="Arreglado">Arreglado</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {modalOpen && incidenciaSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Detalle de Incidencia</h3>

            <p><strong>Espacio:</strong> {incidenciaSeleccionada.Espacio?.nombre}</p>
            <p><strong>Tipo:</strong> {incidenciaSeleccionada.tipo}</p>
            <p><strong>Estado:</strong> {incidenciaSeleccionada.estado}</p>
            <p><strong>Fecha:</strong> {new Date(incidenciaSeleccionada.fecha).toLocaleString()}</p>
            <p><strong>Descripción:</strong> {incidenciaSeleccionada.descripcion}</p>

            {incidenciaSeleccionada.imagen && (
              <img
                src={incidenciaSeleccionada.imagen}
                alt="Incidencia"
                className="modal-image"
              />
            )}

            <button onClick={cerrarModal} className="btn-cerrar">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
