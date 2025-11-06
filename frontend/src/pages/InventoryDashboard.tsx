import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineWarningAmber } from 'react-icons/md';
import '../css/InventoryDashboard.css';

export const InventoryDashboard: React.FC = () => {
  const location = useLocation();

  // Función simple para saber si estamos en la raíz del dashboard
  const isDashboardActive = location.pathname === '/inventario';

  const inventoryAlerts = [
    { product: 'pan', code: 'SKU1234', unit: 'kg', stockActual: 1, alarmLevel: 5, status: '¡Stock bajo!' },
    // ... más datos ...
  ];

  return (
    <div className="inventory-dashboard-container">
      <h1>Inventario</h1>

      {/* Navegación de Pestañas */}
      <nav className="inventory-tabs">
        {/* Pestaña Dashboard (Activa si estamos en /inventario) */}
        <Link 
          to="/inventario" 
          className={`tab-item ${isDashboardActive ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        
        {/* Pestaña Listado (Lleva a la otra pantalla) */}
        <Link 
          to="/inventario/listado" 
          className={`tab-item ${location.pathname === '/inventario/listado' ? 'active' : ''}`}
        >
          Listado de inventario
        </Link>
      </nav>

      {/* CONTENIDO DEL DASHBOARD (Solo se ve en /inventario) */}
      {isDashboardActive && (
        <div className="alert-card">
          <h2 className="alert-card-title">Alerta Inventario</h2>
          {/* ... (Tu tabla de alertas igual que antes) ... */}
          <div className="alert-table-wrapper">
            <table className="alert-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Código</th>
                  <th>Unidad</th>
                  <th>Stock Actual</th>
                  <th>Alarma Establecida</th>
                </tr>
              </thead>
              <tbody>
                {inventoryAlerts.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product}</td>
                    <td>{item.code}</td>
                    <td>{item.unit}</td>
                    <td>{item.stockActual}</td>
                    <td className="stock-alert-cell">
                      <MdOutlineWarningAmber className="alert-icon" />
                      <span className="alert-text">{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* YA NO USAMOS <Outlet /> AQUÍ */}
    </div>
  );
};