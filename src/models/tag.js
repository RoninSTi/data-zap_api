const tag = (sequelize, DataTypes) => {
  const Tag = sequelize.define("tag", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Log, { through: models.LogTag });
  };

  return Tag;
};

module.exports = tag;
