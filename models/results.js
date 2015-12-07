'use strict';
module.exports = function(sequelize, DataTypes) {
  var Results = sequelize.define('Results', {
    testname: {
      type: DataTypes.TEXT,
      primaryKey: true,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.TEXT,
      primaryKey: true,
      allowNull: false,
      isAlphanumeric: true
    },
    total_mutants: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    killed_mutants: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tests_work: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    stdout: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    stderr: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.belongsTo(models.Users);
      }
    }
  });
  return Results;
};
