import {Form, Input, Button, Card, Tabs, message} from 'antd';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';
import {authStore} from '../stores/authStore';
import {useEffect} from 'react';
import '../assets/common.css';

const ProfilePage = observer(() => {
    const navigate = useNavigate();
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    useEffect(() => {
        if (!authStore.isAuthenticated) {
            // navigate('/login');
        } else {
            profileForm.setFieldsValue({
                name: authStore.user?.name,
                email: authStore.user?.email,
            });
        }
    }, [authStore.isAuthenticated, authStore.user, navigate, profileForm]);

    const onProfileFinish = async (values: { name: string; email: string }) => {
        try {
            await authStore.updateProfile(values.name, values.email);
            message.success('Profile updated successfully');
        } catch {
            // Error is handled in the store
        }
    };

    const onPasswordFinish = async (values: { currentPassword: string; newPassword: string }) => {
        try {
            await authStore.changePassword(values.currentPassword, values.newPassword);
            message.success('Password changed successfully');
            passwordForm.resetFields();
        } catch {
            // Error is handled in the store
        }
    };

    const items = [
        {
            key: '1',
            label: 'Profile Information',
            children: (
                <Form
                    form={profileForm}
                    name="profile"
                    onFinish={onProfileFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{required: true, message: 'Please input your name!'}]}
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

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={authStore.isLoading}>
                            Update Profile
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            key: '2',
            label: 'Change Password',
            children: (
                <Form
                    form={passwordForm}
                    name="password"
                    onFinish={onPasswordFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Current Password"
                        name="currentPassword"
                        rules={[{required: true, message: 'Please input your current password!'}]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            {required: true, message: 'Please input your new password!'},
                            {min: 8, message: 'Password must be at least 8 characters!'}
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item
                        label="Confirm New Password"
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            {required: true, message: 'Please confirm your new password!'},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
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
                        <Button type="primary" htmlType="submit" loading={authStore.isLoading}>
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
    ];

    return (
        <div className="centerWidget">
            <Card title="Profile Settings">
                <Tabs defaultActiveKey="1" items={items}/>
            </Card>
        </div>
    );
});

export default ProfilePage;