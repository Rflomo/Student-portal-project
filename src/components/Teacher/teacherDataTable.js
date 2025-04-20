import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Tag,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { fetchTeachers, updateTeacher, deleteTeacher } from '../../api/teacherApi';
import { DateTime } from "luxon";

const { Option } = Select;
const { confirm } = Modal;

const TeacherTable = ({ onRefresh }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedTeacher, setEditingTeacher] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const formRef = useRef();

  useEffect(() => {
    fetchTeachersData();
  }, [onRefresh]);

  const fetchTeachersData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const data = await fetchTeachers(token);
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      message.error("Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    formRef.current?.setFieldsValue(teacher);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      if (!editedTeacher?.key) {
        message.error("Invalid teacher data for update");
        return;
      }

      const values = await formRef.current.validateFields();
      const token = localStorage.getItem("token");
      const updatedTeacher = await updateTeacher(editedTeacher.key, values, token);
      
      setTeachers(prevTeachers =>
        prevTeachers.map(teacher =>
          teacher._id === updatedTeacher._id ? updatedTeacher : teacher
        )
      );
      
      message.success("Teacher updated successfully");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating teacher:", error);
      message.error("Failed to update teacher");
    }
  };

  const handleDelete = (teacher) => {
    confirm({
      title: "Confirm Deletion",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${teacher.firstName}?`,
      onOk() {
        handleDeleteConfirmed(teacher);
      },
    });
  };

  const handleDeleteConfirmed = async (teacher) => {
    try {
      if (!teacher?.key) return;
      
      const token = localStorage.getItem("token");
      await deleteTeacher(teacher.key, token);
      
      setTeachers(prevTeachers => prevTeachers.filter(t => t._id !== teacher.key));
      message.success("Teacher deleted successfully");
    } catch (error) {
      console.error("Error deleting teacher:", error);
      message.error("Failed to delete teacher");
    }
  };

  const teacherDataTable = [
    {
      title: "First Name",
      dataIndex: "firstName",
      filters: teachers.map((teacher) => ({
        text: teacher.firstName,
        value: teacher.firstName,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.firstName.includes(value),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      filters: teachers.map((teacher) => ({
        text: teacher.lastName,
        value: teacher.lastName,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.lastName.includes(value),
    },
    {
      title: "Email",
      dataIndex: "email",
      filters: teachers.map((teacher) => ({
        text: teacher.email,
        value: teacher.email,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.email.includes(value),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (text, record) => {
        if (!record.phone) return '-';
        const phoneNumber = record.phone.toString();
        const formattedPhone = `(${phoneNumber.substring(0, 3)}) ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`;
        return <span>{formattedPhone}</span>;
      },
    },
    {
      title: "Age",
      dataIndex: "age",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Degree",
      dataIndex: "degree",
    },
    {
      title: "Experience",
      dataIndex: "experience",
      sorter: (a, b) => a.experience - b.experience,
    },
    {
      title: "Salary (USD)",
      dataIndex: "salary",
      sorter: (a, b) => a.salary - b.salary,
      render: (salary) => `$${salary.toLocaleString()}`,
    },
    {
      title: "Employment Type",
      dataIndex: "employmentType",
    },
    {
      title: "Subjects",
      dataIndex: "subject",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ];

  const tableData = teachers.map((teacher) => ({
    key: teacher._id,
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    email: teacher.email,
    phone: teacher.phone,
    age: teacher.age,
    gender: teacher.gender,
    degree: teacher.degree,
    experience: teacher.experience,
    salary: teacher.salary,
    employmentType: teacher.employmentType,
    subject: teacher.subjects?.map((subject, index) => (
      <Tag color="blue" key={index}>{subject}</Tag>
    )),
  }));

  return (
    <>
      <Table
        loading={loading}
        columns={teacherDataTable}
        dataSource={tableData}
        rowKey={(record) => record.key}
        scroll={{ x: true }}
      />

      <Modal
        title="Edit Teacher"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSave} ref={formRef}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter phone number" },
              {
                pattern: /^\d{10}$/,
                message: "Please enter a valid 10-digit phone number"
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: "Please enter age" }]}
          >
            <InputNumber min={18} max={100} />
          </Form.Item>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Select>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Degree"
            name="degree"
            rules={[{ required: true, message: "Please select degree" }]}
          >
            <Select>
              <Option value="phd">PhD</Option>
              <Option value="masters">Masters</Option>
              <Option value="bachelors">Bachelors</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Experience (years)"
            name="experience"
            rules={[{ required: true, message: "Please enter experience" }]}
          >
            <InputNumber min={0} max={50} />
          </Form.Item>
          <Form.Item
            label="Salary"
            name="salary"
            rules={[{ required: true, message: "Please enter salary" }]}
          >
            <InputNumber
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Form.Item
            label="Employment Type"
            name="employmentType"
            rules={[{ required: true, message: "Please select employment type" }]}
          >
            <Select>
              <Option value="full-time">Full Time</Option>
              <Option value="part-time">Part Time</Option>
              <Option value="contract">Contract</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Subjects"
            name="subjects"
            rules={[{ required: true, message: "Please select subjects" }]}
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
              Save Changes
            </Button>
            <Button onClick={() => setIsModalVisible(false)} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TeacherTable;