import { Layout } from './components/layouts/Layout';
import { EditProduct } from './pages/EditInventory';
import { EditUser } from './pages/EditUser';
import { Inventory } from './pages/Inventory';
import { Users } from './pages/Users';
import { DeletedUsers } from './pages/Users_eliminar';

function App() {
  return (
    <Layout>
      {/* Aquí es donde iría el enrutador, pero por ahora... /}
      {/ mostramos la página de Usuarios estáticamente */}
      <EditProduct />

    </Layout>
  );
}

export default App;