import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Layout,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Radio,
  Typography,
  message,
  Spin
} from "antd";
import CourseCard from "./CourseCard";
import { PlusCircleFilled } from "@ant-design/icons";

const { Content } = Layout;
const { Option } = Select;
const { Text, Title } = Typography;

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        message.error("Please login to view courses");
        return;
      }

      const response = await fetch("http://localhost:5000/api/courses", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include'
      });

      if (response.status === 403) {
        message.error("You don't have permission to view courses");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      message.error("Failed to fetch courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleOk = async (values) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        message.error("Please login to add a course");
        return;
      }

      const response = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      if (response.status === 403) {
        message.error("You don't have permission to add courses");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add course");
      }

      const newCourse = await response.json();
      setCourses(prev => [...prev, newCourse]);
      message.success("Course added successfully!");
      form.resetFields();
      setVisible(false);
    } catch (error) {
      console.error("Error adding course:", error);
      message.error(error.message || "An error occurred while adding the course");
    }
  };

  return (
    <Content className="content">
      <Title level={4}>Courses</Title>
      <Text type="secondary">List of all courses</Text>

      <div className="mt-2">
        <Row gutter={[20, 20]} className="mt-2">
          {loading ? (
            <Col span={24} style={{ textAlign: 'center' }}>
              <Spin size="large" />
            </Col>
          ) : courses.length === 0 ? (
            <Col span={24}>
              <Text type="secondary">No courses available</Text>
            </Col>
          ) : (
            courses.map((course) => (
              <Col xs={24} sm={12} md={8} lg={6} key={course._id}>
                <CourseCard course={course} onUpdate={fetchCourses} />
              </Col>
            ))
          )}
        </Row>
      </div>

      <div className="mt-2">
        <Button
          type="primary"
          onClick={() => setVisible(true)}
          icon={<PlusCircleFilled />}
        >
          Quick Add Course
        </Button>
      </div>

      <Modal
        title="Quick Add Course"
        open={visible}
        onCancel={handleCancel}
        footer={null}
        maskClosable={false}
      >
        <Text type="secondary">
          Add a course using quick add form below. More info about the course can be added later.
        </Text>
        <Form
          form={form}
          onFinish={handleOk}
          layout="vertical"
          className="mt-2"
          initialValues={{
            online: true,
            level: "beginner",
          }}
        >
          <Form.Item
            label="Abbreviation"
            name="abbreviation"
            rules={[
              { required: true, message: "Please add course abbreviation!" },
              { max: 6, message: "Abbreviation cannot exceed 6 characters!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Online or Onsite" name="online">
            <Radio.Group>
              <Radio value={true}>Online</Radio>
              <Radio value={false}>Onsite</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Course Length"
            name="length"
            rules={[{ required: true, message: "Please add course length!" }]}
          >
            <Input placeholder="e.g., 12 weeks" />
          </Form.Item>

          <Form.Item
            label="Course Title"
            name="courseName"
            rules={[
              { required: true, message: "Please add course title!" },
              { max: 24, message: "Course title cannot exceed 24 characters!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Course Description"
            name="description"
            rules={[
              { required: true, message: "Please add course description!" },
              { min: 150, message: "Course description must be at least 150 characters!" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Difficulty" name="level">
            <Select>
              <Option value="beginner">Beginner</Option>
              <Option value="intermediate">Intermediate</Option>
              <Option value="advanced">Advanced</Option>
              <Option value="expert">Expert</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Cost"
            name="cost"
            rules={[{ required: true, message: "Please input the cost!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              min={0}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="mr-2">
              Submit
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default CoursesList;