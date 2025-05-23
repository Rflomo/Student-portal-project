import React, { useState, useEffect } from "react";
import {
  Descriptions,
  Typography,
  Button,
  Input,
  Select,
  notification,
  Row,
  Col,
} from "antd";

import { EditOutlined, CloseOutlined, SaveOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

const CourseDescription = ({ course }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedCourse, setEditedCourse] = useState(course);
  const [, setCourse] = useState(course);
  const [initialCourse, setInitialCourse] = useState(course);

  useEffect(() => {
    setEditedCourse(course);
    setInitialCourse(course);
  }, [course]);

  const generateCourseItems = () => {
    return [
      {
        label: "Course Name",
        children: editMode ? (
          <Input
            type="text"
            value={editedCourse.courseName}
            onChange={(e) =>
              setEditedCourse({
                ...editedCourse,
                courseName: e.target.value,
              })
            }
          />
        ) : (
          <span>{editedCourse.courseName}</span>
        ),
        span: {
          xs: 2,
          sm: 3,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        },
      },
      {
        label: "Course Description",
        children: editMode ? (
          <Input.TextArea
            // make this text area auto resize and make the height longer
            autoSize={{ minRows: 3, maxRows: 5 }}
            // make the height longer
            style={{ height: "100px" }}
            value={editedCourse.description}
            onChange={(e) =>
              setEditedCourse({
                ...editedCourse,
                description: e.target.value,
              })
            }
          />
        ) : (
          <span>{editedCourse.description}</span>
        ),
        span: {
          xs: 2,
          sm: 3,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        },
      },
      {
        label: "Abbreviation",
        children: editMode ? (
          <Input
            type="text"
            value={editedCourse.abbreviation}
            onChange={(e) =>
              setEditedCourse({
                ...editedCourse,
                abbreviation: e.target.value,
              })
            }
          />
        ) : (
          <span>{editedCourse.abbreviation}</span>
        ),
      },
      {
        label: "Duration",
        children: editMode ? (
          <Input
            type="number"
            value={editedCourse.length}
            onChange={(e) =>
              setEditedCourse({
                ...editedCourse,
                length: e.target.value,
              })
            }
          />
        ) : (
          <span>{editedCourse.length} weeks</span>
        ),
      },
      {
        label: "Online",
        children: editMode ? (
          <Select
            value={editedCourse.online ? "Yes" : "No"}
            onChange={(value) =>
              setEditedCourse({
                ...editedCourse,
                online: value === "Yes" ? true : false,
              })
            }
          >
            <Option value="Yes">Yes</Option>
            <Option value="No">No</Option>
          </Select>
        ) : editedCourse.online ? (
          "Yes"
        ) : (
          "No"
        ),
      },
      {
        label: "Onsite",
        children: editMode ? (
          <Select
            value={editedCourse.onsite ? "Yes" : "No"}
            onChange={(value) =>
              setEditedCourse({
                ...editedCourse,
                onsite: value === "Yes" ? true : false,
              })
            }
          >
            <Option value="Yes">Yes</Option>
            <Option value="No">No</Option>
          </Select>
        ) : editedCourse.onsite ? (
          "Yes"
        ) : (
          "No"
        ),
      },
      {
        label: "Cost",
        children: editMode ? (
          <Input
            type="number"
            value={editedCourse.cost}
            onChange={(e) =>
              setEditedCourse({
                ...editedCourse,
                cost: e.target.value,
              })
            }
          />
        ) : (
          "$" + editedCourse.cost
        ),
      },
      {
        label: "Course Difficulty",
        children: editMode ? (
          <Select
            value={editedCourse.level}
            onChange={(value) =>
              setEditedCourse({
                ...editedCourse,
                level: value,
              })
            }
          >
            <Option value="beginner">Beginner</Option>
            <Option value="intermediate">Intermediate</Option>
            <Option value="advanced">Advanced</Option>
            <Option value="expert">Expert</Option>
          </Select>
        ) : (
          <span>
            {editedCourse.level.charAt(0).toUpperCase() +
              editedCourse.level.slice(1)}{" "}
            Level
          </span>
        ),
      },
      {
        label: "Skills Covered",
        span: {
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 2,
          xxl: 2,
        },
        children: editMode ? (
          <Input
            type="text"
            value={editedCourse.skillsCovered.join(", ")}
            onChange={(e) =>
              setEditedCourse({
                ...editedCourse,
                skillsCovered: e.target.value.split(", "),
              })
            }
          />
        ) : (
          editedCourse.skillsCovered.join(", ")
        ),
      },
      {
        label: "Course Current Status",
        children: editMode ? (
          <Select
            value={editedCourse.courseStatus}
            onChange={(value) =>
              setEditedCourse({
                ...editedCourse,
                courseStatus: value,
              })
            }
          >
            <Option value="ongoing">Ongoing</Option>
            <Option value="completed">Completed</Option>
          </Select>
        ) : (
          editedCourse.courseStatus
        ),
      },
      {
        label: "Platform Compatibility",
        children: editMode ? (
          <Select
            mode="multiple"
            value={editedCourse.platformCompatibility}
            onChange={(values) =>
              setEditedCourse({
                ...editedCourse,
                platformCompatibility: values,
              })
            }
          >
            <Option value="laptop">Laptop</Option>
            <Option value="desktop">Desktop</Option>
            <Option value="phone">Phone</Option>
            <Option value="tablet">Tablet</Option>
            <Option value="virtual reality">Virtual Reality</Option>
          </Select>
        ) : (
          editedCourse.platformCompatibility.join(", ")
        ),
      },
      {
        label: "Flexible Learning Options",
        children: editMode ? (
          <Input
            type="text"
            value={editedCourse.flexibleLearningOptions.join(", ")}
            onChange={(e) =>
              setEditedCourse({
                ...editedCourse,
                flexibleLearningOptions: e.target.value.split(", "),
              })
            }
          />
        ) : (
          editedCourse.flexibleLearningOptions.join(", ")
        ),
      },
    ];
  };

  const dynamicCourseItems = generateCourseItems();

  const getChangedFields = (initialCourse, editedCourse) => {
    let changes = [];
    for (let key in initialCourse) {
      if (initialCourse[key] !== editedCourse[key]) {
        changes.push(key);
      }
    }
    return changes.join(", ");
  };

  const handleEditModeToggle = () => {
    if (
      editMode &&
      JSON.stringify(editedCourse) !== JSON.stringify(initialCourse)
    ) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to exit?"
        )
      ) {
        setEditedCourse(initialCourse);
        setEditMode(false);
      }
    } else {
      setEditMode(!editMode);
    }
  };

  window.onbeforeunload = (e) => {
    if (
      editMode &&
      JSON.stringify(editedCourse) !== JSON.stringify(initialCourse)
    ) {
      e.preventDefault();
      e.returnValue = "";
    }
  };

  const handleSaveChanges = async () => {
    // console.log(course);
    console.log("coursesa:", JSON.stringify(course, null, 2));
    // console.log(editedCourse);
    try {
      if (!course._id) {
        throw new Error("Course ID is undefined");
      }

      // Add a 2-second delay
      setTimeout(async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/courses/${course._id}`,
          {
            // And this line
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`

            },
            body: JSON.stringify(editedCourse),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Update the course state with the response data
        setCourse(data);
        // Exit edit mode
        setEditMode(false);

        // Get the changed fields to show success message after saving
        const changedFields = getChangedFields(initialCourse, editedCourse);

        // Show success message
        notification.success({
          message: "Course Updated",
          description: `The following fields have been updated: ${changedFields}`,
        });
      }, 500); // 2-second delay
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Row justify="space-between" align="middle">
        <Col>
          <h2>{editedCourse.abbreviation.toUpperCase()}</h2>
          <Text type="secondary">
            Below, you can find additional information about this course.
          </Text>
        </Col>
        <Col>
          <div style={{ textAlign: "right" }}>
            <Button
              onClick={handleEditModeToggle}
              className="btn-primary mt-2 mr-1"
            >
              {editMode ? <CloseOutlined /> : <EditOutlined />}
            </Button>
            {editMode && (
              <Button onClick={handleSaveChanges}>
                <SaveOutlined />
              </Button>
            )}
          </div>
        </Col>
      </Row>
      <Descriptions
        size="large"
        bordered
        column={{
          xs: 2,
          sm: 3,
          md: 4,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        items={dynamicCourseItems}
        style={{ marginTop: "20px" }}
      />
    </>
  );
};

export default CourseDescription;
