import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layouts/Layout';
import { AddProduct } from './pages/AddProduct';
import { NewUser } from './pages/NewUser';
import { UserDetails } from './pages/UserDetails';
import { Users } from './pages/Users';
import { Login } from './pages/LoginPage';
import { DeletedUsers } from './pages/Users_eliminar';

function App() {
  return (
    <Routes>
      {/* Ruta pública (sin Layout) */}
      <Route path="/" element={<Login />} />

      {/* Rutas privadas (con Layout) */}
      <Route
        path="/usuarios/*"
        element={
          <Layout>
            <Routes>
              <Route path="" element={<Users />} />
              <Route path="nuevo" element={<NewUser />} />
              <Route path=":userId" element={<UserDetails />} />
              <Route path="eliminados" element={<DeletedUsers />} />
            </Routes>
          </Layout>
        }
      />

      <Route
        path="/inventario/agregar"
        element={
          <Layout>
            <AddProduct />
          </Layout>
        }
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
