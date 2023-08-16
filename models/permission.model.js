// REVIEW : A voir si on garde ce model ou si on le supprime
export default (sequelize, DataTypes) => {
  return sequelize.define('permissions', {
    permId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    libelle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
};
