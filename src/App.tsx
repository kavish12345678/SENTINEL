import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/Login/LoginPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import UsersPage from './pages/Users/UsersPage';
import ActivityPage from './pages/Activity/ActivityPage';
import AlertsPage from './pages/Alerts/AlertsPage';
import InvestigationPage from './pages/Investigation/InvestigationPage';
import ResponseCenterPage from './pages/ResponseCenter/ResponseCenterPage';
import BehaviourAnalyticsPage from './pages/BehaviourAnalytics/BehaviourAnalyticsPage';
import SettingsPage from './pages/Settings/SettingsPage';

function ProtectedRoutes() {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/investigation" element={<InvestigationPage />} />
        <Route path="/response" element={<ResponseCenterPage />} />
        <Route path="/analytics" element={<BehaviourAnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
