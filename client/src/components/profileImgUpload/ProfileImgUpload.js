import { useState, useEffect } from 'react';
import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';

const ProfileImgUpload = (submitImg) => {
  // const dispatch = useDispatch();
  // const imagefile = useSelector(state => state.ProfileImg)
  const [image, setImage] = useState({
    image_file: "",
    preview_URL: "img/default_image.png",
  });
  const [selectedFile, setSelectedFile] = useState();
  const [errorMsg, setErrorMsg] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  let inputRef;

  // 이미지 preview 함수
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
    console.log(e.target.files[0])
  }

  // 이미지 upload 함수
  const sendImageToServer = async () => {
    console.log(image.image_file)
    if (image.image_file) {
      const formData = new FormData()
      const profileFormData = {
        "password": "test",
        "sectorId": 1,
        "service": ["RESERVATION"]
      }
      formData.append('file', image.image_file, { type: "application/json" })
      formData.append("data", new Blob([JSON.stringify(profileFormData)], { type: "multipart/form-data" }));
      console.log(formData.get('file'));
      const profileData = await axios.post(
        '/',
        formData,
        {
          "Content-Type": "multipart/form-data",
          "Accept": "application/json, multipart/form-data",
          headers: { Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5aXRza3lAbmF2ZXIuY29tIiwicm9sZSI6IlJPTEVfUkVTRVJWQVRJT04iLCJpYXQiOjE2NjMyMjE1MjMsImV4cCI6MTY2MzIyNTEyM30.QmL6f5YrfJlHxtZ02ZSVFCf85v1EyF1y3nTVKZ85J1YCc4I2SrOSXfZuC_QypTTkmYXm9VNt0zWrn7ea7Aqr5g" }
        });
      console.log(profileData);
      alert("서버에 이미지 등록이 완료되었습니다!");
      setImage({
        image_file: "",
        preview_URL: "img/default_image.png",
      });
    }
    else {
      alert("사진을 등록하세요!")
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={saveImage}
        // 클릭할 때 마다 file input의 value를 초기화 하지 않으면 버그가 발생할 수 있다
        // 사진 등록을 두개 띄우고 첫번째에 사진을 올리고 지우고 두번째에 같은 사진을 올리면 그 값이 남아있음!
        onClick={(e) => e.target.value = null}
        ref={refParam => inputRef = refParam}
        style={{ display: "none" }}
      />
      <div>
        <img src={image.preview_URL} />
      </div>
      <div>
        <button onClick={() => inputRef.click()}>
          Preview
        </button>
        <button onClick={sendImageToServer}>
          Upload
        </button>
      </div>

    </div>
  );
}

export default ProfileImgUpload;