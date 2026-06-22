'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('categorias', [
      { nombre_categoria: 'Sueldo' },
      { nombre_categoria: 'Supermercado' },
      { nombre_categoria: 'Facultad' }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categorias', null, {});
  }
};
