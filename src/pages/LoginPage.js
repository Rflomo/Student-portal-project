import Login from "../components/Login/Login";
import React from "react";
import { Layout, Col, Row } from "antd";

const { Content } = Layout;

const LoginPage = () => {
  return (
    <Content className="content">
      <Row>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={16}
          style={{
            background: 'white',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1>Welcome Back!</h1>
            <p>Access your student portal dashboard</p>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={8}
          className="mt-5 pl-5"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingRight: '20px'
          }}
        >
          <Login />
        </Col>
      </Row>
    </Content>
  );
};

export default LoginPage;