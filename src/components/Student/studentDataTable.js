import React, { useState, useEffect, useRef } from "react";
import { Table, Modal, Form, Input, Button, Select, InputNumber } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { getAllStudents, updateStudent, deleteStudent } from '../../api/studentApi';

const { Option } = Select;
const { Item } = Form;
const { confirm } = Modal;

const StudentTable = ({ onRefresh }) => {
  const [students, setStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedStudent, setEditingStudent] = useState(null);
  const formRef = useRef();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getAllStudents();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudents();
  }, [onRefresh]);

  const handleEdit = (student) => {
    setEditingStudent(student);
    formRef.current?.setFieldsValue(student);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await formRef.current.validateFields();
      
      if (!editedStudent?.key) {
        console.error("Invalid student data for update");
        return;
      }

      const updateData = {
        firstName: values.firstName,
        lastName: values.lastName,
        age: values.age,
        gender: values.gender,
        email: values.email,
        phone: values.phone,
      };

      const updatedStudent = await updateStudent(editedStudent.key, updateData);
      
      if (updatedStudent) {
        setStudents(prevStudents =>
          prevStudents.map(student =>
            student._id === editedStudent.key ? updatedStudent : student
          )
        );
        setIsModalVisible(false);
        formRef.current?.resetFields();
        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (error) {
      console.error("Error updating student data:", error);
    }
  };

  const handleDelete = (student) => {
    confirm({
      title: "Confirm Deletion",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${student.firstName}?`,
      onOk() {
        handleDeleteConfirmed(student);
      },
      onCancel() {},
    });
  };

  const handleDeleteConfirmed = async (student) => {
    try {
      if (!student?.key) return;
      
      await deleteStudent(student.key);
      setStudents(prevStudents => prevStudents.filter(s => s._id !== student.key));
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting student data:', error);
    }
  };

  const studentDataTable = [
    {
      title: "First Name",
      dataIndex: "firstName",
      filters: students.map((student) => ({
        text: student.firstName,
        value: student.firstName,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.firstName.includes(value),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      filters: students.map((student) => ({
        text: student.lastName,
        value: student.lastName,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.lastName.includes(value),
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
      title: "Email",
      dataIndex: "email",
      filters: students.map((student) => ({
        text: student.email,
        value: student.email,
      })),
      filterSearch: true,
      onFilter: (value, record) => record.email.includes(value),
    },
    // ... rest of the code remains the same ...

{
  title: "Phone",
  dataIndex: "phone",
  render: (text, record) => {
    if (!record.phone) return '-'; // Handle null/undefined phone numbers
    const phoneNumber = record.phone.toString();
    const formattedPhone = `(${phoneNumber.substring(0, 3)}) ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`;
    return <span>{formattedPhone}</span>;
  },
},

// ... rest of the code remains the same ...
    {
      title: "Edit",
      render: (text, record) => (
        <Button onClick={() => handleEdit(record)}>
          <EditOutlined />
        </Button>
      ),
      width: "10px",
    },
    {
      title: "Delete",
      render: (text, record) => (
        <Button onClick={() => handleDelete(record)}>
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  const tableData = students.map((student) => ({
    key: student._id,
    firstName: student.firstName,
    lastName: student.lastName,
    age: student.age,
    gender: student.gender,
    email: student.email,
    phone: student.phone,
  }));

  return (
    <>
      <Table
        columns={studentDataTable}
        dataSource={tableData}
        rowKey={(student) => student.key}
      />

      <Modal
        title="Edit Student"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <p>
          Here is {editedStudent?.firstName}'s {editedStudent?.lastName}{" "}
          information. Update any part of the information using the form below.
        </p>

        <Form layout="vertical" onFinish={handleSave} ref={formRef}>
          <Form.Item
            hasFeedback
            label="First Name"
            name="firstName"
            validateDebounce={1000}
            rules={[
              { required: true, message: "Please enter first name" },
              { type: "string", message: "Please enter a valid first name" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Last Name"
            name="lastName"
            validateDebounce={1000}
            rules={[
              { required: true, message: "Please enter last name" },
              { type: "string", message: "Please enter a valid last name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Email"
            name="email"
            validateDebounce={1000}
            rules={[
              { required: true, message: "Please enter the email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Age"
            name="age"
            validateDebounce={1000}
            rules={[{ required: true, message: "Please enter age" }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Phone"
            name="phone"
            validateDebounce={1000}
            rules={[
              { required: true, message: "Please enter the phone number" },
              {
                pattern: /^\d{10}$/,
                message: "Please enter a valid 10-digit phone number",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>
            <Button key="save" type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default StudentTable;