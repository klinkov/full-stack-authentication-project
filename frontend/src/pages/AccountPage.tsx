import { Form, Input, Button, Table, message } from 'antd';
import { observer } from 'mobx-react-lite';
import authStore from '../store/authStore';
import { useEffect, useState } from 'react';
import { http } from '../services/api';

interface Transaction {
    id: string;
    amount: number;
    type: string;
    description: string;
    created_at: string;
}

const AccountPage = observer(() => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await http.get('/users/me');
            setBalance(response.data.balance);
            setTransactions(response.data.transactions);
        } catch (error) {
            message.error('Failed to fetch user data');
        }
    };

    const onChangeEmail = async (values: { email: string }) => {
        try {
            await authStore.changeEmail(values.email);
            form.resetFields();
        } catch (error) {
            message.error('Failed to change email');
        }
    };

    const columns = [
        { title: 'Date', dataIndex: 'created_at', key: 'created_at' },
        { title: 'Amount', dataIndex: 'amount', key: 'amount' },
        { title: 'Type', dataIndex: 'type', key: 'type' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h2>Account</h2>
            <p>Email: {authStore.user?.email}</p>
            <p>Balance: ${balance}</p>
            <p>Roles: {authStore.roles.join(', ')}</p>

            <h3>Change Email</h3>
            <Form form={form} onFinish={onChangeEmail} layout="inline">
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' },
                    ]}
                >
                    <Input placeholder="New Email" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Change Email
                    </Button>
                </Form.Item>
            </Form>

            <h3>Change Password</h3>
            <Button onClick={() => authStore.changePassword()}>
                Change Password
            </Button>

            <h3>Transaction History</h3>
            <Table dataSource={transactions} columns={columns} rowKey="id" />
        </div>
    );
});

export default AccountPage;