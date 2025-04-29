import { Form, Input, Button, message } from 'antd';
import { observer } from 'mobx-react-lite';
import authStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const RegisterPage = observer(() => {
    const navigate = useNavigate();

    const onFinish = async () => {
        try {
            await authStore.register();
            message.success('Registration initiated. Please check your email.');
            navigate('/login');
        } catch (error) {
            message.error('Registration failed');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
            <h2>Register</h2>
            <Form onFinish={onFinish}>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Register
                    </Button>
                </Form.Item>
                <Button type="link" onClick={() => navigate('/login')}>
                    Already have an account? Login
                </Button>
            </Form>
        </div>
    );
});

export default RegisterPage;