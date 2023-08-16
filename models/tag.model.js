export default (sequelize, DataTypes) => {
  return sequelize.define("tags", {
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tagLibelle: {
      // TODO: add case insensitive unique constraint
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
};
