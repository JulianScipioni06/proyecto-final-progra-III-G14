import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/pages/Dashboard.css";
import SummaryCard from "../components/SummaryCard";

export default function Dashboard({ onLogout }) {
  //Arrancamos los datos en cero, Hasta que la API nos devuelva los datos reales.
    const [datosFinancieros, setDatosFinancieros] = useState({
        balance: 0,
        ingresos: 0,
        gastos: 0,
    });

    useEffect(() => {
    const obtenerDatos = async () => {
        try {
            const idUsuario = 11;
            const token =localStorage.getItem("token");

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
        </main>
        </div>
    );
}