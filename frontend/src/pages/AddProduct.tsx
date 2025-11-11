// AddProduct.tsx (Modificado)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/addproduct.css'; 

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();

  // --- 1. Estados para guardar los datos del formulario ---
  const [producto, setProducto] = useState('');
  const [codigo, setCodigo] = useState('');
  const [unidad, setUnidad] = useState('');
  const [cantidad, setCantidad] = useState(''); // "Cantidad Agregada" (Stock Inicial)
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    // --- 2. Preparar los datos para enviar (deben coincidir con el Model/Serializer) ---
    // Tu vista 'create_product' espera estos nombres:
    const newProductData = {
      supply_name: producto,
      supply_code: codigo, // Tu API espera solo el número, ej: "1234"
      supply_unit: unidad,
      supply_initial_stock: parseInt(cantidad, 10) // Asegurarse que sea un número
    };

    // --- 3. Obtener el Token de Autenticación ---
    // Tu API está protegida (IsAdminUser). Debes enviar el token.
    // Asumo que lo guardas en localStorage después del login.
    const token = localStorage.getItem('access'); 
    if (!token) {
      setError('Error: No estás autenticado.');
      return;
    }

    // --- 4. Llamar a la API de Django (fetch) ---
    try {
      const response = await fetch('http://localhost:8000/api/inventario/products/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ¡Importante!
        },
        body: JSON.stringify(newProductData),
      });

      if (!response.ok) {
        // Si el backend devuelve un error (ej: 400 Bad Request)
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falló la creación del producto');
      }

      // ¡Éxito!
      console.log('Producto agregado:', await response.json());
      
      // Volver a la lista
      navigate('/inventario');

    } catch (err: any) {
      console.error('Error en handleSubmit:', err);
      setError(err.message);
    }
  };

  const handleBack = () => {
    navigate(-1); // Volver a la página anterior
  };

  return (
    <div className="edit-product-page">
      <h2>Agregar producto</h2>

      <form className="product-form-card" onSubmit={handleSubmit}>
        <div className="form-grid-product-add"> 
          
          {/* --- 5. Conectar los inputs al estado (useState) --- */}
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
              <option value="" disabled>Seleccione la unidad</option>
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

        {/* --- 6. Mostrar errores si los hay --- */}
        {error && (
          <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="button-edit">Crear</button>
          <button type="button" className="button-back" onClick={handleBack}>
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};