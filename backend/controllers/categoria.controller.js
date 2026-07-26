const { Op, Sequelize } = require('sequelize');
const categoria = require('../models/categoria.model');

const crearCategoria = async (req , res) => {
    try{
        const {nombre_categoria} = req.body;

        // validamos que no se dupliquen las categorias
        const categoriaExiste = await categoria.findOne({
            where: {
                nombre_categoria: {
                    [Op.iLike]: nombre_categoria
                    }
                }
        });

        if (categoriaExiste) {
            return res.status(400).json({
                mensaje: 'La categoría ya existe'
            });
        }

        const nueva = await categoria.create ({nombre_categoria});
        res.status(201).json(nueva);
    }catch (error){
        res.status(500).json ({
            mensaje: `error al crear la categoria`, error: error.message
        });
    }  
};

const listarCategorias = async (req , res) =>{
    try{
        const categorias = await categoria.findAll();
        res.status(200).json(categorias)
    }catch (error){
        res.status(500).json({mensaje:`error al listar las categorias`, error: error.message});
    }
};

// Actualizar categoria
const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_categoria } = req.body; 

        const categoriaEncontrada = await categoria.findByPk(id);
        if (!categoriaEncontrada) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

        if (!categoriaEncontrada.nombre_categoria) {
            return res.status(500).json({ 
                msg: `Inconsistencia en la BDD: La categoría con ID ${id} tiene un nombre nulo o indefinido. Por favor, borrá este registro manualmente de la base de datos.` 
            });
        }

        if (categoriaEncontrada.nombre_categoria.toLowerCase() === nombre_categoria.trim().toLowerCase()) {
            return res.status(400).json({ msg: 'La categoría ya tiene ese nombre. No ingresaste cambios.' });
        }

        const categoriaDuplicada = await categoria.findOne({
            where: {
                nombre_categoria: { [Op.iLike]: nombre_categoria.trim() },
                id_categoria: { [Op.ne]: id } 
            }
        });

        if (categoriaDuplicada) {
            return res.status(400).json({ msg: 'Ya existe otra categoría con ese nombre' });
        }

        categoriaEncontrada.nombre_categoria = nombre_categoria.trim();
        await categoriaEncontrada.save();

        return res.status(200).json({
            msg: 'Categoría actualizada con éxito',
            categoria: categoriaEncontrada
        });

    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        return res.status(500).json({ 
            msg: 'Error interno del servidor al actualizar',
            detalle_del_error: error.message 
        });
    }
};

// Eliminar categoria 
const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const categoriaEncontrada = await categoria.findByPk(id);
        if (!categoriaEncontrada) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

        await categoriaEncontrada.destroy();

        return res.status(200).json({ msg: 'Categoría eliminada correctamente' });

    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ 
                msg: 'No se puede eliminar la categoría porque tiene transacciones asociadas. Primero borrá o reasigná esos gastos.' 
            });
        }

        console.log(error);
        return res.status(500).json({ msg: 'Error interno del servidor al eliminar' });
    }
};

module.exports = {crearCategoria, listarCategorias, eliminarCategoria, actualizarCategoria};