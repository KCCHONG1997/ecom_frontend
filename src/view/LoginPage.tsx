import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { showSuccessMessage, showErrorMessage } from '../utils/messageUtils';
// import dotenv from 'dotenv';
// dotenv.config();

//Copy from here: https://ant.design/components/form
type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

const PORT =
process.env.NODE_ENV === 'production'
    ? `${process.env.REACT_APP_BACKEND_PROD_PORT}`
    : `${process.env.REACT_APP_BACKEND_DEV_PORT}`;
console.log("API Base URL:", PORT);

const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
        // Fetch and parse the response in one step
        const response = await fetch(`http://localhost:${PORT}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: values.username,
                password: values.password,
            }),
        });

        const jsonData = await response.json();

        if (!response.ok) {
            showErrorMessage("Login Failed: " + jsonData.error);
            return;
        }

        // Handle success
        console.log('Response from server:', jsonData.message);
        showSuccessMessage("Successfully Login!");
    } catch (error) {
        showErrorMessage("Failed to connect to the server.");
        console.error('Error:', error);
    }
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const LoginPage: React.FC = () => (
    <section
        style={{ justifyContent: 'center', display: 'flex' }}
    >
        <Form
            name="basic"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600, margin: '50px' }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item<FieldType>
                label="Username or email"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    </section>
);

export default LoginPage;