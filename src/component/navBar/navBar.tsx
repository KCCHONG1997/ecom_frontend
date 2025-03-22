import { Menu, MenuProps, Dropdown, Avatar, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col } from 'antd';
import { useSession } from '../../hooks/useSession'; // Custom hook for session management

export interface NavConfig {
  navBarTheme: 'light' | 'dark';
  navLayout: 'horizontal' | 'vertical' | 'inline';
  leftNavItems?: MenuProps['items'];
  rightNavItems?: MenuProps['items'];
}

const NavBar: React.FC<NavConfig> = (config) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, fetchSession, logout } = useSession(); // Using the custom session hook
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch session whenever the route changes
  useEffect(() => {
    fetchSession();
  }, [location.pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true); // Show spinner during logout
    try {
      await logout(); // Call the logout method from the hook
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false); // Stop spinner
    }
  };

  const menuItems: MenuProps['items'] = [
    { key: 'profile', label: 'Profile' },
    { key: 'logout', label: 'Logout', onClick: handleLogout },
  ];

  //shawn added
  if (user && ((user as unknown) as { role: string }).role === 'provider') {
    menuItems.splice(1, 0, {
      key: 'createcourse',
      label: 'Create Course',
      onClick: () => navigate('/createcourse'),
    },
    {
      key: 'viewcourses',
      label : 'View Courses',
      onClick: () => navigate('/viewcourse')
    },
    {
      key: 'deletcourses',
      label : 'Delete Courses',
      onClick: () => navigate('/deletecourse')
    },
    {
      key: 'updatecourses',
      label: 'Update Courses',
      onClick: () => navigate('/updatecourse')
    }
  );
  }

  return (
    <Spin spinning={isLoading || isLoggingOut} size="large">
      <Row justify="space-between" align="middle" style={{ width: '100%' }}>
        {/* Left Navigation */}
        <Col span={8}>
          <Menu
            theme={config.navBarTheme}
            mode={config.navLayout}
            items={config.leftNavItems}
            defaultSelectedKeys={['1']}
            onClick={({ key }) => navigate(key)}
          />
        </Col>

        {/* Right Navigation */}
        <Col span={4} offset={7}>

          {user ? (
            <Dropdown menu={{ items: menuItems }} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'whitesmoke' }}>
                {user.avatar ? (
                  <Avatar src={user.avatar} style={{ marginRight: 8 }} />
                ) : (
                  <Avatar style={{ marginRight: 8 }}>{user.username[0]}</Avatar>
                )}
                {user.username}
              </div>
            </Dropdown>
          ) : (
            <Menu
              theme={config.navBarTheme}
              mode={config.navLayout}
              items={config.rightNavItems}
              onClick={({ key }) => navigate(key)}
            />
          )}
        </Col>
      </Row>
    </Spin>

  );
};

export default NavBar;
