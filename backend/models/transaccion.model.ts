import { DataTypes, Model } from 'sequelize';
const { sequelize } = require('./index.model');

class Transaccion extends Model {
    public id_transaccion!: number;
    public monto!: number;
    public tipo!: string;
    public fecha!: Date;
}

Transaccion.init(
    {
        id_transaccion: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        monto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false, // Aquí guardarán 'ingreso' o 'gasto'
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'Transaccion',
        tableName: 'transacciones',
        timestamps: false,
    }
);

module.exports = Transaccion;