import React from 'react';
import { Carousel } from 'antd';

const HomePage: React.FC = () => {
  const images = [
    'https://www.hindustantimes.com/ht-img/img/2023/11/17/1600x900/zxcvbnm_1700222402717_1700222410196.jpeg', 
    'https://uploads.dailydot.com/2018/10/olli-the-polite-cat.jpg?q=65&auto=format&w=1200&ar=2:1&fit=crop', 
    'https://via.placeholder.com/800x400?text=Random+Image+3', 
    'https://via.placeholder.com/800x400?text=Random+Image+3', 
  ];

  return (
    <>
      <Carousel autoplay>
        {images.map((src, index) => (
          <div key={index}>
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              style={{ width: '100%', height: '550px', objectFit: 'contain' }}
            />
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default HomePage;
