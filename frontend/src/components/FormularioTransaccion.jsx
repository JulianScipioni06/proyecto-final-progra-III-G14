import React, { useState } from 'react';
import api from '../services/api'; 
import '../styles/components/FormularioTransaccion.css';

export default function FormularioTransaccion({ isOpen, onClose, onTransactionAdded }) {
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('gasto');
  const [idCategoria, setIdCategoria] = useState(1);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró una sesión activa.");
        return;
      }

      //Decodificamos el token 
      const payloadCodificado = token.split('.')[1];
      const datosToken = JSON.parse(atob(payloadCodificado));
      const idUsuario = datosToken.uid || datosToken.id || datosToken.id_usuario;

      //Armamos el objeto 
      const nuevaTransaccion = {
        monto: parseFloat(monto),
        tipo: tipo,
        id_usuario: Number(idUsuario),
        id_categoria: parseInt(idCategoria)
      };

      //Petición POST 
      const respuesta = await api.post('/transaccion', nuevaTransaccion, {
        headers: {
          'x-token': token
        }
      });

      if (respuesta.status === 201 || respuesta.status === 200) {
        onTransactionAdded(); 
        setMonto('');
        onClose();
      }
    } catch (err) {
      console.error('Error al guardar la transacción:', err);
      setError('Hubo un problema al guardar. Verificá los datos.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Nueva Transacción</h3>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo de movimiento</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="gasto">Gasto</option>
              <option value="ingreso">Ingreso</option>
            </select>
          </div>

          <div className="form-group">
            <label>Monto</label>
            <input 
              type="number" 
              step="0.01" 
              placeholder="0.00" 
              value={monto} 
              onChange={(e) => setMonto(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)}>
              <option value={1}>Alimentación</option>
              <option value={2}>Transporte</option>
              <option value={3}>Vivienda</option>
              <option value={4}>Entretenimiento</option>
              <option value={5}>Salud</option>
              <option value={6}>Cryptomonedas</option>
            </select>
          </div>

          <div className="modal-buttons">
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-guardar">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}