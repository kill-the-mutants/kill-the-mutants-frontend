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
      tests_work: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      duration: Sequelize.INTEGER,
      code: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      stdout: Sequelize.TEXT,
      stderr: Sequelize.TEXT,
      total_mutants: Sequelize.INTEGER,
      killed_mutants: Sequelize.INTEGER,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Results');
  }
};
