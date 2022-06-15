/**
 *
 * @param {*} sequelize
 * @param {*} DataTypes
 * @param {*} Model
 * @return {Sequelize.Model}
 */
export default function (sequelize, DataTypes, Model) {
  class Pharmacist extends Model {
    static associate(models) {
      this.belongsTo(models.Auth, {
        foreignKey: "AuthId",
        as: "Auth",
        name: "AuthId",
        targetKey: "id",
      });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }

  Pharmacist.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Pharmacist",
      timestamps: false,
    }
  );

  return Pharmacist;
}
