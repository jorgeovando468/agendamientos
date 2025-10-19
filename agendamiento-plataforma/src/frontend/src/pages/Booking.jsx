import React, { useEffect, useState } from 'react';
import { fetchAvailability, createAppointment } from '../services/apiClient';

export default function Booking() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await fetchAvailability(new Date(date).toISOString());
        setSlots(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [date]);

  const submit = async (slot) => {
    if (!name || !phone) return setMessage('Completa nombre y teléfono');
    try {
      await createAppointment({
        ownerId: 1,
        customerName: name,
        customerPhone: phone,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
      setMessage('Reserva creada. Revisa tu WhatsApp para confirmación.');
    } catch (e) {
      setMessage(e?.response?.data?.error || 'Error al reservar');
    }
  };

  return (
    <div>
      <h2>Reservar cita</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Teléfono (E.164)" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>
      {loading ? <p>Cargando...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
          {slots.map((s, idx) => (
            <button key={idx} onClick={() => submit(s)}>
              {new Date(s.startTime).toLocaleTimeString()} - {new Date(s.endTime).toLocaleTimeString()}
            </button>
          ))}
          {slots.length === 0 && <p>No hay disponibilidad</p>}
        </div>
      )}
      {message && <p style={{ marginTop: 8 }}>{message}</p>}
    </div>
  );
}
