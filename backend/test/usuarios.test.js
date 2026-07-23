//Test de usuarios
jest.mock('../middleware/validar-jwt.middleware', () => ({
    validarJWT: (req, res, next) => next()
}));
const request = require('supertest');
const app = require('../app');
const usuario = require('../models/usuario.model');
usuario.findByPk = jest.fn();

//actualizar usuario
describe('PUT /usuarios/:id', () => {
    it('Debe actualizar el usuario y devolver 200', async () => {
        //preaparamos el mock de usuario
        const usuarioMock = {
            id: 1,
            nombre: 'Nombre Viejo',
            update: jest.fn().mockResolvedValue(true)
        };
        //simulamos que lo encuentra por id
        usuario.findByPk.mockResolvedValue(usuarioMock);
        //pasamos la ruta
        const res = await request(app).put('/usuarios/1')
        .send({nombre:'Nombre Nuevo', email: 'nuevo@test.com', contrasena: '123456'});
        //comprobamos que este ok
        expect(res.status).toBe(200);
        expect(usuario.findByPk).toHaveBeenCalledWith('1');
        //validamos q se haya llamado al update con los nuevos cambios
        expect(usuarioMock.update).toHaveBeenCalledWith(expect.objectContaining({nombre: 'Nombre Nuevo'}));
    });

    it('Debe devolver 404 si el usuario no existe', async () => {
        //simulamos que no encontro nada
        usuario.findByPk.mockResolvedValue(null);
        
        const res = await request(app).put('/usuarios/11')
        .send({nombre: 'No Nombre', email: 'no@test.com', contrasena: '123456'});
        expect(res.status).toBe(404);
    });
});