import React from 'react';
import { Button, Result } from "antd";
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () =>{

    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/');
    }

    return(
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist. Fuck Off."
          extra={<Button 
            type="primary"
            onClick={handleClick}
            >Back Home</Button>}
        />
      );
}

  

export default NotFoundPage;
