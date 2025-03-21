import React, { useState, useContext, useEffect } from "react";
import { BiUser, BiMessage, BiHistory, BiHelpCircle, BiLogOut } from "react-icons/bi";
import { StoreContext } from "../../Context/StoreContext";
import "./ProfileSideBar.css";

const ProfileSideBar = ({ setActiveSection, activeSection }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userName, handleLogout } = useContext(StoreContext);

  useEffect(() => {
    if (userName) {
      fetch(`http://localhost:8080/api/users/getuser/${userName}`) // 🔹 Fetch user profile using userName
        .then((response) => response.json())
        .then((data) => {
          setProfile(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
          setLoading(false);
        });
    }
  }, [userName]);

  const handleBackgroundClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="profile-menu" onClick={() => handleBackgroundClick("profile")}>
      <div className="profile-header">
        {loading ? (
          <p>Loading profile...</p>
        ) : profile ? (
          <div className="profile-info">
            <img
              src={profile.image ? `/uploads/${profile.image}` : ""}
              className="profile-image"
            />
            <p className="profile-username">{userName}</p>
          </div>
        ) : (
          <p>Profile Not Found...</p>
        )}
      </div>

      <div className="profile-menu-list">
        <ul>
          <li>
            <a
              href="#"
              className={`profile-item ${activeSection === "profile" ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleBackgroundClick("profile");
              }}
            >
              <BiUser className="profile-icon" />
              My Profile
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`profile-item ${activeSection === "orderhistory" ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleBackgroundClick("orderhistory");
              }}
            >
              <BiHistory className="profile-icon" />
              Order History
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`profile-item ${activeSection === "usermessage" ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleBackgroundClick("usermessage");
              }}
            >
              <BiMessage className="profile-icon" />
              Message
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`profile-item ${activeSection === "userhelp" ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleBackgroundClick("userhelp");
              }}
            >
              <BiHelpCircle className="profile-icon" />
              Help
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`profile-item ${activeSection === "logout" ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
            >
              <BiLogOut className="profile-icon" />
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileSideBar;
