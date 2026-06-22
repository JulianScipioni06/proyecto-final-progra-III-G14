'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transacciones', {
      id_transaccion: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      monto: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
      },
      tipo: {
          type: Sequelize.STRING,
          allowNull: false, 
      },
      fecha: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
      },
      id_usuario: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
              model: 'usuarios',
              key: 'id_usuario'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
      },
      id_categoria: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
              model: 'categorias', 
              key: 'id_categoria'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transacciones'); 
  }
};