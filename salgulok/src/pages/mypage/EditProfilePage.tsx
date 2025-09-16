import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import EditProfile from "../../components/mypage/ProfileEdit";
import FormField from "../../components/common/FormField";
import BottomButton from "../../components/common/BottomButton";
import Header from "../../components/common/Header";
import { nicknameDuplicate } from "../../api/user/nicknameDuplicate";
import { updateUserProfile } from "../../api/user/editProfile";
import { issueGetPresigned } from "../../api/image/issueGetPresigned";   // POST /images/presigned
import { getMyInfo } from "../../api/user/getMyProfile";
import { uploadImagesFlow } from "../../api/image/uploadFlow";

const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [originalUsername, setOriginalUsername] = useState("");
    const [intro, setIntro] = useState("");
    const [profileImg, setProfileImg] = useState("");
    const [profileImgObjectKey, setProfileImgObjectKey] = useState<string | null>(null);

    // 닉네임 중복 확인
    const [isNicknameValid, setIsNicknameValid] = useState(true);  // 사용 가능한 닉네임인지

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getMyInfo();
                setUsername(data.nickname);
                setOriginalUsername(data.nickname);
                setIntro(data.intro || "");
                if (data.profileImg) {
                    try {
                        const presignedData = await issueGetPresigned(data.profileImg);
                        if (presignedData.items.length > 0) {
                            setProfileImg(presignedData.items[0].presignedUrl);
                        }
                    } catch (e) {
                        setProfileImg(data.profileImg);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        if (username === originalUsername) {
            setIsNicknameValid(true);
        } else {
            setIsNicknameValid(false);
        }
    }, [username, originalUsername]);


    const handleCheck = async () => {
        if (!username.trim()) {
        alert("닉네임을 입력해주세요.");
        return;
        }

        if (username === originalUsername) {
            alert("현재 닉네임과 동일합니다.");
            setIsNicknameValid(true);
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
          const profileData: {
            username: string;
            intro: string | null;
            profileImg?: string | null;
          } = {
            username,
            intro: intro.trim() === "" ? null : intro,
          };

          if (profileImgObjectKey) {
            profileData.profileImg = profileImgObjectKey;
          }

          await updateUserProfile(profileData);
    
          alert("회원정보 변경이 완료되었습니다.");
          navigate("/mypage");
        } catch (error) {
          console.error("회원정보 변경 실패", error);
        }
    }

    // const handleImageChange = (file: File) => {
    //     // TODO: 서버 업로드 로직 추가 후 해당 이미지로 변경
    //     setProfileImg("");
    // };
    //
    const handleImageChange = async (file: File) => {
        // presigned → S3 PUT → confirm 은 그대로 수행
        // confirm 응답에서 최종 URL 추출
        // const finalUrl = confirmRes.items[0].url;

        // 여기서 바로 API 호출
        // await updateProfileImage({ profileImg: finalUrl });

        // 상태에도 반영해서 미리보기 업데이트
        // setProfileImg(finalUrl);

        if (!file) return;

        try {
            const uploadResult = await uploadImagesFlow([{ file }]);
            if (uploadResult.items.length === 0) {
                throw new Error("Image upload failed.");
            }
            const newObjectKey = uploadResult.items[0].objectKey;
            setProfileImgObjectKey(newObjectKey);

            const presignedData = await issueGetPresigned(newObjectKey);
            if (presignedData.items.length === 0) {
                throw new Error("Failed to get presigned URL for preview.");
            }
            const previewUrl = presignedData.items[0].presignedUrl;
            setProfileImg(previewUrl);
        } catch (error) {
            console.error("Error during image change:", error);
            alert("이미지 변경 중 오류가 발생했습니다.");
        }
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
