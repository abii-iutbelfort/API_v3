module.exports = (sequelize, DataTypes) => {
  return sequelize.define("memberships", {
    membershipId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    membershipLibelle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    membershipPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: DataTypes.DECIMAL(10, 2).MAX,
      validate: {
        min: 0.01,
      },
    },
    // REVIEW - stocker la durée en mois ici ?
  });
};
