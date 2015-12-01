'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    email: {
      type: DataTypes.TEXT,
      primaryKey: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Users;
};
