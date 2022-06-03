/**
 *
 * @param {*} sequelize
 * @param {*} DataTypes
 * @param {*} Model
 * @return {Sequelize.Model}
 */
export default function (sequelize, DataTypes, Model) {
  class Appointment extends Model {
    static associate(models) {
      this.belongsTo(models.Doctor, {
        foreignKey: "DoctorId",
        as: "Doctor",
        name: "DoctorId",
        targetKey: "id",
      });
      this.belongsTo(models.Patient, {
        foreignKey: "PatientId",
        as: "Patient",
        name: "PatientId",
        targetKey: "id",
      });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }

  Appointment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Appointment",
      timestamps: false,
    }
  );

  return Appointment;
}
