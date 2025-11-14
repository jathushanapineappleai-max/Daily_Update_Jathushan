import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    try { localStorage.removeItem('demoUser'); } catch (e) {}
    navigate('/login', { replace: true });
  }, [navigate]);
  return null;
}

