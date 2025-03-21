import React, { useState, useEffect, useContext } from "react";
import { BiCamera } from "react-icons/bi";
import "./ProfileEdit.css";
import { toast } from "react-toastify";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";

export const ProfileEdit = ({ user, setUser, setIsEditing }) => {
  const { userName, url } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    street: user.street || "",
    city: user.city || "",
    state: user.state || "",
    zipCode: user.zipCode || "",
    country: user.country || "",
    phone: user.phone || "",
    profilePicture: null,
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [preview, setPreview] = useState(user.profilePicture ? `${url}/${user.profilePicture}` : "/src/assets/user.png");

  useEffect(() => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      street: user.street || "",
      city: user.city || "",
      state: user.state || "",
      zipCode: user.zipCode || "",
      country: user.country || "",
      phone: user.phone || "",
      profilePicture: null, // Reset on user update
    });

    setPreview(user.profilePicture ? `${url}/${user.profilePicture}` : "/src/assets/user.png");
  }, [user, url]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const newImage = e.target.files[0];
      setFormData({ ...formData, profilePicture: newImage });

      const previewUrl = URL.createObjectURL(newImage);
      setPreview(previewUrl);

      toast.success("Profile image selected successfully");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
  
    const { firstName, lastName, street, city, state, zipCode, country, phone, profilePicture } = formData;
  
    if (!firstName || !lastName || !street || !city || !state || !zipCode || !country || !phone) {
      toast.error("Please fill in all fields");
      setIsUpdating(false);
      return;
    }
  
    const userData = new FormData();
    userData.append("firstName", firstName);
    userData.append("lastName", lastName);
    userData.append("street", street);
    userData.append("city", city);
    userData.append("state", state);
    userData.append("zipCode", zipCode);
    userData.append("country", country);
    userData.append("phone", phone);
  
    if (profilePicture) {
      userData.append("profilePicture", profilePicture);
    }
  
    try {
      const response = await axios.put(`${url}/api/users/update/${userName}`, userData, {
        headers: {
          "Content-Type": "multipart/form-data", // Correct content type
        },
      });
  
      if (response.data) {
        setUser((prevUser) => ({
          ...prevUser,
          ...formData,
          profilePicture: response.data.profilePicture || prevUser.profilePicture,
        }));
        setPreview(response.data.profilePicture ? `${url}/${response.data.profilePicture}` : "/src/assets/user.png");
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        toast.error("Error updating profile. Please try again.");
      }
    } catch (error) {
      console.error("Error details:", error);
      toast.error("Error updating profile!");
    } finally {
      setIsUpdating(false);
    }
  };
  

  const handleCancel = () => {
    toast.info("Changes canceled");
    setIsEditing(false);
  };

  return (
    <form className="myaccount" onSubmit={handleSubmit}>
      <div className="myaccount-left">
        <p className="myaccount-title">My Profile</p>
        <div className="profile-img-container">
          <img
            src={preview}
            alt="User Profile"
            className="profile-img"
          />
          <label className="camera-icon">
            <BiCamera />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </label>
        </div>
        <div className="myaccount-mutli-fields">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            placeholder="First Name"
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            placeholder="Last Name"
            onChange={handleChange}
          />
        </div>
        <input
          type="text"
          name="email"
          value={formData.email}
          placeholder="Email"
          disabled
        />
        <input
          type="text"
          name="street"
          value={formData.street}
          placeholder="Street"
          onChange={handleChange}
        />
        <div className="myaccount-mutli-fields">
          <input
            type="text"
            name="city"
            value={formData.city}
            placeholder="City"
            onChange={handleChange}
          />
          <input
            type="text"
            name="state"
            value={formData.state}
            placeholder="State"
            onChange={handleChange}
          />
        </div>
        <div className="myaccount-mutli-fields">
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            placeholder="Zip Code"
            onChange={handleChange}
          />
          <input
            type="text"
            name="country"
            value={formData.country}
            placeholder="Country"
            onChange={handleChange}
          />
        </div>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          placeholder="Phone"
          onChange={handleChange}
        />
        <div className="myaccount-button">
          <button
            type="submit"
            className="myaccount-upbutton"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            className="myaccount-cancelbutton"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileEdit;
