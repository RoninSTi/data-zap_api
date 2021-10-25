const userotp = (sequelize, DataTypes) => {
  const UserOtp = sequelize.define("userotp", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  UserOtp.associate = (models) => {
    UserOtp.belongsTo(models.User);
  };

  return UserOtp;
};

module.exports = userotp;
