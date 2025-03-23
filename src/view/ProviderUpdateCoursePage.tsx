import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Button, Modal, Form, Input, InputNumber, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Course {
  course_id: number;  // as returned from API
  creator_id: number;
  name: string;
  description: string;
  price: number;
  max_capacity: number;
  category: string;
  source: string;
  external_reference_number?: string;
  training_provider_alias: string;
  total_training_hours: number;
  total_cost: number;
  tile_image_url: string;
}

interface UserSessionObject {
  id: string;
  username: string;
  role: string;
}

const ProviderUpdateCoursePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Retrieve provider's session from sessionStorage
  const userString = sessionStorage.getItem('user');
  const user: UserSessionObject | null = userString ? JSON.parse(userString) : null;
  const user_id = user?.id;

  // Fetch courses created by the provider
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user_id) return;
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/providerCourses?creator_id=${user_id}`);
        const result = await response.json();
        if (response.ok) {
          setCourses(result.data);
        } else {
          message.error(result.error || 'Failed to fetch courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        message.error('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user_id]);

  // Handle selection of a course to update
  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    // Pre-populate the form with the selected course's data
    form.setFieldsValue({
      creator_id: course.creator_id,
      name: course.name,
      description: course.description,
      price: course.price,
      max_capacity: course.max_capacity,
      category: course.category,
      source: course.source,
      external_reference_number: course.external_reference_number,
      training_provider_alias: course.training_provider_alias,
      total_training_hours: course.total_training_hours,
      total_cost: course.total_cost,
      tile_image_url: course.tile_image_url,
    });
  };

  // Handle update submission
  const onFinish = async (values: any) => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/providerUpdateCourse/${selectedCourse.course_id}?creator_id=${user_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        }
      );
      const result = await response.json();
      if (response.ok) {
        message.success('Course updated successfully!');
        // Optionally, update the courses list or reset selection
        setSelectedCourse(null);
        // Refresh courses list:
        const coursesRes = await fetch(`http://localhost:5000/api/providerCourses?creator_id=${user_id}`);
        const coursesData = await coursesRes.json();
        if (coursesRes.ok) {
          setCourses(coursesData.data);
        }
      } else {
        message.error(result.error || 'Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      message.error('Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  // If a course is selected, display the update form
  if (selectedCourse) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
        <h1>Update Course</h1>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Hidden field for creator_id */}
          <Form.Item name="creator_id" label="Creator ID" hidden>
            <InputNumber />
          </Form.Item>

          <Form.Item name="name" label="Course Title" rules={[{ required: true, message: 'Please input course title!' }]}>
            <Input placeholder="Enter course title" />
          </Form.Item>

          <Form.Item name="description" label="Course Description" rules={[{ required: true, message: 'Please input course description!' }]}>
            <Input.TextArea rows={4} placeholder="Enter course description" />
          </Form.Item>

          <Form.Item name="price" label="Price (SGD)" rules={[{ required: true, message: 'Please input course price!' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="max_capacity" label="Maximum Capacity" rules={[{ required: true, message: 'Please input maximum capacity!' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please enter a category!' }]}>
            <Input placeholder="Enter category" />
          </Form.Item>

          <Form.Item name="source" label="Course Source" rules={[{ required: true, message: 'Please select course source!' }]}>
            <Select placeholder="Select source">
              <Select.Option value="Internal">Internal</Select.Option>
              <Select.Option value="External">External</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="external_reference_number" label="External Reference Number">
            <Input placeholder="Enter external reference number" />
          </Form.Item>

          <Form.Item name="training_provider_alias" label="Training Provider Alias" rules={[{ required: true, message: 'Please input provider alias!' }]}>
            <Input placeholder="Enter training provider alias" />
          </Form.Item>

          <Form.Item name="total_training_hours" label="Total Training Hours" rules={[{ required: true, message: 'Please input training hours!' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="total_cost" label="Total Cost (SGD)" rules={[{ required: true, message: 'Please input total cost!' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="tile_image_url" label="Tile Image URL" rules={[{ required: true, message: 'Please input image URL!' }]}>
            <Input placeholder="Enter image URL (e.g., https://example.com/image.jpg)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update Course
            </Button>
            <Button
              style={{ marginLeft: '8px' }}
              onClick={() => {
                setSelectedCourse(null);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  // Otherwise, display the list of courses with an "Update" button
  const columns = [
    {
      title: 'Course Title',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Course) => (
        <Button type="primary" onClick={() => handleSelectCourse(record)}>
          Update Course
        </Button>
      ),
    },
  ];

  if (loading) {
    return <Spin spinning={loading} size="large" />;
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      <h1>Your Courses</h1>
      <Table rowKey="course_id" dataSource={courses} columns={columns} />
    </div>
  );
};

export default ProviderUpdateCoursePage;
