import { Form, Input, Button, Card, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useNavigate, Link } from 'react-router-dom';
import { authStore } from '../stores/authStore';
import { useEffect } from 'react';
import '../assets/common.css';

const LoginPage = observer(() => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (authStore.isAuthenticated) {
      navigate('/profile');
    }
  }, [authStore.isAuthenticated, navigate]);

  const onFinish = async (values: { email: string; password: string; rememberMe: boolean }) => {
    try {
      await authStore.login(values.email, values.password, values.rememberMe);
      message.success('Login successful');
      navigate('/profile');
    } catch {
      // Error is handled in the store
    }
  };

  return (
    <div className="centerWidget">
      <Card title="Login" style={{ width: 400 }}>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="rememberMe" valuePropName="checked">
            <Input type="checkbox" /> Remember me
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={authStore.isLoading} block>
              Login
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Link to="/register">Register</Link> |{' '}
            <Link to="/recovery">Forgot Password?</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
});

export default LoginPage;