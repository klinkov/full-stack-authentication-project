import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../stores/authStore';

const LogoutPage = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    authStore.logout();
    navigate('/login');
  }, [navigate]);

  return null;
});

export default LogoutPage;