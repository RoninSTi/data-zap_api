const pagelog = (sequelize, DataTypes) => {
  const PageLog = sequelize.define("pagelog", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
  });

  return PageLog;
};

module.exports = pagelog;
