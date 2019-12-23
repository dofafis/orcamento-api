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
        
      }, 
      nome: {

      }, 
      cpf: {

      }, 
      data_nascimento: {

      }, 
      email: {

      }, 
      senha: {

      }, 
      data_hora: {

      }, 
      ativo: {

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
  }
};
