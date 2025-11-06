import React from 'react';
import { useNavigate } from 'react-router-dom';
// Reutilizaremos el CSS de EditProduct, ya que es muy similar
import '../css/addproduct.css'; 

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para guardar el nuevo producto
    console.log('Producto agregado');
    // Volver a la lista
    navigate('/inventario');
  };

  const handleBack = () => {
    navigate(-1); // Volver a la página anterior
  };

  return (
    <div className="edit-product-page"> {/* Reutilizamos la clase principal */}
      <h2>Agregar producto</h2>

      <form className="product-form-card" onSubmit={handleSubmit}>
        {/* Usamos un grid de 2 columnas (1fr 1fr) */}
        <div className="form-grid-product-add"> 
          {/* Fila 1 */}
          <div className="form-group">
            <label htmlFor="producto">Producto</label>
            <input 
              type="text" 
              id="producto" 
              placeholder="Nombre Producto" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="codigo">Código</label>
            <input 
              type="text" 
              id="codigo" 
              placeholder="SKUXXXX" 
            />
          </div>

          {/* Fila 2 */}
          <div className="form-group">
            <label htmlFor="unidad">Unidad</label>
            <select id="unidad" defaultValue="">
              <option value="" disabled>Seleccione la unidad</option>
              <option value="kg">kg</option>
              <option value="lata">LATA (330 ml)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="cantidad">Cantidad Agregada</label>
            <input 
              type="number" 
              id="cantidad" 
              placeholder="Cantidad"
            />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="form-actions">
          {/* Reutilizamos los estilos de 'button-edit' y 'button-back' */}
          <button type="submit" className="button-edit">Crear</button>
          <button type="button" className="button-back" onClick={handleBack}>
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};