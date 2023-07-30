const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "clients",
    {
      clientId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      clientFirstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientLastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      clientSolde: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["clientFirstName", "clientLastName"],
        },
      ],
    }
  );
};
