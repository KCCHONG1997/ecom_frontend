import React, { useEffect, useState } from 'react';
import { Table, message, Spin, Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
  max_capacity?: number;
  category?: string;
  // add additional fields as needed
}

interface UserSessionObject {
  id: string;
  username: string;
  role: string;
}

const ProviderViewCoursePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  // Retrieve the logged in provider's session from sessionStorage
  const userString = sessionStorage.getItem('user');
  const user: UserSessionObject | null = userString ? JSON.parse(userString) : null;
  const user_id = user?.id;
  const navigate = useNavigate();

  // Fetch courses for the provider using the new endpoint
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user_id) return;
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/providerCourses?creator_id=${user_id}`);
        const result = await response.json();
        console.log("Fetched courses:", result);
        if (response.ok) {
          // Adjust based on your API response structure (we're assuming { data: [...] })
          setCourses(result.data);
        } else {
          message.error(result.error || "Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        message.error("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user_id]);

  // Handle selection of a course to view its details
  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  // Return to the courses list view
  const handleBack = () => {
    setSelectedCourse(null);
  };

  if (loading) {
    return <Spin spinning={loading} size="large" />;
  }

  // If a course has been selected, show detailed course info
  if (selectedCourse) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
        <Button onClick={handleBack} style={{ marginBottom: 16 }}>
          Back to Courses
        </Button>
        <Card title={selectedCourse.name}>
          <p>
            <strong>Description:</strong> {selectedCourse.description}
          </p>
          <p>
            <strong>Price:</strong> ${selectedCourse.price}
          </p>
          {selectedCourse.max_capacity && (
            <p>
              <strong>Maximum Capacity:</strong> {selectedCourse.max_capacity}
            </p>
          )}
          {selectedCourse.category && (
            <p>
              <strong>Category:</strong> {selectedCourse.category}
            </p>
          )}
          {/* Insert additional detailed information or insights as needed */}
        </Card>
      </div>
    );
  }

  // Define columns for the courses table
  const columns = [
    {
      title: 'Course Title',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price (SGD)',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Course) => (
        <Button type="link" onClick={() => handleSelectCourse(record)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      <h1>Your Courses</h1>
      <Table rowKey="id" dataSource={courses} columns={columns} />
    </div>
  );
};

export default ProviderViewCoursePage;

