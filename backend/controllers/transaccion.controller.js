const Transaccion = require('../models/transaccion.model');
const Categoria = require('../models/categoria.model');
const { Op, Sequelize } = require('sequelize');

const crearTransaccion = async (req, res) => {
    try {
        const { monto, tipo, id_usuario, id_categoria } = req.body;

        if (!monto || !tipo || !id_usuario || !id_categoria) {
            return res.status(400).json({ 
                error: "Faltan campos obligatorios (monto, tipo, id_usuario, id_categoria)." 
            });
        }

        // Validar que el tipo sea correcto
        if (tipo !== 'ingreso' && tipo !== 'gasto') {
            return res.status(400).json({ 
                error: "El tipo de transacción debe ser 'ingreso' o 'gasto'." 
            });
        }

        // Validar que el monto sea un número positivo válido
        if (isNaN(monto) || parseFloat(monto) <= 0) {
            return res.status(400).json({ 
                error: "El monto debe ser un número mayor a cero." 
            });
        }

        // Crear registro en la base de datos
        const nuevaTransaccion = await Transaccion.create({
            monto: parseFloat(monto),
            tipo,
            id_usuario, 
            id_categoria  
        });

        return res.status(201).json({
            message: "Transacción registrada con éxito.",
            transaccion: nuevaTransaccion
        });

    } catch (error) {
        console.error("Error en crearTransaccion:", error);
        return res.status(500).json({ 
            error: "Hubo un problema interno al registrar la transacción." 
        });
    }
};
const obtenerHistorial = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { tipo, id_categoria, fechaInicio, fechaFin } = req.query;
    
        let filtros = { id_usuario };
    
        //Filtro por tipo de Ingreso o Gasto
        if (tipo) {
            filtros.tipo = tipo;
        }
    
        //Filtro por categoria
        if (id_categoria) {
            filtros.id_categoria = id_categoria;
        }
    
        //Filtro por rango de fechas
        if (fechaInicio || fechaFin) {
            filtros.fecha = {};
            if (fechaInicio) {
            filtros.fecha[Op.gte] = new Date(fechaInicio);
        }
        if (fechaFin) {
            filtros.fecha[Op.lte] = new Date(fechaFin);
        }
        }
    
        const transacciones = await Transaccion.findAll({
            where: filtros,
            include: [
            { model: Categoria, as: "categoria", attributes: ["nombre_categoria"] },
            ],
            order: [["fecha", "DESC"]],
        });
        res.json(transacciones);
        } catch (error) {
        res
            .status(500)
            .json({ error: "Error al obtener el historial de transacciones." });
        }
    };
    
// método para obtener transacciones por categoría
const obtenerPorCategoria = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { id_categoria } = req.query;

        let filtros = { id_usuario };
        
        // Filtramos por categoria si es necesario.
        if (id_categoria) {
            filtros.id_categoria = id_categoria;
        }

        const transacciones = await Transaccion.findAll({
            where: filtros,
            include: [{ model: Categoria, as: "categoria", attributes: ["nombre_categoria"] }],
            order: [["fecha", "DESC"]] // Ordenadas desde la mas reciente.
        });

        res.json(transacciones);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener transacciones por categoría.",
            detalle_del_error: error.message,
        });
    }
};

// método para obtener transacciones por tipo (ingreso o gasto)
const obtenerPorTipo = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const { tipo } = req.query; 

        let filtros = { id_usuario };
        
        // Filtramos por tipo si es necesario.
        if (tipo) {
            filtros.tipo = tipo;
        }

        const transacciones = await Transaccion.findAll({
            where: filtros,
            include: [{ model: Categoria, as: "categoria", attributes: ["nombre_categoria"] }], 
            order: [["fecha", "DESC"]] // Ordenadas desde la mas reciente.
        });

        res.json(transacciones);
    } catch (error) {
        res.status(500).json({ 
            error: "Error al obtener transacciones por tipo.",
            detalle_del_error: error.message 
        });
    }
};
module.exports = {
    crearTransaccion,
    obtenerHistorial,
    obtenerPorCategoria,
    obtenerPorTipo
};