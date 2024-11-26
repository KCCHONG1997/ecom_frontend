import React, { FC } from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import NavBar, { NavConfig } from './component/navBar/navBar';
import LoginOutlined from '@ant-design/icons/lib/icons/LoginOutlined';
import HomePage from './view/HomePage';
import ShoppingPage from './view/ShoppingPage';

const { Header, Footer, Content } = Layout;

const App: FC = () => {
  const navConfig: NavConfig = {
    navBarTheme: 'dark',
    navLayout: 'horizontal',
    leftNavItems: [
      {
        key: '/',
        label: 'Home',
        // onClick: () => console.log('Navigate to Home'),
      },
      {
        key: '/shopping',
        label: 'Shopping',
        // onClick: () => console.log('Navigate to Shopping'),
      },
    ],
    rightNavItems: [
      {
        key: '/login',
        icon: <LoginOutlined />,
        // onClick: () => console.log('Navigate to Login'),
      },
    ],
  };

  return (
    <Router>
      <Layout>
        <Header>
          <NavBar
            navBarTheme={navConfig.navBarTheme}
            navLayout={navConfig.navLayout}
            leftNavItems={navConfig.leftNavItems}
            rightNavItems={navConfig.rightNavItems}
          />
        </Header>
        <Content>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shopping" element={<ShoppingPage />} />
          </Routes>
        </Content>
        <Footer>NTU Project</Footer>
      </Layout>
    </Router>
  );
};

export default App;
