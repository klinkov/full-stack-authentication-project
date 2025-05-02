import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from './stores/authStore';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ProfilePage from './pages/ProfilePage';
import RecoveryPage from './pages/RecoveryPage';
import LogoutPage from './pages/LogoutPage';
import { ConfigProvider } from 'antd';

const App = observer(() => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              authStore.isAuthenticated ? (
                <Navigate to="/profile" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              authStore.isAuthenticated ? (
                <Navigate to="/profile" replace />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/register"
            element={
              authStore.isAuthenticated ? (
                <Navigate to="/profile" replace />
              ) : (
                <RegistrationPage />
              )
            }
          />
          <Route
            path="/profile"
            element={
              authStore.isAuthenticated ? (
                <ProfilePage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/recovery"
            element={
              authStore.isAuthenticated ? (
                <Navigate to="/profile" replace />
              ) : (
                <RecoveryPage />
              )
            }
          />
          <Route path="/logout" element={<LogoutPage />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
});

export default App;
