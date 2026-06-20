require('dotenv').config()

const esNube =
    process.env.PGHOST &&
    process.env.PGHOST !== 'localhost' &&
    process.env.PGHOST !== 'database'

module.exports = {
    development: {
        username: process.env.PGUSER || process.env.DB_USER || 'app_user',
        password:
        process.env.PGPASSWORD || process.env.DB_PASSWORD || 'app_password',
        database: process.env.PGDATABASE || process.env.DB_NAME || 'app_database',
        host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
        port: process.env.PGPORT || process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
        pool: {
        max: 7,
        min: 0,
        acquire: 30000,
        idle: 10000
        },

        dialectOptions: esNube
        ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
            }
        : {}
    }
}