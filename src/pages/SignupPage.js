import Signup from "../components/Signup/Signup";
import React from "react";
import { Layout, Col, Row } from "antd";
import { Link } from "react-router-dom";

const { Content } = Layout;

const SignupPage = () => {
  return (
    <Content className="content">
      <Row>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={16}
          style={{ 
            background: "white", 
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1>Welcome to Student Portal</h1>
            <p>Your comprehensive education management system</p>
          </div>
        </Col>
        <Col 
          xs={12} 
          sm={12} 
          md={12} 
          lg={8} 
          className="mt-5 pl-5"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <Signup />
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p>
              Already have an account?{" "}
              <Link to="/login">
                <u>Log in</u>
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </Content>
  );
};

export default SignupPage;