/**
 *
 * @param {*} sequelize
 * @param {*} DataTypes
 * @param {*} Model
 * @return {Sequelize.Model}
 */
export default function (sequelize, DataTypes, Model) {
  class Prescription extends Model {
    static associate(models) {
      this.belongsTo(models.Doctor);
      this.belongsTo(models.Patient);
      this.belongsTo(models.Medicine);
    }
  }

  Prescription.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      datePrescribed: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dateExpiring: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Prescription",
      timestamps: false,
    }
  );

  return Prescription;
}
