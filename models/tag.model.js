module.exports = (sequelize, DataTypes) => {
  return sequelize.define("tags", {
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tagLibelle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
};
