// HomePage.js
import React from "react";
import { Layout, Row, Col, Button } from "antd";
import { useNavigate } from "react-router-dom";
const { Content } = Layout;

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Content
      className="content"
      style={{
        backgroundImage: `url('/home-bg.jpeg')`, // replace with your actual image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="text-center">
        <img src="/logo.png" alt="logo" width={190} className="mt-2" />
      </div>

      <Row justify="center" style={{ justifyContent: "center" }}>
        <Col>
          <Button onClick={() => navigate("/login")} className="btn-primary mt-1 border-radius-0">
            Login
          </Button>
        </Col>

        <span className="ml-2 mr-2 mt-2">
          <strong>or</strong>
        </span>

        <Col>
          <Button onClick={() => navigate("/signup")} className="btn-secondary mt-1 border-radius-0">
            Signup
          </Button>
        </Col>
      </Row>
    </Content>
  );
};

export default HomePage;
