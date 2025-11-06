import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layouts/Layout'
import { Login } from './pages/LoginPage';
import { Home } from './pages/Home';
import { Users } from './pages/Users';
import { NewUser } from './pages/NewUser';
import { UserDetails } from './pages/UserDetails';
import { DeletedUsers } from './pages/Users_eliminar';
import { InventoryDashboard } from './pages/InventoryDashboard';
import { Inventory } from './pages/Inventory';
import { AddProduct } from './pages/AddProduct';
import { EditProduct } from './pages/EditInventory';
import { EditUser } from './pages/EditUser';
import { PasswordChanged } from './pages/PasswordChanged';
import { ChangePassword } from './components/layouts/ChangePassword';
import { ForgotPassword } from './components/layouts/ForgotPassword';
import { ResetPassword } from './components/layouts/ResetPassword';

function App() {
  return (
    <Routes>
      {/* RUTA PÚBLICA: Login (sin barra lateral ni cabecera) */}
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-contrasena" element={<ForgotPassword />} />

      {/* Nueva ruta para el enlace del correo */}
      {/* En producción, probablemente usarías algo como "/restablecer-contrasena/:token" */}
      <Route path="/restablecer-contrasena" element={<ResetPassword />} />

      <Route path="/contrasena-actualizada" element={<PasswordChanged />} />

      {/* RUTAS PRIVADAS: Usan el Layout (con barra lateral y cabecera) */}
      <Route element={<Layout />}>
        {/* Ruta de Inicio */}
        <Route path="/inicio" element={<Home />} />

        {/* Rutas de Usuarios */}
        <Route path="/usuarios" element={<Users />} />
        <Route path="/usuarios/nuevo" element={<NewUser />} />
        <Route path="/usuarios/:userId" element={<UserDetails />} />
        <Route path="/usuarios/eliminados" element={<DeletedUsers />} />
        <Route path="/usuarios/editar/:userId" element={<EditUser />} />
        <Route path="/cambiar-contrasena" element={<ChangePassword />} />

       {/* Rutas de Inventario */}
        <Route path="/inventario" element={<InventoryDashboard />} />      {/* Dashboard de Alertas */}
        <Route path="/inventario/listado" element={<Inventory />} />       {/* Tabla completa */}
        <Route path="/inventario/nuevo" element={<AddProduct />} />
        <Route path="/inventario/editar/:productId" element={<EditProduct />} />

        {/* Redirección por defecto a Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
