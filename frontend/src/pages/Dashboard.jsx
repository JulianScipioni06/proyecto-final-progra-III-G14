import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/pages/Dashboard.css";
import SummaryCard from "../components/SummaryCard";
import TransaccionesList from "../components/TransaccionesList";
import ExpensesCard from "../components/ExpensesCard";

const colores_categorias = {
    'Alimentacion': '#2563eb',
    'Transporte': '#10b981',
    'Vivienda': '#f59e0b',
    'Entretenimiento': '#ec4899',
    'Salud': '#8b5cf6',
    'Ropa': '#06b6d4',
    'Otros': '#64748b' //por si viene alguna categoria q no mapeamos
}

export default function Dashboard({ onLogout }) {
  //Arrancamos los datos en cero, Hasta que la API nos devuelva los datos reales.
    const [datosFinancieros, setDatosFinancieros] = useState({
        balance: 0,
        ingresos: 0,
        gastos: 0,
    });
    const [transacciones, setTransacciones] = useState([]);
    const [gastosPorCategoria, setGastosPorCategoria] = useState([]);

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
            console.log("DATOS DEL BACKEND PARA EL GRAFICO: ", respuestaCategorias.data);
            //trasnformamos los datos del back al formato que necesita el grafico, añadiendo los colores
            const datosFormateados = respuestaCategorias.data.map((item,index) => {
                const nombreCategoria = item.categoria?.nombre_categoria || item.nombre_categoria || 'Desconocido';
                return{
                    id: index,
                    name: nombreCategoria,
                    value: Number(item.monto),
                    color: colores_categorias[nombreCategoria] || colores_categorias['Otros']
                };
            }); 
            
            setGastosPorCategoria(datosFormateados);

        } catch (error) {
        console.error("Error al obtener los datos financieros:", error);
        }
    };
    obtenerDatos();
    }, []);

    const fechaActual = new Date().toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
    <div className="dashboard-container">
        <Navbar onLogout={onLogout} />
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
                </section>
                <TransaccionesList transacciones={transacciones} />
        </main>
        </div>
    );
}