import React, { useState } from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, Spin } from 'antd';
import { showSuccessMessage, showErrorMessage } from '../utils/messageUtils';
import { useNavigate } from 'react-router-dom';
import PORT from '../hooks/usePort';

type FieldType = {
    username: string;
    password: string;
    remember?: boolean;
};

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const onLoginSuccess = () => {
        window.location.reload();
    };
    const [isLoading, setIsLoading] = useState(false);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:${PORT}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: values.username,
                    password: values.password,
                }),
            });

            const jsonData = await response.json();

            if (!response.ok) {
                showErrorMessage(`Login Failed: ${jsonData.error || 'Unknown error'}`);
                return;
            }

            sessionStorage.setItem('user', JSON.stringify(jsonData.user));

            showSuccessMessage('Successfully logged in!');
            navigate('/');
            window.location.reload();
        } catch (error) {
            showErrorMessage('Failed to connect to the server.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Form submission failed:', errorInfo);
    };

    

    //shawn added for conditonal render the nav bar
    const handleLogin = (role: string) => {
        sessionStorage.setItem("userRole", role); // Store user role
        window.location.reload(); // Reload to update NavBar
      };

    return (
        <Spin spinning={isLoading} size="large">
            <section style={{ justifyContent: 'center', display: 'flex', padding: '20px' }}>
                <Form<FieldType>
                    name="login"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600, margin: '50px' }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Username or Email"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username or email!' }]}
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

                    <Form.Item<FieldType> name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Submit
                        </Button>
                    </Form.Item>

                
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button onClick={() => handleLogin('producer')} style={{ marginRight: '10px' }}>
                            Simulate Producer Login
                        </Button>
                        <Button onClick={() => handleLogin('learner')}>
                            Simulate Learner Login
                        </Button>
                    </Form.Item>


                    
                </Form>
            </section>
        </Spin>
    );
};

export default LoginPage;
