import { DataTypes, Model } from 'sequelize';
const { sequelize } = require('./index.model');

class Usuario extends Model {
    declare id_usuario: number;
    declare nombre: string;
    declare email: string;
    declare contrasena: string;
}

Usuario.init(
    {
        id_usuario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        contrasena: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Usuario',
        tableName: 'usuarios',
        timestamps: false,
    }
);

module.exports = Usuario;