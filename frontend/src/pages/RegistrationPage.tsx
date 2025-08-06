import {Form, Input, Button, Card, message} from 'antd';
import {observer} from 'mobx-react-lite';
import {useNavigate, Link} from 'react-router-dom';
import {authStore} from '../stores/authStore';
import '../assets/common.css';

const RegistrationPage = observer(() => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }) => {
        try {
            await authStore.register(
                values.email,
                values.password,
                values.firstName,
                values.lastName
            );
            message.success('Registration successful');
            navigate('/profile');
        } catch {
            // Error is handled in the store
        }
    };

    return (
        <div className="centerWidget">
            <Card title="Register" style={{width: 400}}>
                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{required: true, message: 'Please input your first name!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{required: true, message: 'Please input your last name!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {required: true, message: 'Please input your email!'},
                            {type: 'email', message: 'Please enter a valid email!'}
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {required: true, message: 'Please input your password!'},
                            {min: 8, message: 'Password must be at least 8 characters!'}
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            {required: true, message: 'Please confirm your password!'},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={authStore.isLoading} block>
                            Register
                        </Button>
                    </Form.Item>

                    <div style={{textAlign: 'center'}}>
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
});

export default RegistrationPage;