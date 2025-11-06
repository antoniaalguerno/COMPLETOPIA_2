import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import '../css/newuser.css'; // Crearemos este archivo de estilos

export const NewUser: React.FC = () => {
  // hook para manejar la navegación
  const navigate = useNavigate(); 

  // (Opcional) Puedes usar 'useState' para manejar cada campo
  // const [nombre, setNombre] = useState('');
  // ...etc.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el usuario
    console.log('Formulario enviado');
    // Redirigir de vuelta a la lista de usuarios
    navigate('/usuarios'); 
  };
  
  const handleBack = () => {
    navigate(-1); // Esto es como 'clic en botón atrás' del navegador
  };

  return (
    <div className="new-user-page">
      <h2>Nuevo usuario</h2>

      <form className="user-form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" id="nombre" />
          </div>

          {/* Apellido */}
          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input type="text" id="apellido" />
          </div>

          {/* RUN */}
          <div className="form-group">
            <label htmlFor="run">RUN</label>
            <input type="text" id="run" placeholder="ej: 17805812-2" />
          </div>

          {/* Correo */}
          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input type="email" id="correo" placeholder="correo@example.com" />
          </div>

          {/* Cargo */}
          <div className="form-group">
            <label htmlFor="cargo">Cargo</label>
            <select id="cargo" defaultValue="">
              <option value="" disabled>------</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {/* Contacto */}
          <div className="form-group">
            <label htmlFor="contacto">Número de contacto</label>
            <input type="tel" id="contacto" />
          </div>

          {/* Dirección (ocupa todo el ancho) */}
          <div className="form-group span-2">
            <label htmlFor="direccion">Dirección</label>
            <input type="text" id="direccion" />
          </div>

          {/* Región */}
          <div className="form-group">
            <label htmlFor="region">Región</label>
            <select id="region" defaultValue="">
              <option value="" disabled>Seleccione una región</option>
              {/* Aquí irían las regiones */}
            </select>
          </div>

          {/* Comuna */}
          <div className="form-group">
            <label htmlFor="comuna">Comuna</label>
            <select id="comuna" defaultValue="">
              <option value="" disabled>Seleccione una comuna</option>
              {/* Aquí irían las comunas */}
            </select>
          </div>

          {/* Foto de perfil (ocupa todo el ancho) */}
          <div className="form-group span-2">
            <label htmlFor="foto">Foto de perfil</label>
            <input type="file" id="foto" />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="form-actions">
          <button type="submit" className="button-create">Crear</button>
          <button type="button" className="button-back" onClick={handleBack}>
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};