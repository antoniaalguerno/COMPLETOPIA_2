import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/newuser.css';
import { buildRegionOptions, buildCommuneOptions } from '../data/todochile';
import { createUser } from '../api/admin'; // <-- IMPORTAMOS LA FUNCIÓN

export const NewUser: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    run: '',
    email: '',
    group: '1', // id del grupo
    mobile: '',
    direccion: '',
    region: '',
    comuna: '',
    password: '12345678',
    profile_image: null as File | null,
  });

  const [comunasOptions, setComunasOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.region) {
      setComunasOptions(buildCommuneOptions(formData.region));
    } else {
      setComunasOptions([]);
    }
  }, [formData.region]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
      ...(id === 'region' ? { comuna: '' } : {}),
    }));

    if (id === 'region') {
      setComunasOptions(buildCommuneOptions(value));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({ ...formData, profile_image: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('email', formData.email);
      data.append('username', formData.email);
      data.append('password', formData.password);
      data.append('group', formData.group);
      data.append('run', formData.run);
      data.append('mobile', formData.mobile);
      data.append('direccion', formData.direccion);
      data.append('region', formData.region);
      data.append('comuna', formData.comuna);
      if (formData.profile_image) data.append('profile_image', formData.profile_image);

      await createUser(data);

      alert('✅ Usuario creado correctamente');
      navigate('/usuarios');
    } catch (error: any) {
      console.error('Error creando usuario:', error);
      const errorMsg = error.response?.data?.error || 'No se pudo crear el usuario';
      alert(`❌ Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="new-user-page">
      <h2>Nuevo usuario</h2>

      <form className="user-form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="first_name">Nombre</label>
            <input
              type="text"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Apellido</label>
            <input
              type="text"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="run">RUN</label>
            <input
              type="text"
              id="run"
              value={formData.run}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="group">Cargo</label>
            <select id="group" value={formData.group} onChange={handleChange}>
              <option value="1">Administrador</option>
              <option value="2">Vendedor</option>
              <option value="3">Bodeguero</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Teléfono</label>
            <input
              type="tel"
              id="mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          <div className="form-group span-2">
            <label htmlFor="direccion">Dirección</label>
            <input
              type="text"
              id="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="region">Región</label>
            <select id="region" value={formData.region} onChange={handleChange}>
              <option value="" disabled>
                Seleccione una región
              </option>
              {buildRegionOptions().map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="comuna">Comuna</label>
            <select id="comuna" value={formData.comuna} onChange={handleChange}>
              <option value="" disabled>
                Seleccione una comuna
              </option>
              {comunasOptions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group span-2">
            <label htmlFor="foto">Foto</label>
            <input type="file" id="profile_image" onChange={handleFileChange} />
          </div>
        </div>

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
