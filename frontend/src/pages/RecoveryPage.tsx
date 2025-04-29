import { Form, Input, Button, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

const RecoveryPage = observer(() => {
    const navigate = useNavigate();

    const onFinish = async (values: { email: string }) => {
        try {
            // Note: Keycloak handles password recovery via its UI or API.
            // This is a placeholder for triggering a recovery email.
            // In a real implementation, you might call a backend endpoint or Keycloak API.
            message.success('Password recovery email sent. Please check your inbox.');
            navigate('/login');
        } catch (error) {
            message.error('Failed to send recovery email');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
            <h2>Password Recovery</h2>
            <Form onFinish={onFinish}>
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Send Recovery Email
                    </Button>
                </Form.Item>
                <Button type="link" onClick={() => navigate('/login')}>
                    Back to Login
                </Button>
            </Form>
        </div>
    );
});

export default RecoveryPage;