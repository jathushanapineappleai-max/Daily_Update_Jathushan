import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import heroImg from '../assets/images/login_hero.png';
import logoImg from '../assets/images/Untitled-1-01 1.png';

import WelcomeSection from '../sections/Authentication/WelcomeSection';
import ForgotPasswordSection from '../sections/Authentication/ForgotPasswordSection';
import EnterOTPSection from '../sections/Authentication/EnterOTPSection';
import UpdatePasswordSection from '../sections/Authentication/UpdatePasswordSection';

export default function Login() {
  // Toggle layout mode: set to false to revert to previous fixed-canvas layout
  const USE_FLUID_LAYOUT = true;

  const navigate = useNavigate();
  const [view, setView] = useState('welcome');   // welcome | forgot | otp | update

  const [scale, setScale] = useState(1);
  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scaleW = vw / 1728;
      const scaleH = vh / 1117;
      const s = Math.min(1, scaleW, scaleH); // downscale if needed, never upscale
      setScale(s);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  /* ------------------------------------------------------------------ */
  /* Demo login – replace with real API later */
  const handleLogin = () => {
    localStorage.setItem(
      'demoUser',
      JSON.stringify({ name: 'Admin User', role: 'Administrator' })
    );
    navigate('/dashboard', { replace: true });
  };
  /* ------------------------------------------------------------------ */

  const renderRight = () => {
    switch (view) {
      case 'forgot':
        return (
          <ForgotPasswordSection
            onBack={() => setView('welcome')}
            onSendOTP={() => setView('otp')}
          />
        );
      case 'otp':
        return (
          <EnterOTPSection
            onBack={() => setView('forgot')}
            onVerify={() => setView('update')}
          />
        );
      case 'update':
        return (
          <UpdatePasswordSection
            onBack={() => setView('welcome')}
            onUpdated={() => setView('welcome')}
          />
        );
      case 'welcome':
      default:
        return (
          <WelcomeSection
            onLogin={handleLogin}
            onForgot={() => setView('forgot')}
          />
        );
    }
  };

  return (
    <div className={`login-root ${USE_FLUID_LAYOUT ? 'mode-fluid' : 'mode-fixed'}`}>
      <div className="login-stage" style={{ '--scale': USE_FLUID_LAYOUT ? 1 : scale }}>
        <div className="login-canvas">
          {/* ==================== LEFT SIDE ==================== */}
          <div className="login-left">
            <img src={heroImg} alt="" className="hero-img" />
            <div className="hero-overlay">
              <div className="hero-brand">
                <img src={logoImg} alt="PAI ERP logo" className="hero-logo" />
                <h1 className="hero-title">PAI ERP</h1>
              </div>
              <p className="hero-subtitle">
                Let’s empower your employees today.
              </p>
              <p className="hero-desc">
                We help to complete all your conveyancing needs easily
              </p>
            </div>
          </div>

          {/* ==================== RIGHT SIDE ==================== */}
          <div className={`login-right ${view === 'welcome' ? 'welcome-context' : view === 'forgot' ? 'forgot-context' : view === 'otp' ? 'otp-context' : view === 'update' ? 'update-context' : ''}`}>{renderRight()}</div>
        </div>
      </div>
    </div>
  );
}