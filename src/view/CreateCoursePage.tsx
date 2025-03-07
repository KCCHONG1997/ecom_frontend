import React, { useState } from "react";
import { Form, Input, Select, Button, message, Card } from "antd";

const { Option } = Select;

const ProducerPage = () => {
  interface Course {
    courseName: string;
    category: string;
    price: number;
  }
  
  const [courses, setCourses] = useState<Course[]>([]);


  const onFinish = (values: Course) => {
    console.log("Form Values:", values); // Debugging step
    setCourses([...courses, values]); // Add new course
    message.success("Course added successfully!");
  };
  

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Create a New Course</h2>
      
      {/* Course Creation Form */}
      <Card>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Course Name"
            name="courseName"
            rules={[{ required: true, message: "Please enter course name" }]}
          >
            <Input placeholder="Enter course name" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Select a category">
              <Option value="programming">Programming</Option>
              <Option value="design">Design</Option>
              <Option value="marketing">Marketing</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Price ($)"
            name="price"
            rules={[{ required: true, message: "Please enter a price" }]}
          >
            <Input type="number" placeholder="Enter price" />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Add Course
          </Button>
        </Form>
      </Card>

      {/* Display Added Courses */}
      <h3 style={{ marginTop: 20 }}>Available Courses</h3>
      {courses.map((course, index) => (
        <Card key={index} style={{ marginTop: 10 }}>
          <p><b>Name:</b> {course.courseName}</p>
          <p><b>Category:</b> {course.category}</p>
          <p><b>Price:</b> ${course.price}</p>
        </Card>
      ))}
    </div>
  );
};

export default ProducerPage;
