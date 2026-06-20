const categoria = require('../models/categoria.model');

const crearCategoria = async (req , res) => {
    try{
        const {nombre_categoria} = req.body;

        if (!nombre_categoria){
            return res.status(400).json ({
                mensaje: `debe poner un nombre de categoria`});
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
        res.status(500).json({mensaje:`eroor al listar las categorias`, error: error.message});
    }
};

module.exports = {crearCategoria, listarCategorias};