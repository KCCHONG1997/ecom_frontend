import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Layout,
  Card,
  Avatar,
  Row,
  Col,
  Typography,
  Divider,
  Tag,
  Button,
  Input,
  message,
} from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import PORT from "../hooks/usePort"; // Assuming PORT is exported from here

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

interface Course {
  title?: string;
  courseName?: string;
  courseDesc?: string;
  courseStatus?: string;
}

interface Certificate {
  name: string;
  issuer: string;
  issuedDate: string;
}

interface User {
  cover_image_url: string;
  profile_image_url: string;
  about_myself: string;
  occupation: string;
  company_name: string;
  connections: number;
  recentlyLearnt: Course[];
  licensesAndCertificates: Certificate[];
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
  learner_id: number;
  user_id: number;
}

interface Badge {
  id: number;
  title: string;
}

const LearnerProfile: React.FC = () => {
  const { userID } = useParams<{ userID: string }>();
  const [userData, setUserData] = useState<User | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for editing "About Myself"
  const [editing, setEditing] = useState<boolean>(false);
  const [aboutText, setAboutText] = useState<string>("");

  // Refs for file inputs
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Your backend base URL
  const backendURL = "http://localhost:5000/";

  // Retrieve logged-in user from sessionStorage
  const loggedUser = JSON.parse(sessionStorage.getItem("user") || "null");
  // isOwner is true if loggedUser is available and its user_id matches the profile's user_id
  const isOwner = loggedUser && userData && loggedUser.id == userData.user_id;
  console.log("loggedUser.id: ", loggedUser.id);
  console.log("userData.user_id: ", userData?.user_id);

  const fetchLearnerProfile = async (userID: string) => {
    try {
      const response = await fetch(`http://localhost:${PORT}/api/learnerProfileData/${userID}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const jsonData = await response.json();
      console.log(jsonData);
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${jsonData.error || "Unknown error"}`);
      }
      // Ensure arrays are defined
      jsonData.recentlyLearnt = jsonData.recentlyLearnt || [];
      jsonData.licensesAndCertificates = jsonData.licensesAndCertificates || [];
      setUserData(jsonData);
      setBadges(jsonData.badges || []);
      setAboutText(jsonData.about_myself || "");
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Error fetching user data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userID) {
      setError("No user ID provided.");
      setLoading(false);
      return;
    }
    fetchLearnerProfile(userID);
  }, [userID]);

  const updateAboutMyself = async () => {
    if (!userData) return;
    try {
      const response = await fetch(`http://localhost:${PORT}/api/learnerProfileData/updateAbout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          learner_id: userData.learner_id,
          about_myself: aboutText,
        }),
      });
      const jsonData = await response.json();
      if (!response.ok) {
        message.error(`Update failed: ${jsonData.error || "Unknown error"}`);
        return;
      }
      message.success("About Myself updated successfully!");
      setUserData({ ...userData, about_myself: aboutText });
      setEditing(false);
    } catch (err: any) {
      message.error("Error updating About Myself.");
      console.error(err);
    }
  };

  const uploadImage = async (file: File, type: "profile" | "cover") => {
    if (!userData) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("user_id", userData.user_id.toString());
    formData.append("type", type);
    try {
      const response = await fetch(`http://localhost:${PORT}/api/learnerProfile/uploadImage`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const jsonData = await response.json();
      if (!response.ok) {
        throw new Error(jsonData.error || "Upload failed");
      }
      message.success(`${type === "profile" ? "Profile" : "Cover"} image uploaded successfully!`);
      if (type === "profile") {
        setUserData({ ...userData, profile_image_url: jsonData.filePath });
      } else {
        setUserData({ ...userData, cover_image_url: jsonData.filePath });
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleProfilePicClick = () => {
    profileInputRef.current?.click();
  };

  const handleCoverPicClick = () => {
    coverInputRef.current?.click();
  };

  const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadImage(e.target.files[0], "profile");
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadImage(e.target.files[0], "cover");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No user data found.</div>;

  // Convert file paths to URL format with forward slashes and prepend backend URL
  const formattedProfilePic = userData.profile_image_url.replace(/\\/g, '/');
  const profileImageSrc = `${backendURL}${formattedProfilePic}`;
  const formattedCoverPic = userData.cover_image_url.replace(/\\/g, '/');
  const coverImageSrc = `${backendURL}${formattedCoverPic}`;

  const defaultCoverImage =
    "https://dummyimage.com/1200x200/cccccc/000000.png?text=Default+Cover+Image";
  const defaultAvatar =
    "https://dummyimage.com/150x150/cccccc/000000.png?text=No+Avatar";
  // Use the formatted URLs if available; otherwise fall back to default images
  const finalCoverImage = userData.cover_image_url ? coverImageSrc : defaultCoverImage;
  const finalProfileImage = userData.profile_image_url ? profileImageSrc : defaultAvatar;

  const cardStyle = {
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  };

  const fullName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim();
  const titleText =
    userData.occupation && userData.company_name
      ? `${userData.occupation} at ${userData.company_name}`
      : "";

  return (
    <Layout style={{ background: "#f5f5f5", minHeight: "100vh", padding: "24px" }}>
      <Content>
        <Card bordered={false} style={{ ...cardStyle, padding: 0, marginBottom: "16px" }}>
          {/* Cover Image */}
          <div style={{ position: "relative" }}>
            <img
              src={finalCoverImage}
              alt="Cover"
              style={{ width: "100%", height: 200, objectFit: "cover" }}
            />
            {isOwner && (
              <div style={{ position: "absolute", top: 8, right: 8 }}>
                <Button onClick={handleCoverPicClick}>Change Cover</Button>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={coverInputRef}
                  onChange={handleCoverFileChange}
                />
              </div>
            )}
            <div style={{ position: "absolute", bottom: -40, left: 24 }}>
              <Avatar
                size={150}
                src={finalProfileImage}
                icon={!userData.profile_image_url ? <UserOutlined /> : undefined}
              />
              {isOwner && (
                <div style={{ marginTop: 8, textAlign: "center" }}>
                  {/* Instead of a camera icon, we simply show a text link as before */}
                  <Button onClick={handleProfilePicClick} type="link">
                    Change Profile Picture
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={profileInputRef}
                    onChange={handleProfileFileChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div style={{ padding: "60px 24px 24px" }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={3} style={{ marginBottom: 0 }}>
                  {fullName}
                </Title>
                <Text type="secondary">{titleText}</Text>
                <div style={{ marginTop: 8 }}>
                  <Text>{userData.email}</Text> &middot;{" "}
                  <Text>{userData.phone_number}</Text>
                </div>
              </Col>
            </Row>
            <Divider />

            {/* About Myself Section with Edit Icon */}
            <Row style={{ marginBottom: 16 }}>
              <Col span={24}>
                <Card
                  title={
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>About Myself</span>
                      {isOwner && (
                        <EditOutlined onClick={() => setEditing(true)} style={{ cursor: "pointer" }} />
                      )}
                    </div>
                  }
                  style={cardStyle}
                >
                  {editing ? (
                    <>
                      <TextArea
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        rows={4}
                      />
                      <div style={{ marginTop: 8 }}>
                        <Button type="primary" onClick={updateAboutMyself}>
                          Save
                        </Button>
                        <Button
                          style={{ marginLeft: 8 }}
                          onClick={() => {
                            setAboutText(userData.about_myself);
                            setEditing(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Text>{userData.about_myself || "No information provided."}</Text>
                  )}
                </Card>
              </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
              {/* Left Section: Recently Learnt and Licenses & Certificates */}
              <Col xs={24} lg={16}>
                <Card title="Recently Learnt" style={{ ...cardStyle, marginBottom: 16 }}>
                  {userData.recentlyLearnt.length > 0 ? (
                    userData.recentlyLearnt.map((item, index) => (
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
                    ))
                  ) : (
                    "No courses learned yet."
                  )}
                </Card>
                <Card title="Licenses & Certificates" style={cardStyle}>
                  {userData.licensesAndCertificates.length > 0 ? (
                    userData.licensesAndCertificates.map((cert, index) => (
                      <div key={index} style={{ marginBottom: 12 }}>
                        <Title level={5} style={{ marginBottom: 0 }}>
                          {cert.name}
                        </Title>
                        <Text>
                          Issued by {cert.issuer} &middot; {cert.issuedDate}
                        </Text>
                      </div>
                    ))
                  ) : (
                    "No licenses or certificates found."
                  )}
                </Card>
              </Col>

              {/* Right Section: Badges */}
              <Col xs={24} lg={8}>
                <Card title="Badges" style={cardStyle}>
                  {badges && badges.length > 0 ? (
                    badges.map((badge) => (
                      <Tag key={badge.id} color="geekblue" style={{ marginBottom: "8px", marginRight: "8px" }}>
                        {badge.title}
                      </Tag>
                    ))
                  ) : (
                    "No badges yet."
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default LearnerProfile;
