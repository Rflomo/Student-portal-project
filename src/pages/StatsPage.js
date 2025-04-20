import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Statistic, Row, Col, Card, Layout, Typography, Spin, message } from "antd";

const { Content } = Layout;
const { Title, Text } = Typography;
const formatter = (value) => <CountUp end={value} separator="," />;

const StatsPage = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    admins: 0,
    courses: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          message.error("Please login to view statistics");
          return;
        }

        const response = await fetch("http://localhost:5000/api/stats", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 403) {
          message.error("You don't have permission to view statistics");
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStats({
          students: data.totalStudents || 0,
          teachers: data.totalTeachers || 0,
          admins: data.totalAdmins || 0,
          courses: data.totalCourses || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        message.error("Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Content className="content">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </Content>
    );
  }

  return (
    <Content className="content">
      <div>
        <Title level={4}>Statistics</Title>
        <Text type="secondary">Overview of system data</Text>
        <div className="mt-2">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Total Students"
                  value={stats.students}
                  formatter={formatter}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Total Teachers"
                  value={stats.teachers}
                  formatter={formatter}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Total Admins"
                  value={stats.admins}
                  formatter={formatter}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card bordered={false}>
                <Statistic
                  title="Total Courses"
                  value={stats.courses}
                  formatter={formatter}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </Content>
  );
};

export default StatsPage;