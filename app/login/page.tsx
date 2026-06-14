import React from 'react';
import { login, signup } from './actions';
import Link from 'next/link';

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-color)',
      padding: '20px'
    }}>
      <div className="glass-panel fade-in" style={{
        maxWidth: '400px',
        width: '100%',
        padding: '40px',
        borderRadius: '24px',
        background: 'white',
        boxShadow: 'var(--shadow-lg)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '10px' }}>Cek Bicara</h1>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', marginBottom: '5px' }}>Masuk ke Akun Anda</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Simpan riwayat skrining dan pantau perkembangan anak secara aman.
          </p>
        </div>

        {searchParams?.message && (
          <div style={{ 
            padding: '12px', 
            background: '#fef2f2', 
            color: '#ef4444', 
            borderRadius: '8px', 
            marginBottom: '20px',
            fontSize: '0.9rem',
            border: '1px solid #fecaca',
            textAlign: 'center'
          }}>
            {searchParams.message}
          </div>
        )}
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-dark)' }}>Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              placeholder="bunda@example.com" 
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                outline: 'none',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-dark)' }}>Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              placeholder="Minimal 6 karakter" 
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                outline: 'none',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div style={{ marginTop: '10px' }}>
            <button formAction={login} className="btn btn-primary" style={{ width: '100%', marginBottom: '12px' }}>
              Masuk
            </button>
            <button formAction={signup} className="btn btn-secondary" style={{ width: '100%' }}>
              Daftar Akun Baru
            </button>
          </div>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link href="/" style={{ color: 'var(--text-light)', fontSize: '0.9rem', textDecoration: 'none' }}>
            &larr; Kembali ke Beranda
          </Link>
        </div>

      </div>
    </div>
  );
}
