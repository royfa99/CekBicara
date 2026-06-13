import React from 'react';
import StatCards from '../../components/dashboard/StatCards';
import DevelopmentChart from '../../components/dashboard/DevelopmentChart';
import HistoryTable from '../../components/dashboard/HistoryTable';
import ReminderCard from '../../components/dashboard/ReminderCard';

export default function Dashboard() {
  return (
    <>
      <header className="dashboard-header fade-in">
        <div>
          <h1 className="dashboard-title">Halo, Ibu Sarah! 👋</h1>
          <p className="subtitle" style={{ margin: '0', textAlign: 'left' }}>Pantau perkembangan bicara anak Anda di sini.</p>
        </div>
        <div className="user-profile">
          <button className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '1rem' }}>
            + Skrining Baru
          </button>
          <div className="avatar">S</div>
        </div>
      </header>

      <div className="dashboard-grid fade-in" style={{ animationDelay: '0.1s' }}>
        <StatCards />
      </div>

      <div className="dashboard-grid fade-in" style={{ animationDelay: '0.2s' }}>
        <DevelopmentChart />
        <ReminderCard />
      </div>

      <div className="dashboard-grid fade-in" style={{ animationDelay: '0.3s' }}>
        <HistoryTable />
      </div>
    </>
  );
}
