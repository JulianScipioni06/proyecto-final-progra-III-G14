import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../services/api';
import '../styles/components/ModalConfiguracion.css';

export default function ModalConfiguracion({ onCerrar }) {
    const [pestañaActiva, setPestañaActiva] = useState('perfil');
    const [verContraseña, setVerContraseña] = useState(false);

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [mensajePerfil, setMensajePerfil] = useState('');

    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState(false);

    const token = localStorage.getItem('token');

    const obtenerIdUsuario = () => {
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id_usuario || payload.id || payload.uid;
    };

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const idUsuario = obtenerIdUsuario();

                const respCategorias = await api.get('/categorias', {
                    headers: { 'x-token': token }
                });
                setCategorias(respCategorias.data);

                const respUsuario = await api.get(`/usuarios/${idUsuario}`, {
                    headers: { 'x-token': token }
                });
                setNombre(respUsuario.data.nombre);
                setEmail(respUsuario.data.email);

            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };
        obtenerDatos();
    }, []);

    const guardarPerfil = async () => {
        try {
            const idUsuario = obtenerIdUsuario();
            const body = {};
            if (nombre) body.nombre = nombre;
            if (email) body.email = email;
            if (contraseña) body.contrasena = contraseña;

            await api.put(`/usuarios/${idUsuario}`, body, {
                headers: { 'x-token': token }
            });
            setMensajePerfil('Cambios guardados con exito.');
            setContraseña('');
        } catch (error) {
            setMensajePerfil('Error al guardar los cambios.');
            console.error(error);
        }
    };

    const agregarCategoria = async () => {
        if (!nuevaCategoria.trim()) return;
        try {
            const respuesta = await api.post('/categorias',
                { nombre_categoria: nuevaCategoria.trim() },
                { headers: { 'x-token': token } }
            );
            setCategorias([...categorias, respuesta.data]);
            setNuevaCategoria('');
        } catch (error) {
            console.error('Error al crear categoria:', error);
        }
    };

    const eliminarCategoria = async (id) => {
        try {
            await api.delete(`/categorias/${id}`, {
                headers: { 'x-token': token }
            });
            setCategorias(categorias.filter(c => c.id_categoria !== id));
        } catch (error) {
            console.error('Error al eliminar categoria:', error);
        }
    };

    return (
        <div className="modal-overlay" onClick={onCerrar}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>

                <div className="modal-header">
                    <h2 className="modal-titulo">Configuracion</h2>
                    <button className="modal-cerrar" onClick={onCerrar}>
                        <FiX size={20} />
                    </button>
                </div>

                <div className="modal-pestanas">
                    <button
                        className={`pestaña-btn ${pestañaActiva === 'perfil' ? 'activa' : ''}`}
                        onClick={() => setPestañaActiva('perfil')}
                    >
                        Mi Perfil
                    </button>
                    <button
                        className={`pestaña-btn ${pestañaActiva === 'categorias' ? 'activa' : ''}`}
                        onClick={() => setPestañaActiva('categorias')}
                    >
                        Mis Categorias
                    </button>
                </div>

                {pestañaActiva === 'perfil' && (
                    <div className="modal-contenido">
                        <div className="form-grupo">
                            <label>Nombre</label>
                            <input
                                type="text"
                                placeholder="Tu nombre"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                            />
                        </div>
                        <div className="form-grupo">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Tu email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-grupo">
                            <label>Contraseña</label>
                            <div className="input-con-ojo">
                                <input
                                    type={verContraseña ? 'text' : 'password'}
                                    placeholder="Nueva contraseña"
                                    value={contraseña}
                                    onChange={e => setContraseña(e.target.value)}
                                />
                                <button className="btn-ojo" onClick={() => setVerContraseña(!verContraseña)}>
                                    {verContraseña ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        {mensajePerfil && (
                            <p className="modal-mensaje">{mensajePerfil}</p>
                        )}
                        <button className="btn-guardar" onClick={guardarPerfil}>
                            Guardar cambios
                        </button>
                    </div>
                )}

                {pestañaActiva === 'categorias' && (
                    <div className="modal-contenido">
                        <div className="categoria-form">
                            <input
                                type="text"
                                placeholder="Nueva categoría"
                                value={nuevaCategoria}
                                onChange={e => setNuevaCategoria(e.target.value)}
                            />
                            <button className="btn-agregar" onClick={agregarCategoria}>
                                <FiPlus size={18} />
                            </button>
                        </div>

                        <ul className="categorias-lista">
                            {categorias.map(c => (
                                <li key={c.id_categoria} className="categoria-item">
                                    <span>{c.nombre_categoria}</span>
                                    <button
                                        className="btn-eliminar"
                                        onClick={() => eliminarCategoria(c.id_categoria)}
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}