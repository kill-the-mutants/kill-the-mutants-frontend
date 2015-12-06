'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Results', {
      testname: {
        type: Sequelize.TEXT,
        primaryKey: true,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.TEXT,
        primaryKey: true,
        allowNull: false
      },
      total_mutants: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      killed_mutants: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      tests_work: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Results');
  }
};
