import "./Login.css";
import React, { useContext, useState } from "react";
import AuthContext from "../../authContext";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Checkbox, Typography, Divider, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const { Title } = Typography;

const Login = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        message.success("Login successful. Redirecting...");
        navigate("/statistic");
      } else {
        message.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title level={3}>Login</Title>

      <div className="login-container mt-5">
        <Form
          name="loginForm"
          onFinish={handleLogin}
          layout="vertical"
          id="loginForm"
          autoComplete="off"
        >
          <Form.Item
            name="username"
            label={<span style={{ padding: "0px" }}>Username</span>}
            rules={[
              { required: true, message: "Please enter your username!" },
              { min: 3, message: 'Username must be minimum 3 characters.' },
              { max: 30, message: 'Username must be maximum 30 characters.' },
            ]}
            hasFeedback
            validateDebounce={1000}
          >
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white input-active border-radius-0 border-active"
              bordered={false}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 8, message: 'Password must be minimum 8 characters.' },
            ]}
            style={{ marginBottom: "0px" }}
            hasFeedback
            validateDebounce={1000}
          >
            <Input.Password
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              className="bg-white input-active border-radius-0"
              bordered={false}
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="border-radius-0 tsize-12"
                style={{ fontSize: "12px" }}
                disabled
              >
                Remember me
              </Checkbox>
            </Form.Item>
            <Link
              to="/forgot-password"
              className="text-size-10"
              style={{ fontSize: "12px", marginLeft: "100px" }}
            >
              Forgot password
            </Link>
          </Form.Item>

          <Form.Item>
            <Button
              className="btn-primary btn-shadow border-radius-0"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <div style={{ textAlign: "center" }}>
          <Title level={5}>Don't have an account?</Title>
          <Link to="/signup" className="text-size-10" style={{ fontSize: "12px" }}>
            <u>Sign up</u>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;