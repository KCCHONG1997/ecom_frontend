import { Menu, MenuProps, Dropdown, Avatar, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'antd';

export interface NavConfig {
  navBarTheme: 'light' | 'dark';
  navLayout: 'horizontal' | 'vertical' | 'inline';
  leftNavItems?: MenuProps['items'];
  rightNavItems?: MenuProps['items'];
  onLoginSuccess?: () => void; // Optional prop to force update
}

interface User {
  username: string;
  avatar?: string;
}

const NavBar: React.FC<NavConfig> = (config) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Track logout state

  // Fetch user session
  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/check-session', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // Update user state
      } else {
        setUser(null); // Clear user state if no session
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  useEffect(() => {
    fetchUser(); // Initial session check
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true); // Start spinner
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setUser(null); // Clear user state immediately
        navigate('/login'); // Redirect to login
      } else {
        console.error('Logout failed');
      }
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

  return (
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
        {isLoggingOut ? (
          <Spin size="small" />
        ) : user ? (
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
  );
};

export default NavBar;
