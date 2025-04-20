import React, { useState } from 'react';
import { Tabs, Typography, Layout, Button, Modal, Form, Input, Select, InputNumber, message } from 'antd';
import StudentTable from '../components/Student/studentDataTable';
import TeacherTable from '../components/Teacher/teacherDataTable';
import { PlusCircleOutlined } from '@ant-design/icons';
import { addStudent } from '../api/studentApi';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const Roster = () => {
  const [activeKey, setActiveKey] = useState('1');
  const [refreshData, setRefreshData] = useState(0);
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const [isTeacherModalVisible, setIsTeacherModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const handleRefresh = () => {
    setRefreshData(prev => prev + 1);
  };

  const handleAddStudent = async (values) => {
    try {
      await addStudent(values);
      handleRefresh();
      setIsStudentModalVisible(false);
      form.resetFields();
      message.success('Student added successfully');
    } catch (error) {
      console.error('Error adding student:', error);
      message.error('Failed to add student');
    }
  };

  const handleAddTeacher = async (values) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error('Authentication token not found');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/teachers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          gender: values.gender.toUpperCase(),
          degree: values.degree.toUpperCase(),
          employmentType: values.employmentType.toUpperCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create teacher: ${response.status}`);
      }

      await response.json();
      handleRefresh();
      setIsTeacherModalVisible(false);
      form.resetFields();
      message.success('Teacher added successfully');
    } catch (error) {
      console.error('Error adding teacher:', error);
      message.error('Failed to add teacher. Please try again.');
    }
  };

  const items = [
    {
      label: 'Students',
      key: '1',
      children: (
        <div>
          <Button 
            type="primary" 
            icon={<PlusCircleOutlined />}
            style={{ marginBottom: 16 }}
            onClick={() => setIsStudentModalVisible(true)}
          >
            Add New Student
          </Button>
          <StudentTable key={`student-${refreshData}`} onRefresh={handleRefresh} />
        </div>
      ),
    },
    {
      label: 'Teachers',
      key: '2',
      children: (
        <div>
          <Button 
            type="primary" 
            icon={<PlusCircleOutlined />}
            style={{ marginBottom: 16 }}
            onClick={() => setIsTeacherModalVisible(true)}
          >
            Add New Teacher
          </Button>
          <TeacherTable key={`teacher-${refreshData}`} onRefresh={handleRefresh} />
        </div>
      ),
    }
  ];

  return (
    <Content className="content">
      <div>
        <Title level={4}>Roster</Title>
        <Text type='secondary'>List of Student(s) and Instructor(s) - Max 10 per page</Text>
        <Text type='secondary' style={{ float: 'right' }}>Filter by first and last name, age or email</Text>
      </div>
      <Tabs activeKey={activeKey} items={items} onChange={handleTabChange} />

      {/* Student Modal */}
      <Modal
        title="Add New Student"
        open={isStudentModalVisible}
        onCancel={() => setIsStudentModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddStudent} layout="vertical">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please enter first name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter last name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: 'Please enter age' }]}
          >
            <InputNumber min={1} max={100} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: 'Please enter phone number' },
              { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit phone number' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="gradeLevel"
            label="Grade Level"
            rules={[{ required: true, message: 'Please enter grade level' }]}
          >
            <InputNumber min={1} max={12} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button onClick={() => setIsStudentModalVisible(false)} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Teacher Modal */}
      <Modal
        title="Add New Teacher"
        open={isTeacherModalVisible}
        onCancel={() => setIsTeacherModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddTeacher} layout="vertical">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please enter first name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter last name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: 'Please enter phone number' },
              { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit phone number' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: 'Please enter age' }]}
          >
            <InputNumber min={18} max={100} />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="degree"
            label="Degree"
            rules={[{ required: true, message: 'Please select degree' }]}
          >
            <Select>
              <Option value="phd">PhD</Option>
              <Option value="masters">Masters</Option>
              <Option value="bachelors">Bachelors</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="experience"
            label="Experience (years)"
            rules={[{ required: true, message: 'Please enter experience' }]}
          >
            <InputNumber min={0} max={50} />
          </Form.Item>
          <Form.Item
            name="salary"
            label="Salary"
            rules={[{ required: true, message: 'Please enter salary' }]}
          >
            <InputNumber
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Form.Item
            name="employmentType"
            label="Employment Type"
            rules={[{ required: true, message: 'Please select employment type' }]}
          >
            <Select>
              <Option value="full-time">Full Time</Option>
              <Option value="part-time">Part Time</Option>
              <Option value="contract">Contract</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="subjects"
            label="Subjects"
            rules={[{ required: true, message: 'Please select subjects' }]}
          >
            <Select mode="multiple">
              <Option value="mathematics">Mathematics</Option>
              <Option value="physics">Physics</Option>
              <Option value="chemistry">Chemistry</Option>
              <Option value="biology">Biology</Option>
              <Option value="english">English</Option>
              <Option value="history">History</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button onClick={() => setIsTeacherModalVisible(false)} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default Roster;