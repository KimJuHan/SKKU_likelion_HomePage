'use strict';
module.exports = (sequelize, DataTypes) => {
  var posts = sequelize.define('posts', {
    headerName: DataTypes.STRING,
    content: DataTypes.TEXT,
    comment: DataTypes.TEXT,
    userId: DataTypes.STRING
  });
  return posts;
};