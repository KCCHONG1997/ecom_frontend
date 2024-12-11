import React from 'react';
import { Button, Form, Input, Row, Col, message } from 'antd';

const RegistrationPage: React.FC = () => {
  const onFinish = (values: object) => {
    console.log('Success:', values);
    message.success('Registration Successful!');
  };

  const onFinishFailed = (errorInfo: object) => {
    console.error('Failed:', errorInfo);
    message.error('Please check your input!');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        background: '#f0f2f5', // Optional background color
        padding: '20px', // For responsiveness on smaller screens
      }}
    >
      <Form
        name="registration_form"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ maxWidth: '500px', width: '100%' }} // Center and limit width
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'First Name is required!' }]}
            >
              <Input placeholder="Enter your first name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Last Name is required!' }]}
            >
              <Input placeholder="Enter your last name" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: 'email', message: 'Please enter a valid email!' }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Password is required!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm your password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegistrationPage;
