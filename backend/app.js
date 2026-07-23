const Server = require('./core/server')

const servidor = new Server()
servidor.listen()
module.exports = servidor.app;