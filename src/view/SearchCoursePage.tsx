import React, { useState, useMemo, useEffect } from 'react';
import { Layout, Row, Col, Input, Card, Typography, List, Select, DatePicker, Spin, Button, Tag, Tabs, Empty } from 'antd';
import moment from 'moment';
import { showErrorMessage } from '../utils/messageUtils';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

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
  source?: string; // "internal" or "myskillsfuture"
};

const SearchCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedProvider, setSelectedProvider] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | undefined>(undefined);

  const [inputKeyword, setInputKeyword] = useState<string>('business');
  const [keyword, setKeyword] = useState<string>('business');

  const [page, setPage] = useState<number>(1);
  // const pageSize = 15;

  const [hoverLoadMore, setHoverLoadMore] = useState<boolean>(false);

  // Combined fetch: fetch internal courses (only on page 1) and external courses per page.
  const fetchCombinedCourses = async (pageToLoad: number) => {
    setIsLoading(true);
    try {
      const internalCoursesPromise =
        pageToLoad === 1
          ? fetch(`http://localhost:5000/api/getAllCourses?keyword=${encodeURIComponent(keyword)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
          }).then(res => res.json())
          : Promise.resolve({ data: [] });
      const externalCoursesPromise = fetch(
        `http://localhost:5000/api/skillsfuture/courses?keyword=${encodeURIComponent(keyword)}&page=${pageToLoad}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        }
      ).then(res => res.json());

      const internalData = await internalCoursesPromise;
      const externalData = await externalCoursesPromise;

      console.log("externalData: ", externalData);

      const internalCourses: Course[] = (internalData.data || []).map((course: any) => ({
        externalReferenceNumber: course.external_reference_number,
        title: course.name,
        content: course.description,
        category: course.category || '',
        provider: course.training_provider_alias || '',
        date: course.created_at ? course.created_at.split('T')[0] : '',
        objective: '',
        totalCostOfTrainingPerTrainee: course.total_cost || 0,
        totalTrainingDurationHour: course.total_training_hours || 0,
        tileImageURL: course.tile_image_url || '',
        detailImageURL: '',
        url: course.url || '',
        modeOfTrainings: [],
        source: 'internal'
      }));

      const externalCourses: Course[] = (externalData.data.courses || []).map((course: any) => ({
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
        modeOfTrainings: course.modeOfTrainings || [],
        source: course.source || 'myskillsfuture'
      }));

      const combinedCourses = [...internalCourses, ...externalCourses];

      if (pageToLoad === 1) {
        setCoursesData(combinedCourses);
      } else {
        setCoursesData(prev => {
          const newCourses = combinedCourses.filter(
            course => !prev.some(c => c.externalReferenceNumber === course.externalReferenceNumber)
          );
          return [...prev, ...newCourses];
        });
      }
    } catch (error) {
      showErrorMessage('Failed to connect to the server.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchCombinedCourses(1);
  }, [keyword]);

  const allCourses = useMemo(() => coursesData, [coursesData]);
  const categories = useMemo(
    () => Array.from(new Set(allCourses.map(course => course.category))),
    [allCourses]
  );
  const providers = useMemo(
    () => Array.from(new Set(allCourses.map(course => course.provider))),
    [allCourses]
  );
  // const sources = useMemo(
  //   () => Array.from(new Set(allCourses.map(course => course.source))),
  //   [allCourses]
  // );

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      if (selectedSource) {
        return course.source === selectedSource &&
          course.title.toLowerCase().includes(filterText.toLowerCase()) &&
          (selectedCategory ? course.category === selectedCategory : true) &&
          (selectedProvider ? course.provider === selectedProvider : true) &&
          (selectedDate ? course.date === selectedDate.format('YYYY-MM-DD') : true);
      } else {
        if (course.source === 'internal') return true;
        return course.title.toLowerCase().includes(filterText.toLowerCase()) &&
          (selectedCategory ? course.category === selectedCategory : true) &&
          (selectedProvider ? course.provider === selectedProvider : true) &&
          (selectedDate ? course.date === selectedDate.format('YYYY-MM-DD') : true);
      }
    });
  }, [allCourses, filterText, selectedCategory, selectedProvider, selectedDate, selectedSource]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCombinedCourses(nextPage);
  };

  const handleCheckCourse = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      showErrorMessage("No course URL available");
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5', marginLeft: 'auto', marginRight: 'auto' }}>
      <Content style={{ padding: '24px' }}>
        <Row gutter={[16, 16]} justify="center" align="top">
          {/* Left side: Filter controls and course list */}
          <Col xs={20} lg={5} style={{ maxHeight: '100vh', overflowY: 'auto' }}>
            <Card title="Filter Courses" bordered={false}>
              {/* <Search
                placeholder="Search by course title"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{ marginBottom: 16 }}
                enterButton
              /> */}
              <Search
                placeholder="Search by keyword"
                value={inputKeyword}
                onChange={(e) => setInputKeyword(e.target.value)}
                onSearch={(value) => setKeyword(value)}
                style={{ marginBottom: 16 }}
              />
              <Select
                placeholder="Filter by Source"
                style={{ width: '100%', marginBottom: 16 }}
                allowClear
                value={selectedSource}
                onChange={(value) => setSelectedSource(value)}
              >
                <Option value="internal">Internal</Option>
                <Option value="myskillsfuture">SkillsFuture SG</Option>
              </Select>
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
                            style={{
                              width: '80%',
                              marginBottom: '8px',
                              display: 'block',
                              marginLeft: 'auto',
                              marginRight: 'auto'
                            }}
                          />
                        )}
                        <Title level={5}>{course.title}</Title>
                        <Paragraph ellipsis={{ rows: 2 }}>{course.content}</Paragraph>
                        {course.source && (
                          <Tag color={course.source === 'internal' ? 'green' : 'volcano'} style={{ marginBottom: 8 }}>
                            {course.source === 'internal' ? 'Internal' : 'SkillsFuture SG'}
                          </Tag>
                        )}
                        {course.modeOfTrainings && course.modeOfTrainings.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            {course.modeOfTrainings.map((mode, idx) => (
                              <Tag key={idx} color="geekblue">
                                {mode.description}
                              </Tag>
                            ))}
                          </div>
                        )}
                        {/* <Button
                          type="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCheckCourse(course.url || '');
                          }}
                          style={{ marginTop: 8 }}
                        >
                          Check this course
                        </Button> */}
                      </Card>
                    </List.Item>
                  )}
                />
                {/* Always show clickable Load More text */}
                <div
                  onClick={handleLoadMore}
                  onMouseEnter={() => setHoverLoadMore(true)}
                  onMouseLeave={() => setHoverLoadMore(false)}
                  style={{
                    textAlign: 'center',
                    padding: '10px 0',
                    color: hoverLoadMore ? 'lightblue' : 'grey',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </div>
              </>
            )}
          </Col>


          {/* Right side: Course details with tabs */}
          <Col xs={24} lg={16}>
            <Card bordered={false} style={{ minHeight: '80vh', padding: '24px' }}>
              {selectedCourse ? (
                <>
                  <Title level={2}>{selectedCourse.title}</Title>
                  {/* BUTTON HERE */}
                  <Button
                    type="primary"
                    ghost
                    onClick={() =>
                      window.open(
                        `https://www.myskillsfuture.gov.sg/content/portal/en/training-exchange/course-directory/course-detail.html?courseReferenceNumber=${selectedCourse.externalReferenceNumber}`,
                        '_blank'
                      )
                    }
                    style={{ marginTop: 15, marginBottom: 15 }}
                  >
                    View on SkillsFuture SG
                  </Button>
                  {selectedCourse.detailImageURL && (
                    <img
                      src={selectedCourse.detailImageURL.startsWith('/')
                        ? `https://public-api.ssg-wsg.sg${selectedCourse.detailImageURL}`
                        : selectedCourse.detailImageURL}
                      alt={selectedCourse.title}
                      style={{ width: '100%', marginBottom: '16px' }}
                    />
                  )}
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Details" key="1">
                      <Paragraph><strong>Provider:</strong> {selectedCourse.provider}</Paragraph>
                      <Paragraph><strong>Cost:</strong> ${selectedCourse.totalCostOfTrainingPerTrainee}</Paragraph>
                      <Paragraph><strong>Duration:</strong> {selectedCourse.totalTrainingDurationHour} hours</Paragraph>
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
                    </TabPane>
                    <TabPane tab="Description" key="2">
                      <Paragraph>{selectedCourse.content}</Paragraph>
                    </TabPane>
                    <TabPane tab="Objective" key="3">
                      <Paragraph>{selectedCourse.objective || "No objective provided."}</Paragraph>
                    </TabPane>
                  </Tabs>
                </>
              ) : (
                <Row justify="center" align="middle">
                  <Col xs={20} lg={5} style={{ maxHeight: '100vh'}}>
                    <Empty
                      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                      description={
                        <Typography.Text>
                          Please select a course from the list on the left to view its details.
                        </Typography.Text>
                      }
                    >
                    </Empty>
                  </Col>
                </Row>
              )}
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default SearchCoursePage;
