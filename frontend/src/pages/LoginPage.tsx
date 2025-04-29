import { Form, Input, Button, message } from 'antd';
import { observer } from 'mobx-react-lite';
import authStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const LoginPage = observer(() => {
    const navigate = useNavigate();

    const onFinish = async () => {
        try {
            await authStore.login();
            navigate('/account');
        } catch (error) {
            message.error('Login failed');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
            <h2>Login</h2>
            <Form onFinish={onFinish}>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Login
                    </Button>
                </Form.Item>
                <Button type="link" onClick={() => navigate('/recovery')}>
                    Forgot Password?
                </Button>
                <Button type="link" onClick={() => navigate('/register')}>
                    Register
                </Button>
            </Form>
        </div>
    );
});

export default LoginPage;