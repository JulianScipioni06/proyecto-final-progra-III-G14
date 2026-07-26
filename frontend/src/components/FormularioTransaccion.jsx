import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import '../styles/components/FormularioTransaccion.css';

export default function FormularioTransaccion({ isOpen, onClose, onTransactionAdded, transaccionAEditar }) {
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('gasto');
  const [idCategoria, setIdCategoria] = useState(1);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [descripcion, setDescripcion] = useState("")

  useEffect(() => {
    if (isOpen) {
      const cargarCategorias = async () => {
        try {
          const token = localStorage.getItem("token");
          const respuesta = await api.get('/categorias', {
            headers: { 'x-token': token }
          });
          
          setCategorias(respuesta.data);
          
          if (respuesta.data.length > 0) {
            setIdCategoria(respuesta.data[0].id_categoria);
          }
        } catch (error) {
          console.error("Error al cargar las categorías:", error);
          setError("No se pudieron cargar las categorías.");
        }
      };

      cargarCategorias();
    }
  }, [isOpen]);

  useEffect(() =>{
    if (transaccionAEditar){
      //Rellenamos si hay datos para editar
      setMonto(transaccionAEditar.monto);
      setTipo(transaccionAEditar.tipo);
      setDescripcion(transaccionAEditar.descripcion);
      setIdCategoria(transaccionAEditar.id_categoria);
    }else{
      //Si es nulo lo vaciamos todo
      setMonto('');
      setTipo('gasto');
      setDescripcion('');
    }
  }, [transaccionAEditar, isOpen]);

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
        descripcion: descripcion,
        id_usuario: Number(idUsuario),
        id_categoria: parseInt(idCategoria)
      };

      let respuesta;

      if (transaccionAEditar){

        respuesta = await api.put(`/transacciones/${transaccionAEditar.id_transaccion}`, nuevaTransaccion ,{
          headers: {'x-token': token}
        });
      }else{
        respuesta = await api.post('/transacciones', nuevaTransaccion,{
          headers: {'x-token': token}
        });
      }

      if (respuesta.status === 201 || respuesta.status === 200) {
        onTransactionAdded(); 
        setMonto('');
        setDescripcion('')
        onClose();
      }
    } catch (err) {
      console.error('Error al guardar la transacción:', err);
      
      // Capturamos cualquier formato de error que venga del backend
      const mensajeError = 
        err.response?.data?.errores?.join(', ') || // Si frenó en el middleware
        err.response?.data?.error ||               // Si frenó en el catch del controlador
        err.response?.data?.msg ||                 // Si mandamos un mensaje con 'msg'
        'Hubo un problema de conexión con el servidor.';
        
      setError(mensajeError);
    }
  };

  return (
    <div className="modal-overlay modal-prioritario">
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
            <label>Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Compra de supermercado"
            />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)} required>
              {categorias.length === 0 ? (
                <option value="">Cargando categorías...</option>
              ) : (
                categorias.map((cat) => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre_categoria}
                  </option>
                ))
              )}
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