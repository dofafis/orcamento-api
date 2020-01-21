'use strict';

// transacao (uuid, uuid_usuario, uuid_categoria, descricao, valor, tipo, data_hora)
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('transacao', {
      uuid : {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      descricao: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      valor : {
        allowNull: false,
        type: Sequelize.INTEGER  
      },
      tipo : {
        allowNull: false,
        type: Sequelize.INTEGER  
      },
      data_hora: {
        allowNull: false,
        type: Sequelize.DATE,
      }, 
      uuid_usuario : {
        allowNull: false,
        type: Sequelize.UUID,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'usuario',
          key: 'uuid'
        }
      },
      uuid_categoria : {
        allowNull: false,
        type: Sequelize.UUID,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'categoria',
          key: 'uuid'
        }
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
   return queryInterface.dropTable('transacao')    
  }
};