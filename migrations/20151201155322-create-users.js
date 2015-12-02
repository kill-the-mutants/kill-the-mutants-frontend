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
      firstname: DataTypes.TEXT,
      lastname: DataTypes.TEXT,
      gender: DataTypes.TEXT,
      age: DataTypes.INTEGER,
      exp_level : DataTypes.INTEGER,
      completed_signup: {
        type: DataTypes.BOOLEAN,
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
