'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      login: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.TEXT
      },
      email: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      access_token: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      firstname: Sequelize.TEXT,
      lastname: Sequelize.TEXT,
      gender: Sequelize.TEXT,
      age: Sequelize.INTEGER,
      exp_level : Sequelize.INTEGER,
      completed_signup: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      completed_presurvey: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      completed_postsurvey: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      completed_all_tests: {
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
    return queryInterface.dropTable('Users');
  }
};
