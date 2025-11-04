import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importar
import App from './App.tsx'; // Ahora es .tsx

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* Envolver App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);