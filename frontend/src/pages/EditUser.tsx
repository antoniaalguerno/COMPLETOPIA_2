import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import '../css/edituser.css'; // Cambiamos el archivo de estilos a edituser.css

export const EditUser: React.FC = () => {
    // Hook para manejar la navegación
    const navigate = useNavigate();

    // Estado inicial con los datos del usuario (simulados)
    const [userData, setUserData] = useState({
        nombre: 'Karen',
        apellido: 'Cordova',
        run: '17805812-2',
        correo: 'karen.cordova@cloud.uautonoma.cl',
        cargo: 'admin',
        contacto: '987654321',
        direccion: 'Calle Falsa 123',
        region: 'Metropolitana',
        comuna: 'Santiago',
        foto: null,
    });

    // Manejo del envío del formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica
        if (!userData.nombre || !userData.apellido || !userData.cargo) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        // Aquí iría la lógica para guardar los cambios del usuario
        console.log('Datos actualizados:', userData);

        // Redirigir de vuelta a la lista de usuarios
        navigate('/usuarios');
    };

    // Manejo del botón "Volver"
    const handleBack = () => {
        navigate(-1); // Esto es como 'clic en botón atrás' del navegador
    };

    // Manejo de cambios en los campos del formulario
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    // Manejo de la selección de una nueva foto
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setUserData((prevData) => ({
            ...prevData,
            foto: file || prevData.foto, // Mantén la foto existente si no se selecciona una nueva
        }));
    };

    return (
        <div className="edit-user-page">
            <h2>Editar Usuario</h2>

            <form className="user-form-card" onSubmit={handleSubmit}>
                <div className="form-grid">
                    {/* Nombre */}
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            value={userData.nombre}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Apellido */}
                    <div className="form-group">
                        <label htmlFor="apellido">Apellido</label>
                        <input
                            type="text"
                            id="apellido"
                            value={userData.apellido}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* RUN (solo lectura) */}
                    <div className="form-group">
                        <label htmlFor="run">RUN</label>
                        <input
                            type="text"
                            id="run"
                            value={userData.run}
                            readOnly
                        />
                    </div>

                    {/* Correo (solo lectura) */}
                    <div className="form-group">
                        <label htmlFor="correo">Correo electrónico</label>
                        <input
                            type="email"
                            id="correo"
                            value={userData.correo}
                            readOnly
                        />
                    </div>

                    {/* Cargo */}
                    <div className="form-group">
                        <label htmlFor="cargo">Cargo</label>
                        <select
                            id="cargo"
                            value={userData.cargo}
                            onChange={handleInputChange}
                        >
                            <option value="" disabled>------</option>
                            <option value="admin">Administrador</option>
                            <option value="vendedor">Vendedor</option>
                            <option value="bodeguero">Bodeguero</option>
                        </select>
                    </div>

                    {/* Contacto */}
                    <div className="form-group">
                        <label htmlFor="contacto">Número de contacto</label>
                        <input
                            type="tel"
                            id="contacto"
                            value={userData.contacto}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Dirección (ocupa todo el ancho) */}
                    <div className="form-group span-2">
                        <label htmlFor="direccion">Dirección</label>
                        <input
                            type="text"
                            id="direccion"
                            value={userData.direccion}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Región */}
                    <div className="form-group">
                        <label htmlFor="region">Región</label>
                        <select
                            id="region"
                            value={userData.region}
                            onChange={handleInputChange}
                        >
                            <option value="" disabled>Seleccione una región</option>
                            <option value="Metropolitana">Metropolitana</option>
                            <option value="Valparaíso">Valparaíso</option>
                            {/* Agrega más regiones aquí */}
                        </select>
                    </div>

                    {/* Comuna */}
                    <div className="form-group">
                        <label htmlFor="comuna">Comuna</label>
                        <select
                            id="comuna"
                            value={userData.comuna}
                            onChange={handleInputChange}
                        >
                            <option value="" disabled>Seleccione una comuna</option>
                            <option value="Santiago">Santiago</option>
                            <option value="Providencia">Providencia</option>
                            {/* Agrega más comunas aquí */}
                        </select>
                    </div>

                    {/* Foto de perfil (ocupa todo el ancho) */}
                    <div className="form-group span-2">
                        <label htmlFor="foto">Foto de perfil</label>
                        <input
                            type="file"
                            id="foto"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="form-actions">
                    <button type="submit" className="button-create">Guardar Cambios</button>
                    <button type="button" className="button-back" onClick={handleBack}>
                        Volver
                    </button>
                </div>
            </form>
        </div>
    );
};
