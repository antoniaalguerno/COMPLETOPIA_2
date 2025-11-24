import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../css/edituser.css';
import { buildRegionOptions, buildCommuneOptions } from '../data/todochile';
import { getUser, updateUser } from '../api/admin';

interface UserData {
  first_name: string;
  last_name: string;
  rut: string;
  email: string;
  group: string;
  mobile: string;
  direccion: string;
  region: string;
  comuna: string;
  profile_image: File | null;
}

export const EditUser: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserData>({
    first_name: '',
    last_name: '',
    rut: '',
    email: '',
    group: '1',
    mobile: '',
    direccion: '',
    region: '',
    comuna: '',
    profile_image: null,
  });

  const [comunasOptions, setComunasOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const data = await getUser(userId);

        setUserData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          rut: data.rut || '',
          email: data.email || '',
          group: data.group_id?.toString() || '1',
          mobile: data.mobile || '',
          direccion: data.address || '',
          region: data.region || '',
          comuna: data.comuna || '',
          profile_image: null,
        });

        if (data.region) {
          setComunasOptions(buildCommuneOptions(data.region));
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        alert('No se pudo cargar la información del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    setUserData((prev) => ({
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
    setUserData((prev) => ({ ...prev, profile_image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const formData = new FormData();
    formData.append('first_name', userData.first_name);
    formData.append('last_name', userData.last_name);
    formData.append('email', userData.email);
    formData.append('username', userData.email);
    formData.append('group', userData.group);
    formData.append('mobile', userData.mobile);
    formData.append('direccion', userData.direccion);
    formData.append('region', userData.region);
    formData.append('comuna', userData.comuna);
    if (userData.profile_image) formData.append('profile_image', userData.profile_image);

    try {
      await updateUser(userId, formData);
      alert('Usuario actualizado correctamente ✅');
      navigate('/usuarios');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert('Error al actualizar usuario ❌');
    }
  };

  if (loading) return <p>Cargando usuario...</p>;

  return (
    <div className="edit-user-page">
      <h2>Editar Usuario</h2>

      <form className="user-form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="first_name">Nombre</label>
            <input
              type="text"
              id="first_name"
              value={userData.first_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Apellido</label>
            <input
              type="text"
              id="last_name"
              value={userData.last_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="rut">RUT</label>
            <input type="text" id="rut" value={userData.rut} readOnly />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" id="email" value={userData.email} readOnly />
          </div>

          <div className="form-group">
            <label htmlFor="group">Cargo</label>
            <select id="group" value={userData.group} onChange={handleInputChange}>
              <option value="1">Administrador</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Teléfono</label>
            <input
              type="tel"
              id="mobile"
              value={userData.mobile}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group span-2">
            <label htmlFor="direccion">Dirección</label>
            <input
              type="text"
              id="direccion"
              value={userData.direccion}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="region">Región</label>
            <select id="region" value={userData.region} onChange={handleInputChange}>
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
            <select id="comuna" value={userData.comuna} onChange={handleInputChange}>
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
            <label htmlFor="profile_image">Foto de perfil</label>
            <input type="file" id="profile_image" onChange={handleFileChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="button-create">
            Guardar Cambios
          </button>
          <button type="button" className="button-back" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};
