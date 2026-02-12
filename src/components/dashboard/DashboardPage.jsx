import { Navbar } from '../navbar/Navbar';
import { IncidenciasAdmin } from '../incidencias/IncidenciasAdmin';
import { ReservasAdmin } from '../reservas/ReservasAdmin';
import './DashboardPage.css';

export const DashboardPage = () => {

  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-header fade-in">
          <div>
            <h1>Bienvenido de nuevo</h1>
            <p>Aquí está un resumen de tu plataforma</p>
          </div>
        </div>

        <div className="stats-grid">
          {/* {stats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} index={index} />
          ))} */}
        </div>

        <div className="content-grid fade-in-delay">
          <div className="content-card">
            <h2>Panel Administrativo</h2>
            <p>
              Aquí puedes agregar el contenido específico de tu aplicación:
            </p>
            <ul>
              <li>Gestión de usuarios</li>
              <li>Configuración del sistema</li>
              <li>Reportes y análisis</li>
              <li>Control de accesos</li>
            </ul>
          </div>
          <IncidenciasAdmin />
          <ReservasAdmin />
        </div>
      </main>
    </div>
  );
};