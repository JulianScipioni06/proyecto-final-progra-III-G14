const Transaccion = require('../models/transaccion.model');
const Categoria = require('../models/categoria.model');
const { Op, Sequelize } = require('sequelize');

const crearTransaccion = async (req, res) => {
    try {
        const { monto, tipo, id_usuario, id_categoria } = req.body;

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
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ 
                error: "El usuario o la categoría indicada no existen en la base de datos." 
            });
        }

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

const actualizarTransaccion = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Buscamos si la transacción existe
        const transaccion = await Transaccion.findByPk(id);
        
        if (!transaccion) {
            return res.status(404).json({ error: "Transacción no encontrada" });
        }

        await transaccion.update(req.body);

        res.status(200).json({ 
            msg: "Transacción actualizada correctamente",
            transaccion 
        });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la transacción" });
    }
};

// Eliminar Transaccion
const eliminarTransaccion = async (req, res) => {
    try {
        const {id} = req.params;

        // validamos si la transacción existe
        const transaccion = await Transaccion.findByPk(id);

        if (!transaccion) {
            return res.status(404).json({ error: "Transacción no encontrada" });
        }

        await transaccion.destroy(); // borrado fisico

        res.status(200).json({ 
            msg: `La transacción con ID ${id} eliminada correctamente` 
        });

    } catch (error) {
        res.status(500).json({ 
            error: "Error al eliminar la transacción", 
            details: error.message 
        });
    }
};

// Obtener Balance Actual
const obtenerBalance = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        // Forzamos que el ID sea un número para que PostgreSQL lo entienda perfecto
        const idNum = parseInt(id_usuario, 10);

        // Asegurate de que 'ingreso' y 'gasto' estén 100% en minúsculas
        const totalIngresos = await Transaccion.sum('monto', { 
            where: { id_usuario: idNum, tipo: 'ingreso' } 
        }) || 0;

        const totalGastos = await Transaccion.sum('monto', { 
            where: { id_usuario: idNum, tipo: 'gasto' } 
        }) || 0;

        const balanceActual = totalIngresos - totalGastos;

        res.json({
            id_usuario,
            totalIngresos,
            totalGastos,
            balanceActual
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error al calcular el balance' });
    }
};

module.exports = {
    crearTransaccion,
    obtenerHistorial,
    obtenerPorCategoria,
    obtenerPorTipo,
    actualizarTransaccion,
    eliminarTransaccion,
    obtenerBalance
};