import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Course {
  course_id: number; // updated field name
  name: string;
  description: string;
  price: number;
  // Add additional fields as needed
}

interface UserSessionObject {
  id: string;
  username: string;
  role: string;
}

const ProviderDeleteCoursePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Retrieve the logged in provider's session from sessionStorage
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
        console.log("Fetched courses:", result); // Check the data structure in console
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

  // Handle deletion of a course using the new endpoint
  const handleDeleteCourse = (courseId: number) => {
    console.log("Attempting to delete course with ID:", courseId);
    if (!courseId) {
      message.error("Course ID is undefined");
      return;
    }
    Modal.confirm({
      title: 'Are you sure you want to delete this course?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/providerDeleteCourse/${courseId}?creator_id=${user_id}`,
            {
              method: 'DELETE',
            }
          );
          const result = await response.json();
          if (response.ok) {
            message.success('Course deleted successfully!');
            // Remove the deleted course from the state
            setCourses(prev => prev.filter(course => course.course_id !== courseId));
          } else {
            message.error(result.error || 'Failed to delete course');
          }
        } catch (error) {
          console.error('Error deleting course:', error);
          message.error('Failed to delete course');
        }
      },
    });
  };

  if (loading) {
    return <Spin spinning={loading} size="large" />;
  }

  // Define table columns for displaying courses
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
        <Button type="primary" danger onClick={() => handleDeleteCourse(record.course_id)}>
          Delete Course
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      <h1>Delete Your Courses</h1>
      <Table rowKey="course_id" dataSource={courses} columns={columns} />
    </div>
  );
};

export default ProviderDeleteCoursePage;



