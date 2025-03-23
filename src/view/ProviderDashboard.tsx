import React, { useEffect, useState } from 'react';
import { Layout, Tabs, Card, Table, Button, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getUserFromSession } from '../utils/sessionUtils';

interface Course {
  course_id: number;
  name: string;
}

interface Enrollment {
  enrollment_id: number;
  course_id: number;
  completion_percentage: string;
  is_kicked: number;
  enrolled_at: string;
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  cover_image_url?: string;
  profile_image_url?: string;
  occupation?: string;
  company_name?: string;
  course_name: string;
}

const { Header, Content } = Layout;

const ProviderDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Retrieve provider id from session
  const providerId = getUserFromSession().id;
  console.log('Provider ID:', providerId);

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      console.log("Fetching courses for provider id:", providerId);
      const response = await fetch(`http://localhost:5000/api/providerCourses?id=${providerId}`);
      const data = await response.json();
      if (response.ok) {
        setCourses(data.data);
      } else {
        message.error(data.error || 'Failed to fetch courses');
      }
    } catch (error) {
      message.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      // This endpoint fetches all enrolled student details for courses created by the provider.
      const response = await fetch(`http://localhost:5000/api/providerEnrollments?creator_id=${providerId}`);
      const data = await response.json();
      console.log("Enrollments data:", data);
      if (response.ok) {
        setEnrollments(data.data);
      } else {
        message.error(data.error || 'Failed to fetch enrollments');
      }
    } catch (error) {
      message.error('Failed to fetch enrollments');
    }
  };

  const handleDeleteCourse = (courseId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this course?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/deleteCourse/${courseId}?creator_id=${providerId}`, {
            method: 'DELETE',
          });
          const data = await response.json();
          if (response.ok) {
            message.success('Course deleted successfully');
            setCourses(prev => prev.filter(course => course.course_id !== courseId));
          } else {
            message.error(data.error || 'Failed to delete course');
          }
        } catch (error) {
          message.error('Failed to delete course');
        }
      },
    });
  };

  const columnsCourses = [
    {
      title: 'Course ID',
      dataIndex: 'course_id',
      key: 'course_id',
    },
    {
      title: 'Course Title',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Course) => (
        <a onClick={() => navigate(`/course-detail/${record.course_id}`)}>{text}</a>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Course) => (
        <>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => navigate(`/course-detail/${record.course_id}`)}
          >
            Update
          </Button>
          <Button danger onClick={() => handleDeleteCourse(record.course_id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const columnsEnrollments = [
    {
      title: 'Enrollment ID',
      dataIndex: 'enrollment_id',
      key: 'enrollment_id',
    },
    {
      title: 'Learner ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: 'Learner Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Course',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Status',
      dataIndex: 'is_kicked',
      key: 'is_kicked',
      render: (isKicked: number) => (isKicked ? 'kicked' : 'enrolled'),
    },
    {
      title: 'Enrollment Date',
      dataIndex: 'enrolled_at',
      key: 'enrolled_at',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#fff', padding: '0 24px' }}>
        <h1 style={{ margin: 0 }}>Provider Management Dashboard</h1>
      </Header>
      <Content style={{ margin: '24px' }}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="My Courses" key="1">
            <Card title="Course List" bordered={false}>
              <Table
                rowKey="course_id"
                dataSource={courses}
                columns={columnsCourses}
                loading={loading}
              />
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Enrollments" key="2">
            <Card title="Learner Enrollments" bordered={false}>
              <Table
                rowKey="enrollment_id"
                dataSource={enrollments}
                columns={columnsEnrollments}
              />
            </Card>
          </Tabs.TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default ProviderDashboard;
