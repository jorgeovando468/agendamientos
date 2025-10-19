import React, { useState } from 'react';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [page, setPage] = useState('booking');
  return (
    <div style={{ fontFamily: 'system-ui', padding: 16 }}>
      <header style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setPage('booking')}>Reservar</button>
        <button onClick={() => setPage('dashboard')}>Dashboard</button>
      </header>
      {page === 'booking' ? <Booking /> : <Dashboard />}
    </div>
  );
}
