import { Sequelize } from "sequelize";
const config = require('../config/database.config')

const env = process.env.NODE_ENV || 'development'
const dbConfig = config[env]

let sequelize: Sequelize;

if (process.env.DATABASE_URL) {
    console.log("=== DEBUGGING ===");
    console.log("URL que está leyendo Node:", process.env.DATABASE_URL);
    console.log("=================");
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: dbConfig.dialectOptions
    });
} else {
    sequelize = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        {
            host: dbConfig.host,
            port: dbConfig.port,
            dialect: dbConfig.dialect,
            logging: dbConfig.logging,
            dialectOptions: dbConfig.dialectOptions
        }
    );
}


const verificarConexion = async (): Promise<void> => {
    try {
        await sequelize.authenticate()
        console.log(`Conectado con éxito a las tablas en: ${dbConfig.host}`)
    } catch (error: any) {
        console.error('Error en la base de datos: ', error.message)
    }
}

verificarConexion()

module.exports = {
    sequelize,
    Sequelize
}