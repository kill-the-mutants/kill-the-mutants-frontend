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
      allowNull: false
    },
    killed_mutants: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tests_work: {
      type: DataTypes.BOOLEAN,
      allowNull: false
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
