import React, { FC } from 'react';
import { Button } from 'antd';
import logo from './logo.svg';
import './App.css';
import { Layout } from 'antd';
import Menu from 'antd/es/menu/menu';

const { Header, Footer, Sider, Content } = Layout;


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }



const App: FC =() => (
<>
    <Layout>
      <Header>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        items={new Array(15).fill(null).map((_, index) => {
          const key = index + 1;
          return {
            key,
            label: `nav ${key}`,
          };
        })}
      />
      </Header>
      <Content>Content</Content>
      <Footer>Footer</Footer>
    </Layout>
</>
);

export default App;
