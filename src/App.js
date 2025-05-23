import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import SideBar from "./components/Sider/Sider";
import Roster from "./pages/RosterPage";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignupPage";
import AuthContext from "./authContext";
import { Layout, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import CoursesList from "./components/Course/CoursesList";
import CourseDetails from "./components/Course/CourseDetails";
import LogOutSuccessPage from "./pages/LogoutSuccessPage";
import ProtectedRoute from './ProtectedRoute';
import UserProfile from "./components/User/userProfile";
import UserActivityMonitor from "./components/User/userActivityTracker";
import Logout from "./components/Login/Logout";
import AppFooter from "./components/Footer/Footer";
import HomePage from "./pages/HomePage";
import Stats from "./pages/StatsPage";

const { Header } = Layout;
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSiderCollapsed, setIsSiderCollapsed] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <AuthContext.Provider
          value={{ 
            isLoggedIn, 
            setIsLoggedIn, 
            token,
            handleLogin,
            handleLogout 
          }}
        >
          <Router>
            {isLoggedIn && <SideBar collapsed={isSiderCollapsed} />}

            <Layout>
              {isLoggedIn && (
                <Header id="header">
                  <Button
                    icon={
                      isSiderCollapsed ? (
                        <MenuUnfoldOutlined />
                      ) : (
                        <MenuFoldOutlined />
                      )
                    }
                    onClick={() => setIsSiderCollapsed(!isSiderCollapsed)}
                    id="menu-trigger"
                  />
                  <Logout />
                </Header>
              )}

              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/logout-success" element={<LogOutSuccessPage />} />
                <Route path="/signup" element={<Signup />} />
                <Route exact path="/courses" element={<ProtectedRoute><CoursesList /></ProtectedRoute>} />
                <Route path="/courses/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
                <Route path="/roster" element={<ProtectedRoute><Roster /></ProtectedRoute>} />
                <Route path="/userprofile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/statistic" element={<ProtectedRoute><Stats /></ProtectedRoute>} />    
                <Route
                  path="/"
                  element={
                    isLoggedIn ? (
                      <Navigate to="/roster" replace />
                    ) : (
                      <HomePage />
                    )
                  }
                />
                <Route path="*" element={<HomePage />} />
              </Routes>
              {isLoggedIn && <UserActivityMonitor />}

              <AppFooter />
            </Layout>
          </Router>
        </AuthContext.Provider>
      </Layout>
    </div>
  );
};

export default App;