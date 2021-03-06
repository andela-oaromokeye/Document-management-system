module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    OwnerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        min: 3,
      },
    },
    access: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'public',
      validate: { isIn: [['private', 'public', 'role']] },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        min: 3,
      },
    },
  }, {
    classMethods: {
      associate: (models) => {
        Document.belongsTo(models.User, {
          foreignKey: 'OwnerId',
          onDelete: 'CASCADE',
        });
      },
    },
  });
  return Document;
};
