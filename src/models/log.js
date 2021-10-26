const log = (sequelize, DataTypes) => {
  const Log = sequelize.define("log", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    csvUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    youtubeUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Log.associate = (models) => {
    Log.belongsTo(models.User);
    Log.belongsToMany(models.Tag, { through: models.LogTag });
    Log.belongsToMany(models.Page, { through: models.PageLog });
  };

  return Log;
};

module.exports = log;
