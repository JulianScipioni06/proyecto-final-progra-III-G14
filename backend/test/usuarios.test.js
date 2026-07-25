//Test de usuarios
jest.mock('../middleware/validar-jwt.middleware', () => ({
    validarJWT: (req, res, next) => next()
}));
jest.mock('../middleware/usuario-validator.middleware', () => ({
    validateInputUsuario: (req, res, next) => next()
}));

const request = require('supertest');
const app = require('../app');
const usuario = require('../models/usuario.model');
usuario.findByPk = jest.fn();

usuario.findOne = jest.fn();
usuario.findAll = jest.fn();
usuario.create = jest.fn();

describe('POST /usuarios/registrar', () => {
    it('Debe registrar un usuario nuevo y devolver 201', async () => {
        usuario.findOne.mockResolvedValue(null);
        usuario.create.mockResolvedValue({
            id_usuario: 1,
            nombre: 'Guido',
            email: 'guido@test.com'
        });

        const res = await request(app)
            .post('/usuarios/registrar')
            .send({ nombre: 'Guido', email: 'guido@test.com', contrasena: '123456' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('usuario');
        expect(res.body.usuario.email).toBe('guido@test.com');
    });

    it('Debe devolver 400 si el email ya existe', async () => {
        usuario.findOne.mockResolvedValue({ id_usuario: 1, email: 'guido@test.com' });

        const res = await request(app)
            .post('/usuarios/registrar')
            .send({ nombre: 'Guido', email: 'guido@test.com', contrasena: '123456' });

        expect(res.status).toBe(400);
    });
});

describe('POST /usuarios/login', () => {
    it('Debe hacer login con credenciales correctas y devolver token', async () => {
        usuario.findOne.mockResolvedValue({
            id_usuario: 1,
            nombre: 'Guido',
            email: 'guido@test.com',
            contrasena: '$2b$10$hasheada'
        });

        const bcrypt = require('bcrypt');
        jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

        const res = await request(app)
            .post('/usuarios/login')
            .send({ email: 'guido@test.com', contrasena: '123456' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('Debe devolver 404 si el usuario no existe', async () => {
        usuario.findOne.mockResolvedValue(null);

        const res = await request(app)
            .post('/usuarios/login')
            .send({ email: 'noexiste@test.com', contrasena: '123456' });

        expect(res.status).toBe(404);
    });

    it('Debe devolver 401 si la contraseña es incorrecta', async () => {
        usuario.findOne.mockResolvedValue({
            id_usuario: 1,
            email: 'guido@test.com',
            contrasena: '$2b$10$hasheada'
        });

        const bcrypt = require('bcrypt');
        jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

        const res = await request(app)
            .post('/usuarios/login')
            .send({ email: 'guido@test.com', contrasena: 'mal' });

        expect(res.status).toBe(401);
    });
});

describe('GET /usuarios', () => {
    it('Debe devolver la lista de usuarios con 200', async () => {
        usuario.findAll.mockResolvedValue([
            { id_usuario: 1, nombre: 'Guido', email: 'guido@test.com' }
        ]);

        const res = await request(app).get('/usuarios');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('GET /usuarios/:id_usuario', () => {
    it('Debe devolver el usuario por ID con 200', async () => {
        usuario.findByPk.mockResolvedValue({
            id_usuario: 1,
            nombre: 'Guido',
            email: 'guido@test.com'
        });

        const res = await request(app)
            .get('/usuarios/1')
            .set('x-token', 'token_falso');

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id_usuario', 1);
        expect(res.body).toHaveProperty('nombre', 'Guido');
    });

    it('Debe devolver 404 si el usuario no existe', async () => {
        usuario.findByPk.mockResolvedValue(null);

        const res = await request(app)
            .get('/usuarios/999')
            .set('x-token', 'token_falso');

        expect(res.status).toBe(404);
    });
});

//actualizar usuario
describe('PUT /usuarios/:id', () => {
    it('Debe actualizar el usuario y devolver 200', async () => {
        const usuarioMock = {
            id: 1,
            nombre: 'Nombre Viejo',
            email: 'viejo@test.com',
            contrasena: '$2b$10$hasheada',
            update: jest.fn().mockResolvedValue(true)
        };
        usuario.findByPk.mockResolvedValue(usuarioMock);
        usuario.findOne.mockResolvedValue(null);

        const res = await request(app).put('/usuarios/1')
            .send({ nombre: 'Nombre Nuevo', email: 'nuevo@test.com', contrasena: '123456' });

        expect(res.status).toBe(200);
        expect(usuario.findByPk).toHaveBeenCalledWith('1');
        expect(usuarioMock.update).toHaveBeenCalledWith(expect.objectContaining({ nombre: 'Nombre Nuevo' }));
    });

    it('Debe devolver 404 si el usuario no existe', async () => {
        usuario.findByPk.mockResolvedValue(null);

        const res = await request(app).put('/usuarios/11')
            .send({ nombre: 'No Nombre', email: 'no@test.com', contrasena: '123456' });

        expect(res.status).toBe(404);
    });
});


