import React, { FC } from 'react';
import { Layout } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar, { NavConfig } from './component/navBar/navBar';
import HomePage from './view/HomePage';
import ShoppingPage from './view/ShoppingPage';
import NotFoundPage from './global/NotFoundPage';
import LoginPage from './view/LoginPage';

const { Header, Footer, Content } = Layout;

const navConfig: NavConfig = {
  navBarTheme: 'dark',
  navLayout: 'horizontal',
  leftNavItems: [
    {
      key: '',
      label: 'Home',
    },
    {
      key: 'shopping',
      label: 'Shopping',
      style: { backgroundColor: 'red' },
      children: [
        {
          key: 'electronics',
          label: 'Electronics',
          style: { backgroundColor: 'red', margin: 0, width: '100%' },
        },
      ],
    },
    {
      key: 'contactus',
      label: 'Contact Us',
      children: [
        { key: 'business', label: 'Business' },
        { key: 'feedback', label: 'Feedback' },
      ],
    },
  ],
  rightNavItems: [
    {
      key: 'login',
      label: 'Login'
    },
    {
      key:'signup',
      label:'Sign Up'
    }
  ],
};

const App: FC = () => (
  <BrowserRouter>
    <Layout style={{ minHeight: '100vh' }}> {/* Ensure full browser height */}
      <Header>
        <div className="logo" />
        <NavBar
          navBarTheme={navConfig.navBarTheme}
          navLayout={navConfig.navLayout}
          leftNavItems={navConfig.leftNavItems}
          rightNavItems={navConfig.rightNavItems}
        />
      </Header>
      <Content style={{ flex: 1, padding: '16px, 0px', overflow: 'hidden', }}> {/* Flex to fill remaining space */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shopping" element={<ShoppingPage />} />
          <Route path="/contactus" element={<ShoppingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor: '#08072e', color: 'azure' }}>NTU Project</Footer>
    </Layout>
  </BrowserRouter>
);

export default App;
