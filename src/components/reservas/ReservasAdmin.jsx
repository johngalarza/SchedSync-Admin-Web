import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/useAuth';
import {
  getReservasPendientes,
  actualizarEstadoReserva,
} from '../../services/reserva.service';

export const ReservasAdmin = () => {
  const { user } = useAuth();

  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 NUEVOS ESTADOS PARA FILTRO
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const cargarReservas = async () => {
    try {
      setLoading(true);
      const data = await getReservasPendientes(user.token);
      setReservas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  // 🔥 FILTRO LOCAL
  const reservasFiltradas = useMemo(() => {
    return reservas.filter((reserva) => {
      const fechaReserva = new Date(reserva.fecha);

      const cumpleDesde =
        !fechaDesde ||
        fechaReserva >= new Date(fechaDesde);

      const cumpleHasta =
        !fechaHasta ||
        fechaReserva <= new Date(fechaHasta + 'T23:59:59');

      return cumpleDesde && cumpleHasta;
    });
  }, [reservas, fechaDesde, fechaHasta]);

  const handleEstado = async (id, estado) => {
    try {
      await actualizarEstadoReserva(id, estado, user.token);

      // 🔥 Actualización local sin recargar
      setReservas((prev) =>
        prev.filter((r) => r.id_reserva !== id)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const limpiarFiltros = () => {
    setFechaDesde('');
    setFechaHasta('');
  };

  if (loading) return <div className="admin-card">Cargando...</div>;
  if (error) return <div className="admin-card error">{error}</div>;

  return (
    <div className="admin-card">
      <h2>Reservas Pendientes</h2>

      {/* 🔥 FILTROS */}
      <div className="filtros">
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
        <button className="btn clear" onClick={limpiarFiltros}>
          Limpiar
        </button>
      </div>

      {reservasFiltradas.length === 0 ? (
        <p className="empty-text">No hay reservas pendientes</p>
      ) : (
        <div className="reservas-grid">
          {reservasFiltradas.map((reserva) => (
            <div key={reserva.id_reserva} className="reserva-item">
              <div className="reserva-info">
                <strong>Espacio:</strong> {reserva.id_espacio}
                <br />
                <strong>Fecha:</strong>{' '}
                {new Date(reserva.fecha).toLocaleDateString()}
                <br />
                <strong>Horario:</strong>{' '}
                {reserva.hora_inicio} - {reserva.hora_fin}
              </div>

              <div className="reserva-actions">
                <button
                  className="btn approve"
                  onClick={() =>
                    handleEstado(reserva.id_reserva, 'APROBADA')
                  }
                >
                  Aprobar
                </button>
                <button
                  className="btn reject"
                  onClick={() =>
                    handleEstado(reserva.id_reserva, 'CANCELADA')
                  }
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .admin-card {
          margin-top: 48px;
          background: rgba(20, 20, 20, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 32px;
          color: white;
        }

        .admin-card h2 {
          font-size: 22px;
          margin-bottom: 20px;
        }

        .filtros {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filtros input {
          padding: 8px 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: white;
        }

        .clear {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .clear:hover {
          background: rgba(255,255,255,0.2);
        }

        .empty-text {
          color: rgba(255,255,255,0.5);
        }

        .reservas-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .reserva-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .reserva-info {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
        }

        .reserva-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .approve {
          background: rgba(0, 200, 120, 0.15);
          color: #00d084;
          border: 1px solid rgba(0, 200, 120, 0.3);
        }

        .approve:hover {
          background: rgba(0, 200, 120, 0.25);
        }

        .reject {
          background: rgba(255, 80, 80, 0.15);
          color: #ff4d4d;
          border: 1px solid rgba(255, 80, 80, 0.3);
        }

        .reject:hover {
          background: rgba(255, 80, 80, 0.25);
        }

        .error {
          color: #ff4d4d;
        }

        @media (max-width: 768px) {
          .reserva-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
};