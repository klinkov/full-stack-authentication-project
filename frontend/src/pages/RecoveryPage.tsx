import { Form, Input, Button, Card, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useNavigate, Link } from 'react-router-dom';
import { authStore } from '../stores/authStore';

const RecoveryPage = observer(() => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string }) => {
    try {
      await authStore.requestPasswordReset(values.email);
      message.success('Password reset instructions have been sent to your email');
      navigate('/login');
    } catch {
      // Error is handled in the store
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card title="Password Recovery" style={{ width: 400 }}>
        <Form
          form={form}
          name="recovery"
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

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={authStore.isLoading} block>
              Send Reset Instructions
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            Remember your password? <Link to="/login">Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
});

export default RecoveryPage;