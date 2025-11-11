// EditInventory.tsx (Modificado)

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/editinventory.css';

type ProductData = {
    supply_name: string;
    supply_code: string;
    supply_unit: string;
    supply_initial_stock: string | number;
    supply_input: string | number;
    supply_output: string | number;
};

export const EditProduct: React.FC = () => {
    const navigate = useNavigate();
    const { productId } = useParams<{ productId: string }>();

    const [formData, setFormData] = useState<ProductData>({
        supply_name: '',
        supply_code: '',
        supply_unit: 'kg',
        supply_initial_stock: 0,
        supply_input: 0,
        supply_output: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('access');

            if (!token || !productId) {
                setError('Error: No autenticado o ID de producto no encontrado.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8000/api/inventario/products/${productId}/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('No se pudo cargar el producto');
                }

                const data = await response.json();

                setFormData({
                    supply_name: data.supply_name,
                    supply_code: data.supply_code_numeric,
                    supply_unit: data.supply_unit,
                    supply_initial_stock: data.supply_initial_stock,
                    supply_input: data.supply_input,
                    supply_output: data.supply_output,
                });

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const token = localStorage.getItem('access');
        if (!token) {
            setError('Error: No estás autenticado.');
            return;
        }

        const dataToSubmit = {
            ...formData,
            supply_initial_stock: parseInt(String(formData.supply_initial_stock), 10),
            supply_input: parseInt(String(formData.supply_input), 10),
            supply_output: parseInt(String(formData.supply_output), 10),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/inventario/products/${productId}/update/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSubmit)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || errData.error || 'Falló la actualización');
            }

            await response.json();
            navigate('/inventario/listado');

        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className="edit-product-page">Cargando producto...</div>;
    }

    if (error) {
        return <div className="edit-product-page" style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className="edit-product-page">
            <h2>Editar Producto</h2>

            <form className="product-form-card" onSubmit={handleSubmit}>
                <div className="form-grid-product">

                    <div className="form-group span-3">
                        <label htmlFor="supply_name">Producto</label>
                        <input
                            type="text"
                            id="supply_name"
                            value={formData.supply_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group span-2">
                        <label htmlFor="supply_code">Código (solo números)</label>
                        <input
                            type="text"
                            id="supply_code"
                            value={formData.supply_code}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group span-1">
                        <label htmlFor="supply_unit">Unidad</label>
                        <select
                            id="supply_unit"
                            value={formData.supply_unit}
                            onChange={handleChange}
                        >
                            <option value="kg">kg</option>
                            <option value="LATA (330 ml)">LATA (330 ml)</option>
                        </select>
                    </div>

                    <div className="form-group span-2">
                        <label htmlFor="supply_initial_stock">Stock Inicial</label>
                        <input
                            type="number"
                            id="supply_initial_stock"
                            value={formData.supply_initial_stock}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group span-2">
                        <label htmlFor="supply_input">Entradas</label>
                        <input
                            type="number"
                            id="supply_input"
                            value={formData.supply_input}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group span-2">
                        <label htmlFor="supply_output">Salidas</label>
                        <input
                            type="number"
                            id="supply_output"
                            value={formData.supply_output}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                {error && (
                    <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

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
