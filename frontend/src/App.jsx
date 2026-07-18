import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 

function App() {
  const [estaLogueado, setEstaLogueado] = useState(false);

  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setEstaLogueado(false);
  };

  return (
    <div>
      {!estaLogueado ? (
        <Login onLoginExitoso={() => setEstaLogueado(true)} />
      ) : (
        <Dashboard onLogout={cerrarSesion} />
      )}
    </div>
  );
}

export default App;