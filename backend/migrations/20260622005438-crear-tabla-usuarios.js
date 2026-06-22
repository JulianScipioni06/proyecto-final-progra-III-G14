'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('usuarios', {
      id_usuario: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      nombre: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
      },
      contrasena: {
          type: Sequelize.STRING,
          allowNull: false,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('usuarios'); 
  }
};