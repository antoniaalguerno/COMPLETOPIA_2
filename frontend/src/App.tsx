import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layouts/Layout';
import { AddProduct } from './pages/AddProduct';
import { NewUser } from './pages/NewUser';
import { UserDetails } from './pages/UserDetails';
import { Users } from './pages/Users';
// 1. IMPORTA LA NUEVA PÁGINA
import { DeletedUsers } from './pages/Users_eliminar'; 

function App() {
  return (
    <Layout>
      <Routes>
        
        {/* Rutas de Usuarios */}
        <Route path="/usuarios" element={<Users />} />
        <Route path="/usuarios/nuevo" element={<NewUser />} />
        <Route path="/usuarios/:userId" element={<UserDetails />} />
        
        {/* 2. AÑADE LA NUEVA RUTA */}
        <Route path="/usuarios/eliminados" element={<DeletedUsers />} />

        {/* Rutas de Inventario */}
        <Route path="/inventario/agregar" element={<AddProduct />} />
        
        {/* Redirige la raíz "/" a "/usuarios" */}
        <Route path="/" element={<Navigate to="/usuarios" replace />} />

      </Routes>
    </Layout>
  );
}

export default App;