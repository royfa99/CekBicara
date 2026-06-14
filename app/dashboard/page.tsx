import React from 'react';
import Link from 'next/link';
import StatCards from '../../components/dashboard/StatCards';
import DevelopmentChart from '../../components/dashboard/DevelopmentChart';
import HistoryTable from '../../components/dashboard/HistoryTable';
import ReminderCard from '../../components/dashboard/ReminderCard';
import { createClient } from '../../utils/supabase/server';
import { logout } from '../login/actions';

export default async function Dashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const initial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <header className="dashboard-header fade-in">
        <div>
          <h1 className="dashboard-title">Halo, Ayah/Bunda! 👋</h1>
          <p className="subtitle" style={{ margin: '0', textAlign: 'left' }}>Pantau perkembangan bicara anak Anda di sini.</p>
        </div>
        <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/skrining" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '1rem', textDecoration: 'none' }}>
            + Skrining Baru
          </Link>
          <div className="avatar" title={user?.email} style={{ cursor: 'help' }}>{initial}</div>
          <form action={logout}>
            <button type="submit" className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.875rem' }}>
              Keluar
            </button>
          </form>
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
