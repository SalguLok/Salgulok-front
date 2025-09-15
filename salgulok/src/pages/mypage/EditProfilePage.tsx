import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import EditProfile from "../../components/mypage/ProfileEdit";
import FormField from "../../components/common/FormField";
import BottomButton from "../../components/common/BottomButton";
import Header from "../../components/common/Header";
import { nicknameDuplicate } from "../../api/user/nicknameDuplicate";
import { updateUserProfile } from "../../api/user/editProfile";

const dummy = { nickname: "제티", intro: "안뇽", profileImg: "" };

const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState(dummy.nickname);
    const [intro, setIntro] = useState(dummy.intro);
    const [profileImg, setProfileImg] = useState(dummy.profileImg);

    // 닉네임 중복 확인
    const [isNicknameValid, setIsNicknameValid] = useState(false);  // 사용 가능한 닉네임인지

    const handleCheck = async () => {
        if (!username.trim()) {
        alert("닉네임을 입력해주세요.");
        return;
        }

        try {
        const res = await nicknameDuplicate({ username });

        if (res.duplicate) {
            alert("이미 사용 중인 닉네임입니다.");
            setIsNicknameValid(false);
        } else {
            alert("사용 가능한 닉네임입니다!");
            setIsNicknameValid(true);
        }
        } catch (err) {
        console.error("닉네임 중복 확인 실패", err);
        alert("닉네임 확인 중 오류가 발생했습니다.");
        }
    };

    // 회원정보 수정 제출
    const handleEditProfile = async () => {
        if (!isNicknameValid) {
            alert("닉네임 중복 확인을 먼저 해주세요.");
            return;
        }

        try {
          await updateUserProfile({
            username,
            intro: intro.trim() === "" ? null : intro,
            profileImg: profileImg,
          });
    
          alert("회원정보 변경이 완료되었습니다.");
          navigate("/");
        } catch (error) {
          console.error("회원정보 변경 실패", error);
        }
    }

    const handleImageChange = (file: File) => {
        // TODO: 서버 업로드 로직 추가 후 해당 이미지로 변경
        setProfileImg("");
    };
  
    return (    
        <Container>
            <Header title="마이페이지" showBackButton/>
            <ContentWrapper>
                <EditProfile imageUrl={profileImg} onChange={handleImageChange}/>

                <FormWrapper>
                    <FormField
                        label="닉네임"
                        required
                        placeholder={username}
                        variant="sm"
                        value={username}
                        buttonText="중복 확인"
                        onButtonClick={handleCheck}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <FormField
                        label="소개글"
                        placeholder={intro}
                        variant="md"
                        value={intro}
                        onChange={(e) => setIntro(e.target.value)}
                    />
                </FormWrapper>
            </ContentWrapper>
            
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
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 30px;
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