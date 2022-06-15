/**
 *
 * @param {*} sequelize
 * @param {*} DataTypes
 * @param {*} Model
 * @return {Sequelize.Model}
 */
export default function (sequelize, DataTypes, Model) {
  class Auth extends Model {
    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }

  Auth = sequelize.define("Auth", {
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM(
        "DOCTOR",
        "ADMIN",
        "RECEPTIONIST",
        "PHARMACIST",
        "OTHER"
      ),
      defaultValue: "OTHER",
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Auth;
}
