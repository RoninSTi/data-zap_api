const user = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Log, { onDelete: "CASCADE" });
    User.hasMany(models.Apikey, { onDelete: "CASCADE" });
    User.hasMany(models.Page, { onDelete: "CASCADE" });
    User.hasOne(models.UserOtp, { onDelete: "CASCADE" });
  };

  User.prototype.response = function () {
    const response = this.toJSON();
    delete response.password;

    return response;
  };

  return User;
};

module.exports = user;
