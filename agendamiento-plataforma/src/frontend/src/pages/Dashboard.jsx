import React, { useEffect, useState } from 'react';
import { listAppointments, deleteAppointment } from '../services/apiClient';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await listAppointments(1);
        setItems(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const remove = async (id) => {
    await deleteAppointment(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {loading ? <p>Cargando...</p> : (
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id}>
                <td>{it.customerName}</td>
                <td>{it.customerPhone}</td>
                <td>{new Date(it.startTime).toLocaleString()}</td>
                <td>{new Date(it.endTime).toLocaleString()}</td>
                <td><button onClick={() => remove(it.id)}>Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
