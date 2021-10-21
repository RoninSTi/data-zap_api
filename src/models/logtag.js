const logtag = (sequelize, DataTypes) => {
  const LogTag = sequelize.define("logtag", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
  });

  return LogTag;
};

module.exports = logtag;
