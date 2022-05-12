/**
 *
 * @param {*} sequelize
 * @param {*} DataTypes
 * @param {*} Model
 * @return {Sequelize.Model}
 */
export default function (sequelize, DataTypes, Model) {
  class Patient extends Model {
    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }

  Patient.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lastVisit: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jamiaId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Patient",
      timestamps: false,
    }
  );

  return Patient;
}
