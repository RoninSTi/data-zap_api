const apikey = (sequelize, DataTypes) => {
  const Apikey = sequelize.define("apikey", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    prefix: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    privatekey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    publickey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scopes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  });

  Apikey.associate = (models) => {
    Apikey.belongsTo(models.User);
  };

  return Apikey;
};

module.exports = apikey;
