const { DEFAULT_AVAILABILITY } = require('../../shared/constants');

function generateDailySlots(dateIso, overrides) {
  const config = { ...DEFAULT_AVAILABILITY, ...(overrides || {}) };
  const date = new Date(dateIso);
  const slots = [];
  const start = new Date(date);
  start.setHours(config.startHour, 0, 0, 0);
  const end = new Date(date);
  end.setHours(config.endHour, 0, 0, 0);

  for (let t = new Date(start); t < end; t = new Date(t.getTime() + config.slotMinutes * 60000)) {
    const startTime = new Date(t);
    const endTime = new Date(t.getTime() + config.slotMinutes * 60000);
    slots.push({ startTime, endTime });
  }
  return slots;
}

module.exports = { generateDailySlots };
