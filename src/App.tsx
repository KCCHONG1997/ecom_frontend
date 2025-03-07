import React, { FC } from 'react';
import { Layout } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import NavBar, { NavConfig } from './component/navBar/navBar';
import HomePage from './view/HomePage';
import ShoppingPage from './view/ShoppingPage';
import NotFoundPage from './global/NotFoundPage';
import LoginPage from './view/LoginPage';
import RegisterationPage from './view/RegisterationPage';
import LearnerProfilePage from './view/LearnerProfilePage';
import ContactUsPage from './view/ContactUsPage';
import SearchCoursePage from './view/SearchCoursePage';
import AdminManagementPage from './view/AdminManagementPage';
import CreateCoursePage from './view/CreateCoursePage'

const { Header, Footer, Content } = Layout;

//shawn added
const userRole = sessionStorage.getItem("userRole");

const navConfig: NavConfig = {
  navBarTheme: 'dark',
  navLayout: 'horizontal',
  leftNavItems: [
    {
      key: '',
      label: 'Home',
    },
    {
      key: 'searchCourse',
      label: 'Upskill Now',
      style: { backgroundColor: 'red' },
    },
    {
      key: 'contactus',
      label: 'Contact Us',
    }, ...(userRole === "producer" ? [{ key: "CreateCoursePage", label: "Create Course" }] : []),
  ],
  rightNavItems: [
    {
      key: 'login',
      label: 'Login'
    },
    {
      key: 'register',
      label: 'Register'
    }
  ],
};

const App: FC = () => (
  <Provider store={store}>
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
            {/* <Route path="/contactus" element={<ShoppingPage />} /> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterationPage />} />
            <Route path="/learnerProfile" element={<LearnerProfilePage />} />
            <Route path="/contactus" element={<ContactUsPage />} />
            <Route path="/searchCourse" element={<SearchCoursePage />} />
            <Route path="/adminManagementPage" element={<AdminManagementPage />} />

            <Route path="/CreateCoursePage" element={<CreateCoursePage />} />

            

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center', backgroundColor: '#08072e', color: 'azure' }}>NTU Project</Footer>
      </Layout>
    </BrowserRouter>
  </Provider>
);

export default App;
