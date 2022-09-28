import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useRef } from 'react';
import styles from "./profileEditModal.module.css";
import noneProfile from "../../Img/Asset_5.png";
import axiosInstance from "../../api/axios";
import { useSelector } from "react-redux";

const ProfileEdit = ({ setIsModal }) => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [image, setImage] = useState({
    image_file: "",
    preview_URL: "img/default_image.png",
  });

  const navigate = useNavigate()
  const passwordRef = useRef()
  const nameRef = useRef()
  const confirmPasswordRef = useRef()
  const profileImg = useSelector(state => state.profileImg.value)
  console.log(profileImg)
  let inputRef;

  //프로필 수정 모달
  const modalClose = () => {
    setIsModal(false);
  };

  // 이미지 preview
  const saveImage = (e) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files[0]) {
      fileReader.readAsDataURL(e.target.files[0])
    }
    fileReader.onload = () => {
      setImage(
        {
          image_file: e.target.files[0],
          preview_URL: fileReader.result
        }
      )
    }
  }
  // 이미지 data,file(formData) 전송
  const profileEditSubmit = async () => {
    const passwordEdit = passwordRef.current.value;
    const confirmPasswordEdit = confirmPasswordRef.current.value;
    if (passwordEdit !== confirmPasswordEdit) {
      setErrMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    setIsLoading(true);
    if (!password) {
      setErrMessage('빈칸을 채워주세요');
      return;
    } else if (!image.image_file) {
      alert("사진을 등록하세요!")
    }
    else {
      const formData = new FormData()
      formData.enctype = "multipart/form-data"
      const profileFormData = {
        "email": "",
        "password": newPassword,
        "service": ["reservation", "keep"],
        "profileImg": "profile-img-url",
        "phone": "",
        "name": newName
      }
      formData.append('file', image.image_file)
      formData.append("data",
        new Blob([JSON.stringify(profileFormData)], { type: "application/json" }));
      console.log(formData.get('file'));
      const profileData = await axiosInstance({
        url: "/api/v1/members/profile",
        method: "POST",
        data: formData,
        headers: {
          Authorization: "Bearer ",
          "Content-Type": "multipart/form-data"
        }
      })
      console.log(profileData);
      alert("프로필 수정 완료!");
      setImage({
        image_file: "",
        preview_URL: "img/default_image.png",
      });
      navigate('/profile')
      window.location.reload();
    }
  }
  return (
    <div>
      <h1 className={styles.title}>프로필 수정</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="file"
          accept="image/*"
          onChange={saveImage}
          // 클릭할 때 마다 file input의 value를 초기화 하지 않으면 버그가 발생
          // 사진 등록을 두개 띄우고 첫번째에 사진을 올리고 지우고 두번째에 같은 사진을 올리면 그 값이 남아있음!
          onClick={(e) => e.target.value = null}
          ref={refParam => inputRef = refParam}
          style={{ display: "none" }}
        />
        <div>
          {profileImg === null? 
          <img src={noneProfile} /> : 
          <img src={image.preview_URL} />}
        </div>
        <div>
          <button onClick={() => inputRef.click()}>
            +
          </button>
        </div>
        <div>
          <div>
            <span>관리자 명 </span>
            <input
              type={"text"}
              onChange={(e) => setNewName(e.target.value)}
              ref={nameRef}
            />
          </div>
          <div>
            <span>새 비밀번호 </span>
            <input
              type={"password"}
              onChange={(e) => setNewPassword(e.target.value)}
              ref={passwordRef}
            />
          </div>
          <div>
            <span>새 비밀번호 확인 </span>
            <input
              type={"password"}
              onChange={(e) => setPassword(e.target.value)}
              ref={confirmPasswordRef}
            />
          </div>
        </div>
        <div>
          <div>이용중인 서비스 목록</div>
          <div>- 예약/대기 서비스</div>
          <div>- 관리 서비스</div>
        </div>
        {errMessage ? (
          <div>
            {errMessage}
          </div>
        ) : (
          ''
        )}
        <button type='submit' onClick={profileEditSubmit}>Edit</button>
        <button type='submit' onClick={modalClose}>Close</button>
      </form>
    </div>
  );
};
export default ProfileEdit;