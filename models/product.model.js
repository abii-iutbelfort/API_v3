export default (sequelize, DataTypes) => {
  return sequelize.define('products', {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    productLibelle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    productStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    productNormalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: DataTypes.DECIMAL(10, 2).MAX,
      validate: {
        min: 0.01,
      },
    },
    productDiscountPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: DataTypes.DECIMAL(10, 2).MAX,
      validate: {
        min: 0.01,
      },
    },
  });
};
