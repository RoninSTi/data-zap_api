const log = (sequelize, DataTypes) => {
  const Log = sequelize.define("log", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Log.associate = (models) => {
    Log.belongsTo(models.User);
  };

  return Log;
};

export default log;
