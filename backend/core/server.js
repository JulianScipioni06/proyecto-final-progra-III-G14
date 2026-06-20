const express = require("express");
const cors = require("cors");
require("dotenv").config();
const errorHandler = require('../middleware/error-handler.middleware')
const { sequelize } = require('../models/index.model')
const { establecerCardinalidad } = require('../models/cardinalidades.model')

class Server {
    constructor() {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.connectToDataBase()
    this.middleware()
    this.rutas()
    this.errorHandlerGlobal()
    }

    middleware() {
        this.app.use(cors())
        this.app.use(express.json())
    }

    rutas() {
        this.app.use("/usuarios", require("../routes/usuario.routes"));
        this.app.use("/transacciones", require("../routes/transaccion.routes"));
        this.app.use("/categorias", require("../routes/categoria.routes"));
    }

    async connectToDataBase() {
        try {
            establecerCardinalidad()
            console.log(
                'Cardinalidad y relaciones entre tablas establecidas correctamente'
            )

            await sequelize.sync({ alter: false })
            console.log('Database sincronizada correctamente')
            } catch (error) {
            console.error('Error en la conexión a la DB: ', error)
        }
    }

    errorHandlerGlobal() {
        this.app.use((req, res, next) => {
            return res.status(404).json({ msg: 'Ruta no encontrada' });
        });

        this.app.use(errorHandler);
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`La API esta escuchando el el puerto: ${this.port}`);
        });
    }
}

module.exports = Server;
