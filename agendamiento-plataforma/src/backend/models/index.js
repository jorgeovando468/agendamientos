const { sequelize } = require('../config/database');
const User = require('./user');
const Appointment = require('./appointment');

User.initModel(sequelize);
Appointment.initModel(sequelize);

// Associations
Appointment.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
User.hasMany(Appointment, { as: 'appointments', foreignKey: 'ownerId' });

module.exports = { sequelize, User, Appointment };
