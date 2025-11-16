// Inventory.tsx (Modificado)
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MdAdd,
  MdSearch,
  MdEdit,
  MdDelete,
  MdArrowBack
} from 'react-icons/md';
import '../css/Inventory.css';
import '../css/InventoryDashboard.css';

// IMPORTAMOS LAS FUNCIONES Y EL TIPO
import { getInventory, deleteProduct, InventoryItem } from '../api/inventario';

export const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async (query: string = '') => {
    setLoading(true);
    setError(null);

    try {
      const data = await getInventory(query);
      setInventory(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    fetchData(searchQuery);
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      await deleteProduct(productId);

      setInventory((prev) => prev.filter((item) => item.id !== productId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="inventory-page">
      <header className="inventory-page-header">
        <h2>Inventario</h2>
        <Link to="/inventario/nuevo" className="add-item-button">
          <MdAdd />
        </Link>
      </header>

      <nav className="inventory-tabs" style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/inventario"
          className={`tab-item ${
            location.pathname === '/inventario' ? 'active' : ''
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/inventario/listado"
          className={`tab-item ${
            location.pathname === '/inventario/listado' ? 'active' : ''
          }`}
        >
          Listado de inventario
        </Link>
      </nav>

      <div className="content-card">
        <div className="card-toolbar">
          <button
            className="back-button icon-button-large"
            onClick={() => navigate(-1)}
          >
            <MdArrowBack />
          </button>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por Nombre"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>
              <MdSearch />
              Buscar
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center">Cargando productos...</div>
        )}

        {error && (
          <div className="text-center" style={{ color: 'red' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="inventory-list">
            <div className="inventory-list-header">
              <div>Producto</div>
              <div>Codigo</div>
              <div>Unidad</div>
              <div className="text-right">Stock Inicial</div>
              <div className="text-right">Entradas</div>
              <div className="text-right">Salidas</div>
              <div className="text-right">Total</div>
              <div className="text-center">Acciones</div>
            </div>

            {inventory.map((item) => (
              <div className="inventory-list-row" key={item.id}>
                <div>{item.supply_name}</div>
                <div>{item.supply_code}</div>
                <div>{item.supply_unit}</div>
                <div className="text-right">{item.supply_initial_stock}</div>
                <div className="text-right">{item.supply_input}</div>
                <div className="text-right">{item.supply_output}</div>
                <div className="text-right">{item.supply_total}</div>

                <div className="col-actions text-center">
                  <Link
                    to={`/inventario/editar/${item.id}`}
                    className="action-icon"
                  >
                    <MdEdit />
                  </Link>

                  <button
                    className="action-icon delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
