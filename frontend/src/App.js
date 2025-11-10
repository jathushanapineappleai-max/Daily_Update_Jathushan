import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import AdminDashboard from './pages/AdminDashboard';
import EmployeesPage from './pages/EmployeesPage';
import AttendancePage from './pages/AttendancePage';
import LeavePage from './pages/LeavePage';
import RecruitmentPage from './pages/RecruitmentPage';
import ReportsPage from './pages/ReportsPage';
import EmployeeProfilePage from './pages/EmployeeProfilePage';
import Profile from './pages/Profile';
import Leaves from './pages/Leaves';
import Attendence from './pages/Attendence';
import Login from './pages/Login';
import TemplatesPage from './pages/TemplatesPage';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isAuthed = typeof window !== 'undefined' && !!localStorage.getItem('demoUser');

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        <div className="main-content">
          <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />
          <div className="page-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to={isAuthed ? "/dashboard" : "/login"} replace />} />

              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/:id" element={<EmployeeProfilePage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/leave" element={<LeavePage />} />
              <Route path="/recruitment" element={<RecruitmentPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/templates" element={<TemplatesPage />} />

              {/* Staff self-service routes */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/leaves" element={<Leaves />} />
              <Route path="/my-attendance" element={<Attendence />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

