import React from 'react';
import Link from 'next/link';
import './Header.css';

export default function Header() {
  return (
    <header className="main-header">
      <div className="container header-container">
        <Link href="/" className="logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">Cek Bicara</span>
        </Link>
        
        <nav className="header-nav">
          <Link href="/login" className="btn btn-secondary nav-login-btn">
            Masuk / Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
