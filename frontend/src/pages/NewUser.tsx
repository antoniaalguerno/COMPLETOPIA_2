import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/newuser.css';

export const NewUser: React.FC = () => {
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    run: '',
    email: '',
    cargo: '',
    mobile: '',
    phone: '',
    direccion: '',
    region: '',
    comuna: '',
    password: '', // puedes agregarlo si el backend lo pide
  });

  const [loading, setLoading] = useState(false);

  // Manejo de cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Enviar formulario al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access'); // JWT del login

      const response = await fetch('http://127.0.0.1:8000/api/administrator/users/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Autenticación
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password || '123456', // opcional
          mobile: formData.mobile,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Usuario creado correctamente');
        navigate('/usuarios'); // volver al listado
      } else {
        alert(`❌ Error: ${data.error || 'No se pudo crear el usuario'}`);
      }
    } catch (error) {
      console.error('Error creando usuario:', error);
      alert('❌ Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="new-user-page">
      <h2>Nuevo usuario</h2>

      <form className="user-form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="first_name">Nombre</label>
            <input type="text" id="first_name" value={formData.first_name} onChange={handleChange} required />
          </div>

          {/* Apellido */}
          <div className="form-group">
            <label htmlFor="last_name">Apellido</label>
            <input type="text" id="last_name" value={formData.last_name} onChange={handleChange} required />
          </div>

          {/* RUN */}
          <div className="form-group">
            <label htmlFor="run">RUN</label>
            <input type="text" id="run" placeholder="ej: 17805812-2" value={formData.run} onChange={handleChange} />
          </div>

          {/* Correo */}
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" id="email" placeholder="correo@example.com" value={formData.email} onChange={handleChange} required />
          </div>

          {/* Cargo */}
          <div className="form-group">
            <label htmlFor="cargo">Cargo</label>
            <select id="cargo" value={formData.cargo} onChange={handleChange}>
              <option value="" disabled>------</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {/* Contacto */}
          <div className="form-group">
            <label htmlFor="mobile">Número de contacto</label>
            <input type="tel" id="mobile" value={formData.mobile} onChange={handleChange} />
          </div>

          {/* Dirección */}
          <div className="form-group span-2">
            <label htmlFor="direccion">Dirección</label>
            <input type="text" id="direccion" value={formData.direccion} onChange={handleChange} />
          </div>

          {/* Región */}
          <div className="form-group">
            <label htmlFor="region">Región</label>
            <select id="region" value={formData.region} onChange={handleChange}>
              <option value="" disabled>Seleccione una región</option>
              {/* Puedes llenar esto dinámicamente */}
            </select>
          </div>

          {/* Comuna */}
          <div className="form-group">
            <label htmlFor="comuna">Comuna</label>
            <select id="comuna" value={formData.comuna} onChange={handleChange}>
              <option value="" disabled>Seleccione una comuna</option>
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button type="submit" className="button-create" disabled={loading}>
            {loading ? 'Creando...' : 'Crear'}
          </button>
          <button type="button" className="button-back" onClick={handleBack}>
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};
