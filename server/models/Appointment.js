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
      this.belongsTo(models.Doctor);
      this.belongsTo(models.Patient);
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
