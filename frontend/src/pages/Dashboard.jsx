import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/pages/Dashboard.css";
import SummaryCard from "../components/SummaryCard";
import TransaccionesList from "../components/TransaccionesList";
import FormularioTransaccion from "../components/FormularioTransaccion";
import ExpensesCard from "../components/ExpensesCard";
import ModalConfirmacion from "../components/ModalConfirmacion";


export default function Dashboard({ onLogout }) {
    //Arrancamos los datos en cero, Hasta que la API nos devuelva los datos reales.
    const [datosFinancieros, setDatosFinancieros] = useState({
        balance: 0,
        ingresos: 0,
        gastos: 0,
    });
    const [transacciones, setTransacciones] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [gastosPorCategoria, setGastosPorCategoria] = useState([]);
    const [actualizarDatos, setActualizarDatos] = useState(0);
    const [transaccionAEditar, setTransaccionAEditar] = useState(null);
    const [idAEliminar, setIdAEliminar] = useState(null);
    const [modalHistorialAbierto, setModalHistorialAbierto] = useState(false);

    useEffect(() => {
    const obtenerDatos = async () => {
        try {
            const token =localStorage.getItem("token");
            // Verificamos si el token existe antes de continuar

            if (!token) return; // Si no hay token, no hacemos la solicitud
            const payloadCodificado = token.split('.')[1];
            // Decodificamos el token para obtener el id del usuario.
            const datosToken = JSON.parse(atob(payloadCodificado));
            const idUsuario = datosToken.uid || datosToken.id || datosToken.id_usuario;

            if (!idUsuario) {
                console.error("No se pudo obtener el ID del usuario del token.");
                return;
            }

            //balance, ingresos y gastos totales
            const respuesta = await api.get(`/transacciones/${idUsuario}/balance`, {
                    headers: {
                        'x-token': token 
                    }
                });
            
            setDatosFinancieros({
            balance: respuesta.data.balanceActual,
            ingresos: respuesta.data.totalIngresos,
            gastos: respuesta.data.totalGastos,
            
        });
            //treamos los gastos agrupados por categoria en el back
            const respuestaCategorias = await api.get(`/transacciones/${idUsuario}/por-categoria`,{
                headers: {'x-token': token}
            });

            setGastosPorCategoria(respuestaCategorias.data);

            const respuestaHistorial = await api.get(`/transacciones/${idUsuario}/historial`, {
                headers: { 'x-token': token }
            });

            setTransacciones(respuestaHistorial.data);

        } catch (error) {
        console.error("Error al obtener los datos financieros:", error);
        }
    };
    obtenerDatos();
    }, [actualizarDatos]);

    const handleEliminarTransaccion = (idTransaccion) =>{
        setIdAEliminar (idTransaccion);
    }

    const confirmarBorrado =  async() => {

        try{
            const token = localStorage.getItem("token");
            await api.delete(`/transacciones/${idAEliminar}`, {
                headers: {'x-token': token}
            });
            setActualizarDatos(actualizarDatos + 1);
            setIdAEliminar(null);
    } catch (error){
        console.error("Error al eliminar la transaccion", error);
        alert("Error al intentar borrar el registro");
        }
    }

    const handleEditarTransaccion = (transaccion) =>{
        setTransaccionAEditar(transaccion);
        setModalAbierto(true);
    };


    const fechaActual = new Date().toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
    <div className="dashboard-container">
        <Navbar 
            onLogout={onLogout} 
            onAbrirModal={() => {
                setModalAbierto(true)
                setTransaccionAEditar(null);
            }} 
            onAbrirHistorial={() => setModalHistorialAbierto(true)}
        />
        <main className="dashboard-main">
            <div className="dashboard-header-text">
            <h1 className="dashboard-title">Resumen general</h1>
            <p className="dashboard-date">{fechaActual}</p>
            </div>

            <section className="dashboard-cards-section">
                    <SummaryCard 
                        title="Balance actual" 
                        amount={`$${datosFinancieros.balance.toLocaleString()}`} 
                        type="main" 
                    />

                    <SummaryCard 
                        title="Ingresos" 
                        amount={`$${datosFinancieros.ingresos.toLocaleString()}`} 
                        subtitle="Total recibido" 
                        type="income" 
                    />

                    <SummaryCard 
                        title="Gastos" 
                        amount={`$${datosFinancieros.gastos.toLocaleString()}`} 
                        subtitle="Total gastado" 
                        type="expense" 
                    />
                </section>
                <section className="dashboard-content-section">
                    <ExpensesCard data={gastosPorCategoria}/>
                    <TransaccionesList transacciones={transacciones}
                    onEliminar={handleEliminarTransaccion}
                    onEditar={handleEditarTransaccion}/>
                </section>
        </main>

        <FormularioTransaccion 
            isOpen={modalAbierto}
            onClose={() => {
                setModalAbierto(false);
                setTransaccionAEditar(null);
            }}
            onTransactionAdded={() => {
                setModalAbierto(false);
                setTransaccionAEditar(null);
                setActualizarDatos(actualizarDatos + 1);
            }}
            transaccionAEditar={transaccionAEditar} 
        />
        <ModalConfirmacion
            isOpen={idAEliminar !== null}
            onClose={() => setIdAEliminar(null)}
            onConfirm={confirmarBorrado}
        />
        {modalHistorialAbierto && (
            <div className="modal-overlay" onClick={() => setModalHistorialAbierto(false)}>
                <div 
                    className="modal-container modal-historial" 
                    onClick={(e) => e.stopPropagation()} 
                >
                    <div className="modal-historial-header">
                        <h3>Historial Completo</h3>
                        <button className="btn-cancelar" onClick={() => setModalHistorialAbierto(false)}>Cerrar</button>
                    </div>
                    
                    <TransaccionesList 
                        transacciones={transacciones}
                        onEliminar={handleEliminarTransaccion}
                        onEditar={handleEditarTransaccion}
                    />
                </div>
            </div>
        )}
    </div>
    )
}