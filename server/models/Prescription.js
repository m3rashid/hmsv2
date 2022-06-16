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
      // this.belongsTo(models.Medicine);
      this.belongsTo(models.Appointment, {
        foreignKey: "appointmentId",
        as: "appointment",
        name: "appointmentId",
        targetKey: "id",
      });
    }
  }

  Prescription.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      symptoms: {
        type: DataTypes.STRING,
      },
      prescription: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      CustomMedicines: {
        type: DataTypes.STRING,
      },
      datePrescribed: {
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
