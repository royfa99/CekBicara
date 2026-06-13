import React from 'react';

export default function ReminderCard() {
  return (
    <div className="dash-card reminder-card col-span-4">
      <div className="reminder-icon">⏰</div>
      <div className="reminder-content">
        <h4>Reminder Evaluasi Ulang</h4>
        <p>Jadwal evaluasi ulang untuk <strong>Budi</strong> adalah 12 Juli 2026 (1 bulan lagi).</p>
        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.875rem' }}>
          Jadwalkan di Kalender
        </button>
      </div>
    </div>
  );
}
