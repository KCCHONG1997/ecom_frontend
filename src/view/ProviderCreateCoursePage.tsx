import React, { useState } from 'react';
import { Form, Input, Button, message, InputNumber, Select } from 'antd';


//interface object
interface userSessionObject {
  id: string,
  username: string,
  role: string,
} 

const ProviderCreateCoursePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  //to get the user information when loggin from the sessionstorage==>user is the object whenever a person login
  const userString = sessionStorage.getItem('user');
  //when you get the userstring is actually a string, so need to Json.parse to convert string into and object
  const user: userSessionObject | null = userString ? JSON.parse(userString) : null;
  //to get the value of the object attribute called user.id
  const user_id = user?.id;
  console.log(user_id);

  const onFinish = async (values: any) => {

    console.log("onFinish: ", values);
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/createCourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        message.success('Course created successfully!');
        form.resetFields();
      } else {
        message.error(data.error || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <h1>Create a New Course</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Creator ID - You might want to remove this field and get it from authentication */}
        <Form.Item
          name="creator_id"
          label="Creator ID"
          rules={[{ required: true, message: 'Please input creator ID!' }]}
          //to give the initial input field as user_id
          initialValue = {user_id}
          // to hide the form
          hidden
        >
          /*fetch user id from localstorage*/
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="name"
          label="Course Title"
          rules={[{ required: true, message: 'Please input course title!' }]}
        >
          <Input placeholder="Enter course title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Course Description"
          rules={[{ required: true, message: 'Please input course description!' }]}
        >
          <Input.TextArea rows={4} placeholder="Enter course description" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price (SGD)"
          rules={[{ required: true, message: 'Please input course price!' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="max_capacity"
          label="Maximum Capacity"
          rules={[{ required: true, message: 'Please input maximum capacity!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please enter a category!' }]}
        >
          <Input placeholder="Enter category" />
        </Form.Item>

        <Form.Item
          name="source"
          label="Course Source"
          rules={[{ required: true, message: 'Please select course source!' }]}
        >
          <Select placeholder="Select source">
            <Select.Option value="Internal">Internal</Select.Option>
            <Select.Option value="External">External</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="external_reference_number"
          label="External Reference Number"
        >
          <Input placeholder="Enter external reference number" />
        </Form.Item>

        <Form.Item
          name="training_provider_alias"
          label="Training Provider Alias"
          rules={[{ required: true, message: 'Please input provider alias!' }]}
        >
          <Input placeholder="Enter training provider alias" />
        </Form.Item>

        <Form.Item
          name="total_training_hours"
          label="Total Training Hours"
          rules={[{ required: true, message: 'Please input training hours!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="total_cost"
          label="Total Cost (SGD)"
          rules={[{ required: true, message: 'Please input total cost!' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="tile_image_url"
          label="Tile Image URL"
          rules={[{ required: true, message: 'Please input image URL!' }]}
        >
          <Input placeholder="Enter image URL (e.g., https://example.com/image.jpg)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Course
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProviderCreateCoursePage;