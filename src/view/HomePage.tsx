import React, { useEffect } from 'react';
import { Carousel, Typography, Row, Col, Button, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setVisibleCards } from '../redux/slices/carouselSlice';
import type { RootState } from '../redux/store';
import ItemCard from '../component/card/ItemCard';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = () => {

  const dispatch = useDispatch();
  const visibleCards = useSelector((state: RootState) => state.carousel.visibleCards);

  // DUMMY DATA for product
  const items = [
    {
      id: 1,
      image: 'https://via.placeholder.com/300x200?text=Product+1',
      title: 'Product 1',
      description: 'This is a short description of Product 1.',
      price: '$100',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/300x200?text=Product+2',
      title: 'Product 2',
      description: 'This is a short description of Product 2.',
      price: '$150',
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/300x200?text=Product+3',
      title: 'Product 3',
      description: 'This is a short description of Product 3.',
      price: '$200',
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/300x200?text=Product+4',
      title: 'Product 5',
      description: 'This is a short description of Product 3.',
      price: '$200',
    },
    {
      id: 5,
      image: 'https://via.placeholder.com/300x200?text=Product+5',
      title: 'Product 5',
      description: 'This is a short description of Product 3.',
      price: '$250',
    },
    {
      id: 6,
      image: 'https://via.placeholder.com/300x200?text=Product+6',
      title: 'Product 6',
      description: 'This is a short description of Product 3.',
      price: '$396',
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 1000) dispatch(setVisibleCards(1));
      else if (width < 1300) dispatch(setVisibleCards(2));
      else dispatch(setVisibleCards(3));
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);

  const groupedItems = [];
  for (let i = 0; i < items.length; i += visibleCards) {
    groupedItems.push(items.slice(i, i + visibleCards));
  }

  return (
    <div style={{ width: '100%', }}>
      {/* Hero Section */}
      <div
        style={{
          width: '100%',
          height: '500px',
          backgroundColor: '#222222', // Primary color
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <div>
          <Title style={{ color: '#fff', fontSize: '3rem' }}>Welcome to Our Platform</Title>
          <Paragraph style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '20px' }}>
            Join us today and enjoy exclusive benefits.
          </Paragraph>
          <Button type="primary" size="large" style={{ marginRight: '10px' }}>
            Sign Up
          </Button>
          <Button size="large" style={{ background: '#fff', color: '#1890ff' }}>
            Learn More
          </Button>
        </div>
      </div>

      {/* Other Content */}
      <Row gutter={[16, 16]} style={{ marginTop: '20px', padding: '0 20px', height: '400px' }}>
        <Col span={12}>
          <Card style={{ padding: '20px', background: '#f0f2f5', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', }}>
            <Title level={3}>Why Join Us?</Title>
            <Paragraph>
              Explore a world of opportunities with exclusive features tailored for you.
            </Paragraph>
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ padding: '20px', background: '#f0f2f5', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', }}>
            <Title level={3}>Get Started Today</Title>
            <Paragraph>
              It's quick, easy, and free to get started. Join us and see the difference.
            </Paragraph>

          </Card>
        </Col>
      </Row>

      {/* Checkout Our Top Seller */}

      <div style={{ backgroundColor: '#777777', color: '#fff', padding: '50px 20px' }}>
        <Row gutter={[15, 15]} align="middle">
          {/* Left Column */}
          <Col xs={12} md={4}>
            <Title style={{ color: '#fff', fontSize: '2rem', padding: '10px 25px' }}>
              Check Out Our Top Seller
            </Title>
          </Col>

          {/* Right Column */}
          <Col xs={24} md={16} style={{ maxWidth: '80vw' }}>
            <Carousel effect='fade' dotPosition='right'>
              {groupedItems.map((group, index) => (
                <div key={index}>
                  <Row gutter={[15, 15]} justify="center">
                    {group.map((item) => (
                      <Col key={item.id} xs={24} sm={12} md={8} span={10}>
                        <ItemCard
                          image={item.image}
                          title={item.title}
                          description={item.description}
                          price={item.price}
                          size='medium'
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </Carousel>
          </Col>
        </Row>
      </div>
    </div>

  );

};

export default HomePage;
