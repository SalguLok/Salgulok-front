import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import EditProfile from "../../components/mypage/ProfileEdit";
import FormField from "../../components/common/FormField";
import BottomButton from "../../components/common/BottomButton";
import Header from "../../components/common/Header";
import { nicknameDuplicate } from "../../api/user/nicknameDuplicate";
import { updateUserProfile } from "../../api/user/editProfile";
import { issueGetPresigned } from "../../api/image/issueGetPresigned"; // POST /images/presigned
import { getMyInfo } from "../../api/user/getMyProfile";
import { uploadImagesFlow } from "../../api/image/uploadFlow";
import ConfirmModal from "../../components/common/ConfirmModal";

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
  const [intro, setIntro] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [profileImgObjectKey, setProfileImgObjectKey] = useState<string | null>(
    null
  );

  // 닉네임 중복 확인
  const [isNicknameValid, setIsNicknameValid] = useState(true); // 사용 가능한 닉네임인지

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string>("");
  const [onConfirmHandler, setOnConfirmHandler] = useState<
    () => void | Promise<void>
  >(() => () => setConfirmOpen(false));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyInfo();
        setUsername(data.nickname);
        setOriginalUsername(data.nickname);
        setIntro(data.intro || "");

        if (data.profileImg) {
          let previewUrl = data.profileImg;

          try {
            const presignedData = await issueGetPresigned(data.profileImg);
            if (presignedData.items.length > 0) {
              previewUrl = presignedData.items[0].presignedUrl;
            }
          } catch (e) {
            console.warn("Presigned URL 발급 실패, 원본 사용", e);
          }

          setProfileImg(previewUrl); // 미리보기용 URL
          setProfileImgObjectKey(data.profileImg); // 서버에 보낼 ObjectKey
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
      setConfirmMessage("닉네임을 입력해주세요.");
      setOnConfirmHandler(() => () => setConfirmOpen(false));
      setConfirmOpen(true);
      return;
    }

    if (username === originalUsername) {
      setConfirmMessage("현재 닉네임과 동일합니다.");
      setOnConfirmHandler(() => () => setConfirmOpen(false));
      setConfirmOpen(true);
      setIsNicknameValid(true);
      return;
    }

    try {
      const res = await nicknameDuplicate({ username });

      if (res.duplicate) {
        setConfirmMessage("이미 사용 중인 닉네임입니다.");
        setIsNicknameValid(false);
      } else {
        setConfirmMessage("사용 가능한 닉네임입니다!");
        setIsNicknameValid(true);
      }
      setOnConfirmHandler(() => () => setConfirmOpen(false));
      setConfirmOpen(true);
    } catch (err) {
      console.error("닉네임 중복 확인 실패", err);
      setConfirmMessage("닉네임 확인 중 오류가 발생했습니다.");
      setOnConfirmHandler(() => () => setConfirmOpen(false));
      setConfirmOpen(true);
    }
  };

  // 회원정보 수정 제출
  const handleEditProfile = async () => {
    if (!isNicknameValid) {
      setConfirmMessage("닉네임 중복 확인을 먼저 해주세요.");
      setOnConfirmHandler(() => () => setConfirmOpen(false));
      setConfirmOpen(true);
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
        profileData.profileImg = profileImgObjectKey ?? profileImg ?? null;
      }

      await updateUserProfile(profileData);

      setConfirmMessage("회원정보 변경이 완료되었습니다.");
      setOnConfirmHandler(() => () => {
        setConfirmOpen(false);
        navigate("/mypage");
      });
      setConfirmOpen(true);
    } catch (error) {
      console.error("회원정보 변경 실패", error);
      setConfirmMessage("회원정보 변경에 실패했습니다.");
      setOnConfirmHandler(() => () => setConfirmOpen(false));
      setConfirmOpen(true);
    }
  };

  // const handleImageChange = (file: File) => {
  //     // TODO: 서버 업로드 로직 추가 후 해당 이미지로 변경
  //     setProfileImg("");
  // };
  //
  const handleImageChange = async (file: File | null) => {
    // presigned → S3 PUT → confirm 은 그대로 수행
    // confirm 응답에서 최종 URL 추출
    // const finalUrl = confirmRes.items[0].url;

    // 여기서 바로 API 호출
    // await updateProfileImage({ profileImg: finalUrl });

    // 상태에도 반영해서 미리보기 업데이트
    // setProfileImg(finalUrl);

    if (!file) {
      // 기본 이미지로 변경 시
      setProfileImg(""); // 미리보기 제거 (기본 이미지 표시됨)
      setProfileImgObjectKey(null); // 서버에 보낼 키도 초기화
      return;
    }

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
      setConfirmMessage("이미지 변경 중 오류가 발생했습니다.");
      setOnConfirmHandler(() => () => setConfirmOpen(false));
      setConfirmOpen(true);
    }
  };
  return (
    <Container>
      <Header title="마이페이지" showBackButton />
      <ContentWrapper>
        <EditProfile imageUrl={profileImg} onChange={handleImageChange} />

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
      <ConfirmModal
        open={confirmOpen}
        message={confirmMessage}
        confirmText="확인"
        showCancel={false}
        onConfirm={onConfirmHandler}
        onCancel={() => setConfirmOpen(false)}
      />
      <BottomButton text="수정하기" onClick={handleEditProfile} />
    </Container>
  );
};

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
