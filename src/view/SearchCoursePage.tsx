import React, { useState, useMemo, useEffect } from 'react';
import { Layout, Row, Col, Input, Card, Typography, List, Select, DatePicker, Spin, Button, Tag } from 'antd';
import moment from 'moment';
import { showErrorMessage } from '../utils/messageUtils';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

// Define the Course type with additional image fields and modeOfTrainings.
export type Course = {
  externalReferenceNumber: string;
  title: string;
  content: string;
  category?: string;
  provider?: string;
  date?: string;
  objective?: string;
  totalCostOfTrainingPerTrainee?: number;
  totalTrainingDurationHour?: number;
  tileImageURL?: string;
  detailImageURL?: string;
  url?: string;
  modeOfTrainings?: { code: string; description: string }[];
};

const SearchCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Filter states
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedProvider, setSelectedProvider] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);

  // Keyword states: one for immediate input, one for actual search trigger.
  const [inputKeyword, setInputKeyword] = useState<string>('business');
  const [keyword, setKeyword] = useState<string>('business');

  // Pagination state for "Load More" functionality.
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const pageSize = 15;

  // Fetch courses from the backend and transform the data.
  const fetchCoursesFromAPI = async (pageToLoad: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/skillsfuture/courses?keyword=${encodeURIComponent(keyword)}&page=${pageToLoad}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }
      );
      const text = await response.text();
      console.log("Raw response:", text);
      const data = JSON.parse(text);
      if (!response.ok) {
        showErrorMessage(`Failed to fetch courses: ${data.error || 'Unknown error'}`);
        return;
      }
      // Transform the data to the Course shape.
      const transformedCourses: Course[] = data.data.courses.map((course: any) => ({
        externalReferenceNumber: course.externalReferenceNumber,
        title: course.title,
        content: course.content,
        category: course.category || '',
        provider: course.trainingProviderAlias || '',
        date: course.meta?.createDate ? course.meta.createDate.split('T')[0] : '',
        objective: course.objective || '',
        totalCostOfTrainingPerTrainee: course.totalCostOfTrainingPerTrainee || 0,
        totalTrainingDurationHour: course.totalTrainingDurationHour || 0,
        tileImageURL: course.tileImageURL
          ? (course.tileImageURL.startsWith('/') ? `https://www.myskillsfuture.gov.sg${course.tileImageURL}` : course.tileImageURL)
          : '',
        detailImageURL: course.detailImageURL
          ? (course.detailImageURL.startsWith('/') ? `https://www.myskillsfuture.gov.sg${course.detailImageURL}` : course.detailImageURL)
          : '',
        url: course.url || '',
        modeOfTrainings: course.modeOfTrainings || []
      }));
      if (pageToLoad === 1) {
        setCoursesData(transformedCourses);
      } else {
        setCoursesData(prev => {
          const newCourses = transformedCourses.filter(course => !prev.some(c => c.externalReferenceNumber === course.externalReferenceNumber));
          return [...prev, ...newCourses];
        });
      }
      if (transformedCourses.length < pageSize) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      showErrorMessage('Failed to connect to the server.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // When keyword changes, reset page and data, then fetch first page.
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchCoursesFromAPI(1);
  }, [keyword]);

  // Compute unique categories and providers.
  const categories = useMemo(
    () => Array.from(new Set(coursesData.map(course => course.category))),
    [coursesData]
  );
  const providers = useMemo(
    () => Array.from(new Set(coursesData.map(course => course.provider))),
    [coursesData]
  );

  // Filter courses based on title, category, provider, and date.
  const filteredCourses = useMemo(() => {
    return coursesData.filter(course => {
      const matchesText = course.title.toLowerCase().includes(filterText.toLowerCase());
      const matchesCategory = selectedCategory ? course.category === selectedCategory : true;
      const matchesProvider = selectedProvider ? course.provider === selectedProvider : true;
      const matchesDate = selectedDate ? course.date === selectedDate.format('YYYY-MM-DD') : true;
      return matchesText && matchesCategory && matchesProvider && matchesDate;
    });
  }, [coursesData, filterText, selectedCategory, selectedProvider, selectedDate]);

  // Handler for "Load More" button.
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCoursesFromAPI(nextPage);
  };

  // Handler for "Check this course" button.
  const handleCheckCourse = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      showErrorMessage("No course URL available");
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <Row gutter={[16, 16]}>
          {/* Left side: Filter controls and course list */}
          <Col xs={24} lg={8} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            {/* Badge at the top */}
            <Tag color="blue" style={{ marginBottom: 16, fontSize: '14px' }}>
              Data from SkillsFuture SG
            </Tag>
            <Card title="Filter Courses" bordered={false}>
              <Search
                placeholder="Search by course title"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{ marginBottom: 16 }}
                enterButton
              />
              <Search
                placeholder="Search by keyword"
                value={inputKeyword}
                onChange={(e) => setInputKeyword(e.target.value)}
                onSearch={(value) => setKeyword(value)}
                style={{ marginBottom: 16 }}
              />
              <Select
                placeholder="Filter by Category"
                style={{ width: '100%', marginBottom: 16 }}
                allowClear
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
              >
                {categories.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Filter by Provider"
                style={{ width: '100%', marginBottom: 16 }}
                allowClear
                value={selectedProvider}
                onChange={(value) => setSelectedProvider(value)}
              >
                {providers.map((prov) => (
                  <Option key={prov} value={prov}>
                    {prov}
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
            {isLoading && page === 1 ? (
              <Spin style={{ display: 'block', marginTop: 20 }} />
            ) : (
              <>
                <List
                  itemLayout="vertical"
                  dataSource={filteredCourses}
                  renderItem={(course) => (
                    <List.Item key={course.externalReferenceNumber}>
                      <Card
                        hoverable
                        onClick={() => setSelectedCourse(course)}
                        style={{
                          marginBottom: 12,
                          border: selectedCourse?.externalReferenceNumber === course.externalReferenceNumber ? '2px solid #1890ff' : undefined,
                        }}
                      >
                        {course.tileImageURL && (
                          <img
                            src={course.tileImageURL}
                            alt={course.title}
                            style={{ width: '80%', marginBottom: '8px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                          />
                        )}
                        <Title level={5}>{course.title}</Title>
                        <Paragraph ellipsis={{ rows: 2 }}>{course.content}</Paragraph>
                        {/* Render modeOfTrainings as tags if available */}
                        {course.modeOfTrainings && course.modeOfTrainings.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            {course.modeOfTrainings.map((mode, idx) => (
                              <Tag key={idx} color="geekblue">
                                {mode.description}
                              </Tag>
                            ))}
                          </div>
                        )}
                        <Button
                          type="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCheckCourse(course.url || '');
                          }}
                          style={{ marginTop: 8 }}
                        >
                          Check this course
                        </Button>
                      </Card>
                    </List.Item>
                  )}
                />
                {hasMore && (
                  <Button onClick={handleLoadMore} type="primary" style={{ width: '100%', marginTop: 16 }}>
                    {isLoading ? 'Loading...' : 'Load More'}
                  </Button>
                )}
              </>
            )}
          </Col>
          {/* Right side: Course details */}
          <Col xs={24} lg={16}>
            <Card bordered={false} style={{ minHeight: '80vh', padding: '24px' }}>
              {selectedCourse ? (
                <>
                  <Title level={3}>{selectedCourse.title}</Title>
                  {selectedCourse.detailImageURL && (
                    <img
                      src={selectedCourse.detailImageURL.startsWith('/') ? `https://public-api.ssg-wsg.sg${selectedCourse.detailImageURL}` : selectedCourse.detailImageURL}
                      alt={selectedCourse.title}
                      style={{ width: '80%', marginBottom: '16px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                    />
                  )}
                  <Paragraph><strong>Description:</strong> {selectedCourse.content}</Paragraph>
                  {selectedCourse.objective && (
                    <Paragraph><strong>Objective:</strong> {selectedCourse.objective}</Paragraph>
                  )}
                  {selectedCourse.totalCostOfTrainingPerTrainee ? (
                    <Paragraph><strong>Cost:</strong> ${selectedCourse.totalCostOfTrainingPerTrainee}</Paragraph>
                  ) : null}
                  {selectedCourse.totalTrainingDurationHour ? (
                    <Paragraph>
                      <strong>Duration:</strong> {selectedCourse.totalTrainingDurationHour} hours
                    </Paragraph>
                  ) : null}
                  {selectedCourse.modeOfTrainings && selectedCourse.modeOfTrainings.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <Title level={5}>Mode of Training</Title>
                      {selectedCourse.modeOfTrainings.map((mode, idx) => (
                        <Tag key={idx} color="geekblue">
                          {mode.description}
                        </Tag>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Paragraph type="secondary">
                  Please select a course from the list on the left to view its details.
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
