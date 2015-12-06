'use strict';
module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define('Users', {
    login: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.TEXT
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    access_token: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    firstname: DataTypes.TEXT,
    lastname: DataTypes.TEXT,
    gender: DataTypes.TEXT,
    age: DataTypes.INTEGER,
    exp_level: DataTypes.INTEGER,
    completed_signup: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    completed_presurvey: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    completed_postsurvey: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    completed_all_tests: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.hasMany(models.Results);
      }
    }
  });
  return Users;
};
