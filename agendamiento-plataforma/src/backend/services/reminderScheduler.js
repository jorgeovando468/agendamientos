const cron = require('node-cron');
const { Op } = require('sequelize');
const { Appointment } = require('../models');
const { sendWhatsAppText } = require('./whatsappService');

function withinWindow(targetTime, minutes) {
  const now = Date.now();
  const delta = Math.abs(targetTime.getTime() - now);
  return delta <= minutes * 60 * 1000;
}

async function processReminders() {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in1h = new Date(now.getTime() + 60 * 60 * 1000);

  const upcoming = await Appointment.findAll({
    where: {
      status: 'scheduled',
      startTime: { [Op.gte]: now, [Op.lte]: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
    },
    order: [['startTime', 'ASC']],
  });

  for (const appt of upcoming) {
    try {
      // 24h reminder
      if (!appt.reminder24hSent && withinWindow(new Date(appt.startTime.getTime() - 24 * 60 * 60 * 1000), 5)) {
        await sendWhatsAppText(
          appt.customerPhone,
          `Recordatorio: tu cita es mañana a las ${new Date(appt.startTime).toLocaleTimeString()}.`
        );
        appt.reminder24hSent = true;
        await appt.save();
      }
      // 1h reminder
      if (!appt.reminder1hSent && withinWindow(new Date(appt.startTime.getTime() - 60 * 60 * 1000), 5)) {
        await sendWhatsAppText(
          appt.customerPhone,
          `Recordatorio: tu cita es en 1 hora (${new Date(appt.startTime).toLocaleTimeString()}).`
        );
        appt.reminder1hSent = true;
        await appt.save();
      }
    } catch (err) {
      // best-effort; log and continue
      // eslint-disable-next-line no-console
      console.error('Reminder error', err?.response?.data || err.message);
    }
  }
}

function startReminderScheduler() {
  const enabled = process.env.REMINDERS_ENABLED;
  if (String(enabled).toLowerCase() === 'false') {
    // eslint-disable-next-line no-console
    console.log('Reminders scheduler disabled');
    return;
  }
  // every 5 minutes
  cron.schedule('*/5 * * * *', processReminders);
  // run once on boot after short delay
  setTimeout(processReminders, 5000);
  // eslint-disable-next-line no-console
  console.log('Reminder scheduler started');
}

module.exports = { startReminderScheduler };
