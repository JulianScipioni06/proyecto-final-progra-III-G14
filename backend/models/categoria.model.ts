import { DataTypes, Model } from 'sequelize';
const { sequelize } = require('./index.model');

class Categoria extends Model {
    declare id_categoria: number;
    declare nombre_categoria: string;
}

Categoria.init(
    {
        id_categoria: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre_categoria: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Categoria',
        tableName: 'categorias',
        timestamps: false,
    }
);

module.exports = Categoria;