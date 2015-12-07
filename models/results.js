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
    tests_work: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    duration: DataTypes.INTEGER,
    code: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    stdout: DataTypes.TEXT,
    stderr: DataTypes.TEXT,
    total_mutants: DataTypes.INTEGER,
    killed_mutants: DataTypes.INTEGER
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
