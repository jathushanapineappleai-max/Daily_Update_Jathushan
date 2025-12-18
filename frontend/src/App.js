import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
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
import Logout from './pages/Logout';

// New Page Added
import OrganizationalHierarchy from './pages/OrganizationalHierarchy';
import EmployeeOverview from './pages/EmployeeOverview';
import EditEmployee from './pages/EditEmployee';
import NewEmployee from './pages/NewEmployee';
import AddEmployeeStep2 from './pages/AddEmployeeStep2';
import AddEmployeeStep3 from './pages/AddEmployeeStep3';

function AppShell() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const hideChrome = location.pathname.startsWith('/login') || location.pathname.startsWith('/logout');

  return (
    <div className="app-container">
      {!hideChrome && (
        <>
          <Sidebar isOpen={isSidebarOpen} onNavigate={() => setSidebarOpen(false)} />
          {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        </>
      )}
      <div className={`main-content ${hideChrome ? 'no-chrome' : ''}`}>
        {!hideChrome && <Header onToggleSidebar={() => setSidebarOpen((v) => !v)} />}
        <div className={`page-content ${hideChrome ? 'page-content--full' : ''}`}>
          <Routes>
            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Admin Routes */}
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/new" element={<NewEmployee />} />
            <Route path="/employees/step2" element={<AddEmployeeStep2 />} />
            <Route path="/employees/step3" element={<AddEmployeeStep3 />} />
            <Route path="/employees/:id" element={<EmployeeProfilePage />} />
            <Route path="/employees/:id/overview" element={<EmployeeOverview />} />
            <Route path="/employees/:id/edit" element={<EditEmployee />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/leave" element={<LeavePage />} />
            <Route path="/recruitment" element={<RecruitmentPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/templates" element={<TemplatesPage />} />

            {/* New Route Added */}
            <Route path="/org-hierarchy" element={<OrganizationalHierarchy />} />

            {/* Staff Self-Service Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/my-attendance" element={<Attendence />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;