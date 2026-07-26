import React, { useState } from 'react';
import api from '../services/api';
import '../styles/pages/Login.css'; 

import InputFormulario from '../components/InputFormulario';
import BotonPrincipal from '../components/BotonPrincipal';

export default function Login({ onLoginExitoso }) {
    const [esRegistro, setEsRegistro] = useState(false);
    
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contrasena, setPassword] = useState('');
    
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState(''); 

    const manejarEnvio = async (e) => {
        e.preventDefault(); 
        setError('');
        setMensajeExito('');

        try {
            if (esRegistro) {
                await api.post('/usuarios/registrar', { 
                    nombre: nombre,
                    email: email, 
                    contrasena: contrasena  
                });
                
                setMensajeExito('¡Usuario creado con éxito! Ahora podés iniciar sesión.');
                setEsRegistro(false); 
                setNombre('');
                setPassword('');
                
            } else {
                const respuesta = await api.post('/usuarios/login', { 
                    email: email, 
                    contrasena: contrasena  
                });
                
                const token = respuesta.data.token;
                localStorage.setItem('token', token);
                onLoginExitoso();
            }

        } catch (error) {
            if (esRegistro) {
                console.error("Error en el registro:", error.response?.data || error.message);
            } else {
                console.error("Error en el login:", error.response?.data || error.message);
            }
            
            setError(error.response?.data?.msg || 'Ocurrió un error. Verificá los datos.');
        }
    };

    let textoTitulo = "";
    let textoBoton = "";
    let textoPregunta = "";
    let textoEnlace = "";

    if (esRegistro) {
        textoTitulo = "Crear Cuenta";
        textoBoton = "Registrarse";
        textoPregunta = "¿Ya tenés una cuenta?";
        textoEnlace = "Iniciá sesión acá";
    } else {
        textoTitulo = "Iniciar Sesión";
        textoBoton = "Ingresar";
        textoPregunta = "¿No tenés cuenta?";
        textoEnlace = "Registrate gratis";
    }

    return (
        <div className="login-contenedor">
            <div className="login-tarjeta">
                <h1 className="login-logo">
                    <span className="logo-icono">📁</span> FinanzasPersonales
                </h1>
                
                <h2 className="login-titulo">{textoTitulo}</h2>
                
                <form onSubmit={manejarEnvio} className="login-formulario">
                    {esRegistro && (
                        <InputFormulario 
                            label="Nombre" 
                            tipo="text" 
                            valor={nombre} 
                            alCambiar={(e) => setNombre(e.target.value)} 
                            placeholder="Ej: Juan" 
                        />
                    )}
                    
                    <InputFormulario 
                        label="Email" 
                        tipo="email" 
                        valor={email} 
                        alCambiar={(e) => setEmail(e.target.value)} 
                        placeholder="tu@email.com" 
                    />
                    
                    <InputFormulario 
                        label="Contraseña" 
                        tipo="password" 
                        valor={contrasena} 
                        alCambiar={(e) => setPassword(e.target.value)} 
                    />
                    
                    {error && <p className="login-error">{error}</p>}
                    {mensajeExito && <p className="login-exito">{mensajeExito}</p>}
                    
                    <BotonPrincipal 
                        texto={textoBoton} 
                        tipo="submit" 
                    />
                </form>

                <div className="login-alternar">
                    <p>
                        {textoPregunta}{" "}
                        <button 
                            type="button" 
                            className="boton-alternar"
                            onClick={() => {
                                setEsRegistro(!esRegistro); 
                                setError('');               
                                setMensajeExito('');
                            }}
                        >
                            {textoEnlace}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}