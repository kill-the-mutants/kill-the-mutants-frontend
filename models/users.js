'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    email: {
      type: DataTypes.TEXT,
      primaryKey: true,
      validate: {
        isEmail: true,
        notNull: true
      }
    },
    access_token: {
      type: DataTypes.TEXT,
      validate: {
        notNull: true
      }
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
