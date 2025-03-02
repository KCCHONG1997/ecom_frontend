import React, { useState } from 'react';
import { Button, Form, Input, Row, Col, message, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const RegistrationPage: React.FC = () => {
  // Handler for Learner registration form submission
  const onFinishLearner = (values: object) => {
    console.log('Learner Registration Success:', values);
    message.success('Learner Registration Successful!');
  };

  const onFinishFailedLearner = (errorInfo: object) => {
    console.error('Learner Registration Failed:', errorInfo);
    message.error('Please check your learner registration input!');
  };

  // Simulated API call to search organization by ID
  const fetchOrganizationById = (orgId: string): Promise<{ name: string; website: string } | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate a found organization for a specific ID (e.g., "ORG123")
        if (orgId === 'ORG123') {
          resolve({ name: 'Example Organization', website: 'https://example.org' });
        } else {
          resolve(null);
        }
      }, 1500);
    });
  };

  // Provider Registration Form Component
  const ProviderForm = () => {
    const [form] = Form.useForm();
    const [searching, setSearching] = useState(false);

    // Handler for Provider registration form submission
    const onFinishProvider = (values: object) => {
      console.log('Provider Registration Success:', values);
      message.success('Provider Registration Successful!');
    };

    const onFinishFailedProvider = (errorInfo: object) => {
      console.error('Provider Registration Failed:', errorInfo);
      message.error('Please check your provider registration input!');
    };

    // Handler to search for organization by ID
    const handleSearchOrg = async () => {
      try {
        const orgId = form.getFieldValue('organizationID');
        if (!orgId) {
          message.error('Please enter an Organization ID to search.');
          return;
        }
        setSearching(true);
        const orgData = await fetchOrganizationById(orgId);
        if (orgData) {
          // Autofill the organization-related fields
          form.setFieldsValue({
            organization: orgData.name,
            website: orgData.website,
          });
          message.success('Organization data found and autofilled!');
        } else {
          message.error('Organization ID not found.');
          // Optionally clear the fields if not found
          form.setFieldsValue({
            organization: '',
            website: '',
          });
        }
      } catch (error) {
        console.error('Error fetching organization:', error);
        message.error('Error searching for organization.');
      } finally {
        setSearching(false);
      }
    };

    return (
      <Form
        form={form}
        name="provider_registration_form"
        layout="vertical"
        onFinish={onFinishProvider}
        onFinishFailed={onFinishFailedProvider}
        style={{ maxWidth: '500px', width: '100%' }}
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
          rules={[
            { type: 'email', message: 'Please enter a valid email!' },
            { required: true, message: 'Email is required!' },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        {/* Organization ID with a Search Button */}
        <Form.Item label="LectureTeam ID" name="lectureTeamID">
          <Input
            placeholder="Enter your LectureTeam ID"
            addonAfter={
              <Button onClick={handleSearchOrg} loading={searching} icon={<SearchOutlined />} />
            }
          />
        </Form.Item>

        <Form.Item
          name="organization"
          label="Organization Name"
          rules={[{ required: true, message: 'Organization name is required!' }]}
        >
          <Input placeholder="Organization name will be autofilled if ID is found" />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[
            { required: true, message: 'Phone Number is required!' },
            { pattern: /^\d{8}$/, message: 'Phone Number must be 8 digits!' },
          ]}
        >
          <Input placeholder="Enter your phone number" />
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
            Register as Provider
          </Button>
        </Form.Item>
      </Form>
    );
  };

  // Learner Registration Form Component (unchanged)
  const LearnerForm = () => (
    <Form
      name="learner_registration_form"
      layout="vertical"
      onFinish={onFinishLearner}
      onFinishFailed={onFinishFailedLearner}
      style={{ maxWidth: '500px', width: '100%' }}
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
        rules={[
          { type: 'email', message: 'Please enter a valid email!' },
          { required: true, message: 'Email is required!' },
        ]}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        label="Phone Number"
        rules={[
          { required: true, message: 'Phone Number is required!' },
          { pattern: /^\d{8}$/, message: 'Phone Number must be 8 digits!' },
        ]}
      >
        <Input placeholder="Enter your phone number" />
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
          Register as Learner
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f2f5',
        padding: '20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <Tabs defaultActiveKey="learner" centered>
          <TabPane tab="Learner" key="learner">
            <LearnerForm />
          </TabPane>
          <TabPane tab="Provider" key="provider">
            <ProviderForm />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default RegistrationPage;
