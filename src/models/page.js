const page = (sequelize, DataTypes) => {
  const Page = sequelize.define("page", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Page.associate = (models) => {
    Page.belongsTo(models.User);
    Page.belongsToMany(models.Log, { through: models.PageLog });
  };

  return Page;
};

module.exports = page;
