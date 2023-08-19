// TODO - A supprimer si la date de fin n'est pas stockée ici ET si on ne met pas de hook pour mettre une date de fin de membership sur l'utilisateur

export default (sequelize, DataTypes) => {
  return sequelize.define('memberships_sales', {
    membershipId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      foreignKey: true,
      references: {
        model: 'memberships',
        key: 'membershipId',
      },
    },
    transactionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      foreignKey: true,
      references: {
        model: 'transactions',
        key: 'transactionId',
      },
    },
  });
};
