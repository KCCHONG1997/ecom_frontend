import React, { useEffect, useState } from 'react';
import { Layout, Form, Button, message, Row, Col, Card, Skeleton, Descriptions } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

interface Course {
  course_id: number;
  name: string;
  description: string;
  price: number;
  max_capacity: number;
  category: string;
  source: 'internal' | 'myskillsfuture';
  external_reference_number?: string;
  training_provider_alias?: string;
  total_training_hours?: number;
  total_cost?: number;
  tile_image_url?: string;
  enrollmentCount?: number;
}

const { Header, Content } = Layout;

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const courseId = parseInt(id);
      fetchCourseDetail(courseId);
    }
  }, [id]);

  const fetchCourseDetail = async (courseId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/getCourse/${courseId}`);
      const data = await response.json();
      if (response.ok) {
        // Assuming the API returns the course data in data.courseData
        setCourse(data.courseData);
        form.setFieldsValue(data.courseData);
      } else {
        message.error(data.error || 'Failed to fetch course details');
      }
    } catch (error) {
      message.error('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#fff', padding: '0 24px' }}>
        <h1 style={{ margin: 0 }}>Course Details</h1>
      </Header>
      <Content style={{ margin: '24px' }}>
        {loading ? (
          <Skeleton active />
        ) : course ? (
          <>
            {/* Hero Banner */}
            <div
              style={{
                backgroundImage: `url(${course.tile_image_url || 'https://via.placeholder.com/1200x300'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '80px 24px',
                marginBottom: '24px',
                color: '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              }}
            >
              <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{course.name}</h2>
              <p style={{ fontSize: '1.2rem', marginTop: '8px' }}>{course.category}</p>
            </div>
            <Row gutter={[24, 24]}>
              {/* Course Overview */}
              <Col xs={24} md={16}>
                <Card bordered={false}>
                  <h3>Description</h3>
                  <p>{course.description}</p>
                  <h3 style={{ marginTop: '24px' }}>Course Details</h3>
                  <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="Price">${course.price}</Descriptions.Item>
                    <Descriptions.Item label="Max Capacity">{course.max_capacity}</Descriptions.Item>
                    <Descriptions.Item label="Total Training Hours">
                      {course.total_training_hours}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Cost">${course.total_cost}</Descriptions.Item>
                    <Descriptions.Item label="Source">{course.source}</Descriptions.Item>
                    {course.external_reference_number && (
                      <Descriptions.Item label="External Ref No">
                        {course.external_reference_number}
                      </Descriptions.Item>
                    )}
                    {course.training_provider_alias && (
                      <Descriptions.Item label="Provider Alias">
                        {course.training_provider_alias}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>
              </Col>
              {/* Enrollment Count */}
              <Col xs={24} md={8}>
                <Card bordered={false} style={{ textAlign: 'center', padding: '24px' }}>
                  <UserOutlined style={{ fontSize: '3rem', color: '#1890ff' }} />
                  <h3 style={{ marginTop: '16px' }}>Enrolled Students</h3>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                    {course.enrollmentCount}
                  </p>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <div>No course data found.</div>
        )}
      </Content>
    </Layout>
  );
};

export default CourseDetailPage;
