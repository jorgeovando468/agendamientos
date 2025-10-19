const { Appointment, User } = require('../models');
const { generateDailySlots } = require('../utils/availability');
const { Op } = require('sequelize');
const { sendWhatsAppText } = require('../services/whatsappService');

async function list(req, res, next) {
  try {
    const ownerId = Number(req.query.ownerId) || 1;
    const items = await Appointment.findAll({ where: { ownerId }, order: [['startTime', 'ASC']] });
    res.json(items);
  } catch (e) { next(e); }
}

async function create(req, res, next) {
  try {
    const { ownerId = 1, customerName, customerPhone, startTime, endTime, notes } = req.body;
    if (!customerName || !customerPhone || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const overlap = await Appointment.findOne({
      where: {
        ownerId,
        [Op.or]: [
          { startTime: { [Op.between]: [new Date(startTime), new Date(endTime)] } },
          { endTime: { [Op.between]: [new Date(startTime), new Date(endTime)] } },
          {
            startTime: { [Op.lte]: new Date(startTime) },
            endTime: { [Op.gte]: new Date(endTime) },
          },
        ],
      },
    });
    if (overlap) return res.status(409).json({ error: 'Time slot unavailable' });

    const appt = await Appointment.create({ ownerId, customerName, customerPhone, startTime, endTime, notes });

    // WhatsApp confirmation (best-effort)
    try {
      await sendWhatsAppText(customerPhone, `Hola ${customerName}, tu cita fue confirmada para ${new Date(startTime).toLocaleString()}.`);
    } catch (_) {}

    res.status(201).json(appt);
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    const appt = await Appointment.findByPk(id);
    if (!appt) return res.status(404).json({ error: 'Not found' });
    await appt.destroy();
    res.json({ deleted: true });
  } catch (e) { next(e); }
}

async function availability(req, res, next) {
  try {
    const ownerId = Number(req.query.ownerId) || 1;
    const date = req.query.date || new Date().toISOString();
    const slots = generateDailySlots(date);

    const dayStart = new Date(date); dayStart.setHours(0,0,0,0);
    const dayEnd = new Date(date); dayEnd.setHours(23,59,59,999);

    const appts = await Appointment.findAll({
      where: { ownerId, startTime: { [Op.between]: [dayStart, dayEnd] } },
    });

    const busy = appts.map(a => ({ start: new Date(a.startTime).getTime(), end: new Date(a.endTime).getTime() }));

    const available = slots.filter(s => {
      const sStart = s.startTime.getTime();
      const sEnd = s.endTime.getTime();
      return !busy.some(b => !(sEnd <= b.start || sStart >= b.end));
    });

    res.json(available.map(s => ({ startTime: s.startTime, endTime: s.endTime })));
  } catch (e) { next(e); }
}

module.exports = { list, create, remove, availability };
