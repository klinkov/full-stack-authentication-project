import { observer } from 'mobx-react-lite';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import PaymentPage from './pages/PaymentPage';
import RecoveryPage from './pages/RecoveryPage';
import authStore from './store/authStore';
import PrivateRoute from './components/PrivateRoute';

const { Header, Content } = Layout;

const App = observer(() => {
    return (
        <Layout>
            <Header>
                <div>Talent Form</div>
                {authStore.isAuthenticated && (
                    <a onClick={() => authStore.logout()}>Logout</a>
                )}
            </Header>
            <Content>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/recovery" element={<RecoveryPage />} />
                    <Route
                        path="/account"
                        element={
                            <PrivateRoute>
                                <AccountPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/payment"
                        element={
                            <PrivateRoute>
                                <PaymentPage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Content>
        </Layout>
    );
});

export default App;