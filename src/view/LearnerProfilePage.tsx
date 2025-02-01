import React from "react";
import {
  Layout,
  Card,
  Avatar,
  Row,
  Col,
  Typography,
  Button,
  Divider,
  Tag,
} from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

const LearnerProfilePage: React.FC = () => {
  // Sample user data. Replace with your dynamic data as needed.
  const user = {
    name: "John Doe",
    title: "Software Engineer at Example Corp",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg", // Replace with a real image URL
    coverImage: null, // Simulate a null cover image for demonstration.
    location: "San Francisco, CA",
    connections: 500,
    about:
      "Passionate software engineer with expertise in frontend development and a knack for building scalable web applications.",
    recentlyLearnt: [
      {
        title: "Course A",
        courseName: "Software Engineering Basics",
        courseDesc: "An introductory course on software engineering principles.",
        courseStatus: "In Progress",
      },
    ],
    licensesAndCertificates: [
      {
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        issuedDate: "March 2023",
      },
      {
        name: "Google Cloud Associate Engineer",
        issuer: "Google Cloud",
        issuedDate: "January 2022",
      },
    ],
  };

  // Provide a default cover image if user.coverImage is null
  const defaultCoverImage =
    "https://dummyimage.com/1200x200/cccccc/000000.png?text=Default+Cover+Image";
  const coverImageUrl = user.coverImage || defaultCoverImage;

  // Sample badges data
  const badges = [
    { id: 1, title: "Top Learner" },
    { id: 2, title: "Quick Study" },
    { id: 3, title: "Innovator" },
  ];

  // Shadow Styling for Cards
  const cardStyle = {
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Soft shadow effect
    borderRadius: "8px",
  };

  return (
    <Layout style={{ background: "#f5f5f5", minHeight: "100vh", padding: "24px" }}>
      <Content>
        <Card bordered={false} style={{ ...cardStyle, padding: 0, marginBottom: "16px" }}>
          {/* Cover Image */}
          <div style={{ position: "relative" }}>
            <img
              src={coverImageUrl}
              alt="Cover"
              style={{ width: "100%", height: 200, objectFit: "cover" }}
            />
            {/* Profile Avatar positioned overlapping the cover */}
            <div style={{ position: "absolute", bottom: -40, left: 24 }}>
              <Avatar
                size={150}
                src={user.avatar}
                icon={!user.avatar ? <UserOutlined /> : undefined}
              />
            </div>
          </div>

          {/* User Info and Actions */}
          <div style={{ padding: "60px 24px 24px" }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={3} style={{ marginBottom: 0 }}>
                  {user.name}
                </Title>
                <Text type="secondary">{user.title}</Text>
                <div style={{ marginTop: 8 }}>
                  <Text>{user.location}</Text> &middot;{" "}
                  <Text>{user.connections} connections</Text>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Button type="primary">Email this Learner</Button>
                </div>
              </Col>
            </Row>

            <Divider />

            {/* Profile Sections */}
            <Row gutter={[16, 16]}>
              {/* Left Section: About, Recently Learnt, Licenses & Certificates */}
              <Col xs={24} lg={16}>
                <Card title="About Myself" style={{ ...cardStyle, marginBottom: 16 }}>
                  <Text>{user.about}</Text>
                </Card>

                <Card title="Recently Learnt" style={{ ...cardStyle, marginBottom: 16 }}>
                  {user.recentlyLearnt.map((item, index) => (
                    <div key={index} style={{ marginBottom: 12 }}>
                      <Title level={5} style={{ marginBottom: 0 }}>
                        {item.title || item.courseName}
                      </Title>
                      {item.courseDesc && (
                        <Text style={{ display: "block" }}>{item.courseDesc}</Text>
                      )}
                      {item.courseStatus && (
                        <Text type="secondary">&middot; {item.courseStatus}</Text>
                      )}
                    </div>
                  ))}
                </Card>

                <Card title="Licenses & Certificates" style={cardStyle}>
                  {user.licensesAndCertificates.map((cert, index) => (
                    <div key={index} style={{ marginBottom: 12 }}>
                      <Title level={5} style={{ marginBottom: 0 }}>
                        {cert.name}
                      </Title>
                      <Text>
                        Issued by {cert.issuer} &middot; {cert.issuedDate}
                      </Text>
                    </div>
                  ))}
                </Card>
              </Col>

              {/* Right Section: Badges */}
              <Col xs={24} lg={8}>
                <Card title="Badges" style={cardStyle}>
                  {badges.map((badge) => (
                    <Tag
                      key={badge.id}
                      color="geekblue"
                      style={{ marginBottom: "8px", marginRight: "8px" }}
                    >
                      {badge.title}
                    </Tag>
                  ))}
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default LearnerProfilePage;
