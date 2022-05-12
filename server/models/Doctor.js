/**
 *
 * @param {*} sequelize
 * @param {*} DataTypes
 * @param {*} Model
 * @return {Sequelize.Model}
 */
export default function (sequelize, DataTypes, Model) {
  class Doctor extends Model {
    static associate(models) {
      this.belongsTo(models.Auth);
      this.hasMany(models.Appointment);
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }

  Doctor.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      availability: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Doctor",
      timestamps: false,
    }
  );

  return Doctor;
}
