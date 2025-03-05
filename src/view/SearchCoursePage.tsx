import React, { useState, useMemo } from 'react';
import { Layout, Row, Col, Input, Card, Typography, List, Select, DatePicker, Button, Rate, Modal, message } from 'antd';
import { ShoppingCartOutlined, StarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
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
  price: number;
  reviews?: Review[];
};

type Review = {
  reviewId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
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
    price: 49.99,
    reviews: [
      {
        reviewId: 'r1',
        userId: 'user1',
        userName: 'Sarah Johnson',
        rating: 4,
        comment: 'Great introduction to React! Very clear explanations.',
        date: '2023-06-15'
      },
      {
        reviewId: 'r2',
        userId: 'user2',
        userName: 'Michael Chen',
        rating: 5,
        comment: 'Excellent course for beginners. Highly recommended!',
        date: '2023-07-02'
      }
    ]
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
    price: 79.99,
    reviews: []
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
    price: 59.99,
    reviews: []
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
    price: 99.99,
    reviews: []
  },
  {
    id: '5',
    title: 'Introduction to Python',
    description: 'Learn the fundamentals of Python programming language in this beginner-friendly course.',
    instructor: 'David Wilson',
    duration: '3 weeks',
    category: 'Programming',
    provider: 'Codecademy',
    date: '2023-08-05',
    price: 0,
    reviews: []
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
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  
  const navigate = useNavigate();

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

  const handleEnroll = (course: Course) => {
    localStorage.setItem('selectedCourse', JSON.stringify(course));
    navigate('/checkout');
  };

  const handleSubmitReview = () => {
    if (!selectedCourse) return;
    
    if (userRating === 0) {
      message.error('Please provide a rating');
      return;
    }

    const newReview: Review = {
      reviewId: `r${Date.now()}`,
      userId: 'currentUser',
      userName: 'Current User',
      rating: userRating,
      comment: reviewComment,
      date: moment().format('YYYY-MM-DD')
    };

    const updatedCourses = coursesData.map(course => {
      if (course.id === selectedCourse.id) {
        return {
          ...course,
          reviews: [...(course.reviews || []), newReview]
        };
      }
      return course;
    });

    const updatedCourse = updatedCourses.find(c => c.id === selectedCourse.id);
    if (updatedCourse) {
      setSelectedCourse(updatedCourse);
    }
    
    setReviewModalVisible(false);
    setUserRating(0);
    setReviewComment('');
    
    message.success('Review submitted successfully');
  };

  const getAverageRating = (course: Course) => {
    if (!course.reviews || course.reviews.length === 0) return 0;
    
    const sum = course.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / course.reviews.length;
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <Row gutter={24}>
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
                    <Title level={5}>{course.title}</Title>
                    <Paragraph ellipsis={{ rows: 2 }}>{course.description}</Paragraph>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text type="secondary">{course.provider}</Text>
                      <Text strong>{course.price === 0 ? 'Free' : `$${course.price}`}</Text>
                    </div>
                    <div>
                      <Rate disabled defaultValue={getAverageRating(course)} />
                      <Text type="secondary"> ({course.reviews?.length || 0} reviews)</Text>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Col>

          <Col xs={24} lg={16}>
            <Card bordered={false} style={{ minHeight: '80vh', padding: '24px' }}>
              {selectedCourse ? (
                <>
                  <Title level={3}>{selectedCourse.title}</Title>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <Rate disabled value={getAverageRating(selectedCourse)} />
                      <Text style={{ marginLeft: '8px' }}>
                        ({selectedCourse.reviews?.length || 0} reviews)
                      </Text>
                    </div>
                    <Title level={4}>{selectedCourse.price === 0 ? 'Free' : `$${selectedCourse.price}`}</Title>
                  </div>
                  
                  <Paragraph>{selectedCourse.description}</Paragraph>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <Text strong>Instructor:</Text> {selectedCourse.instructor}
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <Text strong>Duration:</Text> {selectedCourse.duration}
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <Text strong>Category:</Text> {selectedCourse.category}
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <Text strong>Provider:</Text> {selectedCourse.provider}
                  </div>
                  <div style={{ marginBottom: '24px' }}>
                    <Text strong>Published Date:</Text> {selectedCourse.date}
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<ShoppingCartOutlined />} 
                      onClick={() => handleEnroll(selectedCourse)}
                      style={{ marginRight: '16px' }}
                    >
                      Enroll Now
                    </Button>
                    <Button 
                      size="large" 
                      icon={<StarOutlined />}
                      onClick={() => setReviewModalVisible(true)}
                    >
                      Write a Review
                    </Button>
                  </div>
                  
                  <div style={{ marginTop: '32px' }}>
                    <Title level={4}>Reviews</Title>
                    {selectedCourse.reviews && selectedCourse.reviews.length > 0 ? (
                      <List
                        itemLayout="vertical"
                        dataSource={selectedCourse.reviews}
                        renderItem={(review) => (
                          <List.Item>
                            <div style={{ marginBottom: '8px' }}>
                              <Text strong>{review.userName}</Text>
                              <Text type="secondary" style={{ marginLeft: '8px' }}>
                                {review.date}
                              </Text>
                            </div>
                            <Rate disabled defaultValue={review.rating} />
                            <Paragraph>{review.comment}</Paragraph>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <Paragraph>No reviews yet. Be the first to review this course!</Paragraph>
                    )}
                  </div>
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
      
      <Modal
        title="Write a Review"
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        onOk={handleSubmitReview}
        okText="Submit Review"
      >
        <div style={{ marginBottom: '16px' }}>
          <Text>Your Rating:</Text>
          <div>
            <Rate value={userRating} onChange={setUserRating} />
          </div>
        </div>
        <div>
          <Text>Your Review:</Text>
          <Input.TextArea
            rows={4}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share your experience with this course..."
          />
        </div>
      </Modal>
    </Layout>
  );
};

export default SearchCoursePage;
