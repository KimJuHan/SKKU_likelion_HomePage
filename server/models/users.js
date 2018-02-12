'use strict';
module.exports = (sequelize, DataTypes) => {
  var users = sequelize.define('users', {
    displayName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    knowHow: DataTypes.TEXT
  });
  return users;
};