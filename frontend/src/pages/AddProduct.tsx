// AddProduct.tsx (Modificado)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/addproduct.css';
import { createProduct } from '../api/inventario';

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();

  const [producto, setProducto] = useState('');
  const [codigo, setCodigo] = useState('');
  const [unidad, setUnidad] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const newProductData = {
      supply_name: producto,
      supply_code: codigo,
      supply_unit: unidad,
      supply_initial_stock: parseInt(cantidad, 10)
    };

    try {
      await createProduct(newProductData);
      console.log('Producto agregado');
      navigate('/inventario');
    } catch (err: any) {
      console.error('Error en handleSubmit:', err);
      setError(err.message || 'Falló la creación del producto');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="edit-product-page">
      <h2>Agregar producto</h2>

      <form className="product-form-card" onSubmit={handleSubmit}>
        <div className="form-grid-product-add">
          <div className="form-group">
            <label htmlFor="producto">Producto</label>
            <input
              type="text"
              id="producto"
              placeholder="Nombre Producto"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="codigo">Código (solo números)</label>
            <input
              type="text"
              id="codigo"
              placeholder="Ej: 1234"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="unidad">Unidad</label>
            <select
              id="unidad"
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              required
            >
              <option value="" disabled>
                Seleccione la unidad
              </option>
              <option value="kg">kg</option>
              <option value="LATA (330 ml)">LATA (330 ml)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cantidad">Cantidad Agregada (Stock Inicial)</label>
            <input
              type="number"
              id="cantidad"
              placeholder="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              color: 'red',
              marginTop: '10px',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="button-edit">
            Crear
          </button>
          <button type="button" className="button-back" onClick={handleBack}>
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};
