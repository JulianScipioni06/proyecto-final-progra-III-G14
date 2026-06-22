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

module.exports = {crearCategoria, listarCategorias};