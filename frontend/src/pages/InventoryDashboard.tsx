// InventoryDashboard.tsx (Modificado)

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineWarningAmber } from 'react-icons/md';
import '../css/InventoryDashboard.css';

type LowStockProduct = {
    id: number;
    supply_name: string;
    supply_code: string;
    supply_unit: string;
    supply_total: number;
};

export const InventoryDashboard: React.FC = () => {
    const location = useLocation();
    const isDashboardActive = location.pathname === '/inventario';

    const [lowStockItems, setLowStockItems] = useState<LowStockProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isDashboardActive) {
            const fetchLowStockData = async () => {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem('access');
                if (!token) {
                    setError('No estás autenticado.');
                    setLoading(false);
                    return;
                }

                try {
                    const response = await fetch('http://localhost:8000/api/inventario/low-stock/', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.detail || 'Error al cargar las alertas');
                    }

                    const data: LowStockProduct[] = await response.json();
                    setLowStockItems(data);

                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchLowStockData();
        }
    }, [isDashboardActive]);

    return (
        <div className="inventory-dashboard-container">
            <h1>Inventario</h1>

            <nav className="inventory-tabs">
                <Link
                    to="/inventario"
                    className={`tab-item ${isDashboardActive ? 'active' : ''}`}
                >
                    Dashboard
                </Link>
                <Link
                    to="/inventario/listado"
                    className={`tab-item ${location.pathname === '/inventario/listado' ? 'active' : ''}`}
                >
                    Listado de inventario
                </Link>
            </nav>

            {isDashboardActive && (
                <div className="alert-card">
                    <h2 className="alert-card-title">Alerta Inventario</h2>

                    <div className="alert-table-wrapper">
                        {loading && <div className="text-center">Cargando alertas...</div>}
                        {error && <div className="text-center" style={{ color: 'red' }}>{error}</div>}

                        {!loading && !error && (
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
                                    {lowStockItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.supply_name}</td>
                                            <td>{item.supply_code}</td>
                                            <td>{item.supply_unit}</td>
                                            <td>{item.supply_total}</td>
                                            <td className="stock-alert-cell">
                                                <MdOutlineWarningAmber className="alert-icon" />
                                                <span className="alert-text">¡Stock bajo!</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {!loading && !error && lowStockItems.length === 0 && (
                            <div className="text-center" style={{ padding: '20px' }}>
                                No hay productos con bajo stock.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
