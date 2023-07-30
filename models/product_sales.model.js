module.exports = (sequelize, DataTypes) => {
  return sequelize.define("product_sales", {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      foreignKey: true,
      references: {
        model: "products",
        key: "productId",
      },
    },
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      foreignKey: true,
      references: {
        model: "transactions",
        key: "transactionId",
      },
    },
    amountSold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  });
};
