import { observer } from 'mobx-react-lite';
import { Navigate } from 'react-router-dom';
import authStore from '../store/authStore';
import { ReactNode } from 'react';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute = observer(({ children }: PrivateRouteProps) => {
    return authStore.isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
});

export default PrivateRoute;