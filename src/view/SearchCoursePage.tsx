import React, { useState, useMemo } from 'react';
import { Layout, Row, Col, Input, Card, Typography, List, Select, DatePicker } from 'antd';
import moment, { Moment } from 'moment';

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  category: string;
  provider: string;
  // Published date in "YYYY-MM-DD" format
  date: string;
};

const coursesData: Course[] = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Learn the basics of React including components, state, and props.',
    instructor: 'John Doe',
    duration: '4 weeks',
    category: 'Web Development',
    provider: 'Udemy',
    date: '2023-05-01',
  },
  {
    id: '2',
    title: 'Advanced TypeScript',
    description: 'Deep dive into advanced TypeScript concepts and best practices.',
    instructor: 'Jane Smith',
    duration: '6 weeks',
    category: 'Programming',
    provider: 'Coursera',
    date: '2023-06-15',
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn design principles, prototyping, and user research.',
    instructor: 'Alex Johnson',
    duration: '5 weeks',
    category: 'Design',
    provider: 'edX',
    date: '2023-07-10',
  },
  {
    id: '4',
    title: 'Full-Stack Web Development',
    description: 'Master both frontend and backend technologies in this comprehensive course.',
    instructor: 'Emily Davis',
    duration: '10 weeks',
    category: 'Web Development',
    provider: 'Udemy',
    date: '2023-05-20',
  },
  // Add more courses as needed
];

const SearchCoursePage: React.FC = () => {
  // Filter states
  const [filterText, setFilterText] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedProvider, setSelectedProvider] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Compute unique categories and providers for the filter dropdowns
  const categories = Array.from(new Set(coursesData.map(course => course.category)));
  const providers = Array.from(new Set(coursesData.map(course => course.provider)));

  // Filter courses based on the provided filters
  const filteredCourses = useMemo(() => {
    return coursesData.filter((course) => {
      const matchesText = course.title.toLowerCase().includes(filterText.toLowerCase());
      const matchesCategory = selectedCategory ? course.category === selectedCategory : true;
      const matchesProvider = selectedProvider ? course.provider === selectedProvider : true;
      const matchesDate = selectedDate 
        ? course.date === selectedDate.format('YYYY-MM-DD')
        : true;
      return matchesText && matchesCategory && matchesProvider && matchesDate;
    });
  }, [filterText, selectedCategory, selectedProvider, selectedDate]);

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <Row gutter={24}>
          {/* Left Side: Filter Controls & Course List */}
          <Col xs={24} lg={8} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <Card
              style={{ marginBottom: '16px' }}
              title="Filter Courses"
              bordered={false}
            >
              <Search
                placeholder="Search by course title"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{ marginBottom: '16px' }}
                enterButton
              />
              <Select
                placeholder="Filter by Category"
                style={{ width: '100%', marginBottom: '16px' }}
                allowClear
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
              >
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Filter by Provider"
                style={{ width: '100%', marginBottom: '16px' }}
                allowClear
                value={selectedProvider}
                onChange={(value) => setSelectedProvider(value)}
              >
                {providers.map((provider) => (
                  <Option key={provider} value={provider}>
                    {provider}
                  </Option>
                ))}
              </Select>
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Filter by Date"
                value={selectedDate || undefined}
                onChange={(date) => setSelectedDate(date)}
                format="YYYY-MM-DD"
              />
            </Card>
            <List
              itemLayout="vertical"
              dataSource={filteredCourses}
              renderItem={(course) => (
                <List.Item key={course.id}>
                  <Card
                    hoverable
                    onClick={() => setSelectedCourse(course)}
                    style={{
                      marginBottom: '12px',
                      border: selectedCourse?.id === course.id ? '2px solid #1890ff' : '',
                    }}
                  >
                    <Title level={5} style={{ marginBottom: '4px' }}>
                      {course.title}
                    </Title>
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {course.description}
                    </Paragraph>
                  </Card>
                </List.Item>
              )}
            />
          </Col>

          {/* Right Side: Course Details */}
          <Col xs={24} lg={16}>
            <Card bordered={false} style={{ minHeight: '80vh', padding: '24px' }}>
              {selectedCourse ? (
                <>
                  <Title level={3}>{selectedCourse.title}</Title>
                  <Paragraph>
                    <strong>Instructor:</strong> {selectedCourse.instructor}
                  </Paragraph>
                  <Paragraph>
                    <strong>Duration:</strong> {selectedCourse.duration}
                  </Paragraph>
                  <Paragraph>
                    <strong>Category:</strong> {selectedCourse.category}
                  </Paragraph>
                  <Paragraph>
                    <strong>Provider:</strong> {selectedCourse.provider}
                  </Paragraph>
                  <Paragraph>
                    <strong>Date:</strong> {selectedCourse.date}
                  </Paragraph>
                  <Paragraph>{selectedCourse.description}</Paragraph>
                </>
              ) : (
                <Paragraph type="secondary">
                  Please select a course from the left to view its details.
                </Paragraph>
              )}
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default SearchCoursePage;
