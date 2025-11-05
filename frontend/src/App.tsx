import { Layout } from './components/layouts/Layout';
import { Users } from './pages/Users';
import { DeletedUsers } from './pages/Users_eliminar';

function App() {
  return (
    <Layout>
      {/* Aquí es donde iría el enrutador, pero por ahora... /}
      {/ mostramos la página de Usuarios estáticamente */}
      <DeletedUsers />

    </Layout>
  );
}

export default App;