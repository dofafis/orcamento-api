'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('usuario', {
      uuid : {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      }, 
      nome: {
        allowNull: false,
        type: Sequelize.STRING,
      }, 
      cpf: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      }, 
      data_nascimento: {
        allowNull: false,
        type: Sequelize.DATE,
      }, 
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      }, 
      senha: {
        allowNull: false,
        type: Sequelize.STRING,
      }, 
      data_hora: {
        allowNull: false,
        type: Sequelize.DATE,
      }, 
      ativo: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('usuario')
  }
};
