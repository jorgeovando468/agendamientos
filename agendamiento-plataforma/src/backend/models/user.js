const { DataTypes, Model } = require('sequelize');

class User extends Model {
  static initModel(sequelize) {
    User.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        apiKey: { type: DataTypes.STRING, allowNull: true },
      },
      { sequelize, modelName: 'User' }
    );
  }
}

module.exports = User;
