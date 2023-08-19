export default (sequelize, DataTypes) => {
  return sequelize.define('transactions', {
    transactionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    transactionTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    transactionMembershipPrice: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    transactionValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01,
      },
    },
    transactionStatus: {
      type: DataTypes.ENUM('paid', 'cancelled', 'pending'),
      allowNull: false,
      defaultValue: 'pending',
    },
    transactionPaymentMethod: {
      type: DataTypes.ENUM('cash', 'sumup', 'paypal'),
      allowNull: false,
      defaultValue: 'sumup',
    },
  });
};
