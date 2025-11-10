import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    try {
      localStorage.setItem('demoUser', JSON.stringify({ name: 'Admin User', role: 'Administrator' }));
    } catch (e) {
      // ignore storage errors in demo
    }
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '16px' }}>Login</h1>
      <button type="button" className="btn btn-success" onClick={handleDemoLogin}>
        Login as Demo
      </button>
    </div>
  );
}
