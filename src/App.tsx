import React, { FC } from 'react';
import { Layout } from 'antd';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import NavBar, { NavConfig } from './component/navBar/navBar';
import HomePage from './view/HomePage';
import ShoppingPage from './view/ShoppingPage';
import NotFoundPage from './global/NotFoundPage';
import LoginPage from './view/LoginPage';
import RegisterationPage from './view/RegisterationPage';
import LearnerProfilePage from './view/LearnerProfilePage';
import ContactFeedbackPage from './view/ContactFeedbackPage';
import SearchCoursePage from './view/SearchCoursePage';
import CheckoutPage from './view/CheckoutPage';
import AdminManagementPage from './view/AdminManagementPage';
import ProviderCreateCoursePage from './view/ProviderCreateCoursePage';
import ProviderViewCoursePage from './view/ProviderViewCoursePage';
import ProviderDeleteCoursePage from './view/ProviderDeleteCoursePage';
import ProviderUpdateCoursePage from './view/ProviderUpdateCoursePage';
import ProviderDashboard from './view/ProviderDashboard';
import CourseDetailPage from './view/CourseDetailPage';
import ForgetPasswordPage from './view/ForgetPasswordPage';
import AdminCreationPage from './view/AdminCreationPage';

const { Header, Footer, Content } = Layout;

// Example: if the user is logged in, you might have their data in sessionStorage.
// Here we check if there's a logged-in user and build a learner profile URL accordingly.
const loggedUserString = sessionStorage.getItem('user');
const loggedUser = loggedUserString ? JSON.parse(loggedUserString) : null;
const profileLink = loggedUser ? `/learnerProfile/${loggedUser.userID}` : '/login';

const navConfig: NavConfig = {
  navBarTheme: 'dark',
  navLayout: 'horizontal',
  leftNavItems: [
    { key: 'home', label: <Link to="/">Home</Link> },
    {
      key: 'searchCourse',
      label: <Link to="/searchCourse">Upskill Now</Link>,
      style: { backgroundColor: 'red' },
    },
    { key: 'contactus', label: <Link to="/contactus">Contact Us</Link> },
  ],
  rightNavItems: loggedUser
    ? [
      { key: 'profile', label: <Link to={profileLink}>Profile</Link> },
    ]
    : [
      { key: 'login', label: <Link to="/login">Login</Link> },
      { key: 'register', label: <Link to="/register">Register</Link> },
    ],
};

const App: FC = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Header>
          <div className="logo" />
          <NavBar
            navBarTheme={navConfig.navBarTheme}
            navLayout={navConfig.navLayout}
            leftNavItems={navConfig.leftNavItems}
            rightNavItems={navConfig.rightNavItems}
          />
        </Header>
        <Content
          style={{
            flex: 1,
            padding: '16px, 0px',
            overflow: 'hidden',
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            {/* <Route path="/shopping" element={<ShoppingPage />} /> */}
            {/* <Route path="/contactus" element={<ShoppingPage />} /> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterationPage />} />
            {/* Change the learner profile route to accept a userID parameter */}
            <Route path="/learnerProfile/:userID" element={<LearnerProfilePage />} />
            <Route path="/contactus" element={<ContactUsPage />} />
            <Route path="/searchCourse" element={<SearchCoursePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/adminManagementPage" element={<AdminManagementPage />} />
            <Route path="/forgetpassword" element={<ForgetPasswordPage />} />
            <Route path="/adminCreation" element={<AdminCreationPage />} />
            <Route path="/createcourse" element={<ProviderCreateCoursePage />} />
            {/* <Route path="/viewcourse" element={<ProviderViewCoursePage />} />
            <Route path="/deletecourse" element={<ProviderDeleteCoursePage/>} />
            <Route path="/updatecourse" element={<ProviderUpdateCoursePage/>} /> */}
            <Route path="/providerDashboard" element={<ProviderDashboard/>} />
            <Route path="/course-detail/:id" element={<CourseDetailPage />} />
            {/* <Route path="/providerDasboard" element={<ProviderDashboard/>} /> */}
            <Route path="/forgetpassword" element={<ForgetPasswordPage />} />
            <Route path="/adminCreation" element={<AdminCreationPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center', backgroundColor: '#08072e', color: 'azure' }}>
          NTU Project
        </Footer>
      </Layout>
    </BrowserRouter>
  </Provider>
);

export default App;
