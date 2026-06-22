const Usuario = require('./usuario.model');
const Transaccion = require('./transaccion.model');
const Categoria = require('./categoria.model');

const establecerCardinalidad = () => {
    // Un Usuario hace muchas Transacciones (1 a N)
    Usuario.hasMany(Transaccion, { foreignKey: 'id_usuario', as: 'transacciones' });
    Transaccion.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

    // Una Categoría pertenece a muchas Transacciones (1 a N)
    Categoria.hasMany(Transaccion, { foreignKey: 'id_categoria', as: 'transacciones' });
    Transaccion.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
};

module.exports = { establecerCardinalidad };