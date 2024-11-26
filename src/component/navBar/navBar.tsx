import { Menu, MenuProps } from 'antd';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'antd';

export interface NavConfig{
    navBarTheme: 'light' | 'dark';
    navLayout: 'horizontal' | 'vertical' | 'inline';
    // leftNavItems?: MenuProps['items'];
    leftNavItems?: MenuProps['items'];
    rightNavItems?: MenuProps['items'];
}

const NavBar: React.FC<NavConfig> = (config) => {
  const navigate = useNavigate();

  const handleMenuClick: MenuProps['onClick'] = (info) => {
    console.log(info);
    const { key } = info;
    navigate(key);
  };

  return (
  <Row justify="space-between" align="middle" style={{ width: '100%' }}>
    {/* Left Navigation */}
    <Col flex="1">
      <Menu
        theme={config.navBarTheme}
        mode={config.navLayout}
        items={config.leftNavItems}
        defaultSelectedKeys={['1']}
        onClick={handleMenuClick}
      />
    </Col>

    {/* Right Navigation */}
    <Col>
      <Menu
        theme={config.navBarTheme}
        mode={config.navLayout}
        items={config.rightNavItems}
        onClick={handleMenuClick}
      />
    </Col>
  </Row>
  );
};

  export default NavBar;