import { Form, Input, Button, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { http } from '../services/api';

const PaymentPage = observer(() => {
    const [form] = Form.useForm();

    const onFinish = async (values: { amount: string }) => {
        try {
            await http.post('/payments', {
                amount: parseFloat(values.amount),
            });
            message.success('Payment processed successfully');
            form.resetFields();
        } catch (error) {
            message.error('Payment failed');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
            <h2>Make a Payment</h2>
            <Form form={form} onFinish={onFinish}>
                <Form.Item
                    name="amount"
                    rules={[
                        { required: true, message: 'Please input amount!' },
                        { pattern: /^\d+(\.\d{1,2})?$/, message: 'Please enter a valid amount!' },
                    ]}
                >
                    <Input placeholder="Amount" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Process Payment
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
});

export default PaymentPage;