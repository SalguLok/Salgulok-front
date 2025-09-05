import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import EditProfile from "../../components/mypage/ProfileEdit";
import FormField from "../../components/common/FormField";
import BottomButton from "../../components/common/BottomButton";

const dummy = { nickname: "제티", intro: "안뇽", profileImg: "" };

const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();

    const [nickname, setNickname] = useState(dummy.nickname);
    const [intro, setIntro] = useState(dummy.intro);
    const [profileImg, setProfileImg] = useState(dummy.profileImg);

    const handleEditProfile = () => {
        //TODO: 닉네임 중복확인
        const editData = {
            nickname,
            intro,
            profileImg
        }
        console.log(editData);
        //TODO: 수정 api 연결
    }

    const handleImageChange = (file: File) => {
        // TODO: 서버 업로드 로직 추가 후 해당 이미지로 변경
        setProfileImg("");
    };
  
    return (    
        <Container>
            <EditProfile imageUrl={profileImg} onChange={handleImageChange}/>

            <FormWrapper>
                <FormField
                    label="닉네임"
                    required
                    placeholder={nickname}
                    variant="sm"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
                <FormField
                    label="소개글"
                    placeholder={intro}
                    variant="md"
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                />
            </FormWrapper>
            
            <BottomButton
                text="수정하기"
                onClick={handleEditProfile}
            />
        </Container>
    );
}

export default EditProfilePage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 50px;  //임시
  align-items: center;
  width: 100%;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 335px;
  gap: 25px;
  margin: 0 20px;
`;