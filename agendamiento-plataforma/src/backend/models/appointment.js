const { DataTypes, Model } = require('sequelize');
const { APPOINTMENT_STATUS } = require('../../shared/constants');

class Appointment extends Model {
  static initModel(sequelize) {
    Appointment.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        ownerId: { type: DataTypes.INTEGER, allowNull: false },
        customerName: { type: DataTypes.STRING, allowNull: false },
        customerPhone: { type: DataTypes.STRING, allowNull: false },
        startTime: { type: DataTypes.DATE, allowNull: false },
        endTime: { type: DataTypes.DATE, allowNull: false },
        // Reminder tracking flags to avoid duplicate notifications
        reminder24hSent: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        reminder1hSent: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        status: {
          type: DataTypes.ENUM(
            APPOINTMENT_STATUS.SCHEDULED,
            APPOINTMENT_STATUS.CANCELLED,
            APPOINTMENT_STATUS.COMPLETED
          ),
          allowNull: false,
          defaultValue: APPOINTMENT_STATUS.SCHEDULED,
        },
        notes: { type: DataTypes.TEXT, allowNull: true },
      },
      { sequelize, modelName: 'Appointment' }
    );
  }
}

module.exports = Appointment;
