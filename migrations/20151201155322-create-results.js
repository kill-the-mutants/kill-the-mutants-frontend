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
        allowNull: true
      },
      killed_mutants: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      tests_work: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      code: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      stdout: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      stderr: {
        type: Sequelize.TEXT,
        allowNull: true
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
