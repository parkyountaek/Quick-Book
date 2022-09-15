import Sidebar from "../../components/Sidebar/Sidebar";
import ProfileEditModal from "../../components/profileEditModal/ProfileEditModal";
import axios from "axios";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [sector, setSector] = useState("");
  const [service, setService] = useState("");
  const [isModal, setIsModal] = useState(false);

  const showModal = () => {
    console.log(isModal)
    setIsModal(true);
  }

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/members/profile",
      {
        headers: { Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5aXRza3lAbmF2ZXIuY29tIiwicm9sZSI6IlJPTEVfUkVTRVJWQVRJT04iLCJpYXQiOjE2NjMyMjE1MjMsImV4cCI6MTY2MzIyNTEyM30.QmL6f5YrfJlHxtZ02ZSVFCf85v1EyF1y3nTVKZ85J1YCc4I2SrOSXfZuC_QypTTkmYXm9VNt0zWrn7ea7Aqr5g" }
      }
    )
      .then(userData => {
        // console.log(userData.data.data)
        setUserInfo(userData.data.data);
        setUserInfo(userInfo);
        setSector(userData.data.data.sector.name)
        setService(userData.data.data.service[0])
      })
  }, [])

  return (
    <div>
      <Sidebar />
      {isModal && <ProfileEditModal setIsModal={setIsModal} />}
      <h1>프로필</h1>
      <div>
        <img src="https://avatars.githubusercontent.com/u/82711000?v=4.jpg" />
        <button onClick={showModal}>Edit</button>
        <div>
          <div>상호명: {userInfo.businessName}</div>
          <div>업종: {sector}</div>
          <div>관리자 명: {userInfo.name}</div>
          <div>전화번호: {userInfo.phone}</div>
        </div>
        <div>
          <div>이용중인 서비스 목록</div>
          <div>- {service}</div>

        </div>
      </div>
    </div>
  );
};
export default Profile;
