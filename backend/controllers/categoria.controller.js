const {Op} = require('sequelize');
const categoria = require('../models/categoria.model');

const crearCategoria = async (req , res) => {
    try{
        const {nombre_categoria} = req.body;

        if (!nombre_categoria){
            return res.status(400).json ({
                mensaje: `debe poner un nombre de categoria`});
        }

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

// ELliminar categoria 
const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const categoria = await categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

        await categoria.destroy();

        return res.status(200).json({ msg: 'Categoría eliminada correctamente' });

    } catch (error) {
        // Si el error es porque la categoría tiene transacciones asociadas 
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ 
                msg: 'No se puede eliminar la categoría porque tiene transacciones asociadas. Primero borrá o reasigná esos gastos.' 
            });
        }

        console.log(error);
        return res.status(500).json({ msg: 'Error interno del servidor al eliminar' });
    }
};


// Actualizar categoria
const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_categoria } = req.body; // Agarramos el nuevo nombre

        // Validar que nos hayan mandado el nombre
        if (!nombre_categoria) {
            return res.status(400).json({ msg: 'El nombre de la categoría es obligatorio' });
        }

        // Buscar si la categoría que queremos editar existe
        const categoria = await categoria.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        }

        // Control de duplicados
        const categoriaDuplicada = await categoria.findOne({
            where: {
                nombre_categoria: { [Op.iLike]: nombre_categoria },
                id_categoria: { [Op.not]: id } // Excluimos el ID actual: "Que no sea la misma que estoy editando"
            }
        });

        if (categoriaDuplicada) {
            return res.status(400).json({ msg: 'Ya existe otra categoría con ese nombre' });
        }

        categoria.nombre_categoria = nombre_categoria;
        await categoria.save();

        return res.status(200).json({
            msg: 'Categoría actualizada con éxito',
            categoria
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error interno del servidor al actualizar' });
    }
};

module.exports = {crearCategoria, listarCategorias, eliminarCategoria, actualizarCategoria};