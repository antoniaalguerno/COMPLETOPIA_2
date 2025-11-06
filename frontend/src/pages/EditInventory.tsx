import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/editinventory.css'; // Crearemos este archivo

export const EditProduct: React.FC = () => {
    const navigate = useNavigate();
    // Leemos el ID del producto de la URL, ej: .../editar/1
    const { productId } = useParams<{ productId: string }>();

    // --- DATOS ESTÁTICOS ---
    // En un futuro, usarías el 'productId' para cargar estos datos
    const staticData = {
        producto: 'pan',
        codigo: 'SKU1234',
        unidad: 'kg',
        stock: 20,
        entradas: 0,
        salidas: 0,
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica para guardar los cambios
        console.log('Producto editado', { productId });
        // Volver a la lista
        navigate('/inventario');
    };

    const handleBack = () => {
        navigate(-1); // Volver a la página anterior
    };

    return (
        <div className="edit-product-page">
            <h2>Editar Producto</h2>

            <form className="product-form-card" onSubmit={handleSubmit}>
                {/* Usamos un grid de 6 columnas para alinear 
          los campos como en la imagen.
        */}
                <div className="form-grid-product">
                    {/* Fila 1 */}
                    <div className="form-group span-3">
                        <label htmlFor="producto">Producto</label>
                        <input
                            type="text"
                            id="producto"
                            defaultValue={staticData.producto}
                        />
                    </div>
                    <div className="form-group span-2">
                        <label htmlFor="codigo">Código</label>
                        <input
                            type="text"
                            id="codigo"
                            defaultValue={staticData.codigo}
                            readOnly // El código/SKU no debería ser editable
                        />
                    </div>
                    <div className="form-group span-1">
                        <label htmlFor="unidad">Unidad</label>
                        <select id="unidad" defaultValue={staticData.unidad}>
                            <option value="kg">kg</option>
                            <option value="un">un</option>
                            <option value="l">l</option>
                        </select>
                    </div>

                    {/* Fila 2 */}
                    <div className="form-group span-2">
                        <label htmlFor="stock">Stock Inicial</label>
                        <input
                            type="number"
                            id="stock"
                            defaultValue={staticData.stock}
                        />
                    </div>
                    <div className="form-group span-2">
                        <label htmlFor="entradas">Entradas</label>
                        <input
                            type="number"
                            id="entradas"
                            defaultValue={staticData.entradas}
                        />
                    </div>
                    <div className="form-group span-2">
                        <label htmlFor="salidas">Salidas</label>
                        <input
                            type="number"
                            id="salidas"
                            defaultValue={staticData.salidas}
                        />
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="form-actions">
                    <button type="submit" className="button-edit">Editar</button>
                    <button type="button" className="button-back" onClick={handleBack}>
                        Volver
                    </button>
                </div>
            </form>
        </div>
    );
};