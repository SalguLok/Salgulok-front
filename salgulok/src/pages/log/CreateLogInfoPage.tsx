import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FormField from "../../components/common/FormField";
import ImageUpload from "../../components/common/ImageUpload";
import VisibilityToggle from "../../components/log/VisibilityTogle";
import BottomButton from "../../components/common/BottomButton";
import { useCreateLogStore } from "../../stores/CreateLogStore";
import Header from "../../components/common/Header";
import { createLog } from "../../api/log/createLog";
import type { LogCreateRequest } from "../../api/log/createLog";
import { uploadImagesFlow } from "../../api/image/uploadFlow";

const CreateLogInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { setStep3, regionId, startDate, endDate } = useCreateLogStore();

  const [title, setTitle] = useState("");
  const [oneReview, setOneReview] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [imgFile, setImgFile] = useState<File | null>(null);

  const handleAddLog = async () => {
    const step3Data = {
      title,
      isPublic: visibility === "public",
      imgFile: imgFile ?? undefined,
      oneReview,
    };
    setStep3(step3Data);

    if (!title) {
      console.log("로그 제목을 필수로 입력해주세요.");
      return;
    }

    let representativeImgKey = "";
    if (imgFile) {
      try {
        const uploadResult = await uploadImagesFlow([{ file: imgFile }]);
        if (uploadResult.items.length > 0) {
          representativeImgKey = uploadResult.items[0].objectKey;
        }
      } catch (error) {
        console.error("이미지 업로드에 실패했습니다.", error);
        // 사용자에게 오류를 알리는 UI 처리 (예: 토스트 메시지)를 여기에 추가할 수 있습니다.
        return; // 업로드 실패 시 로그 생성을 중단합니다.
      }
    }

    // 최종 데이터
    const finalData: LogCreateRequest = {
      regionId: regionId ?? 0,
      startDate: startDate ?? "",
      endDate: endDate ?? "",
      title,
      isPublic: visibility === "public",
      imgUrl: representativeImgKey,
      oneReview,
    };

    try {
      await createLog(finalData);
      navigate("/log/complete");
    } catch (err) {
      console.error(err);
    }
  };

  
  return (    
    <Container>
      <Header title="살구로그 생성" showBackButton/>
      <FormWrapper>
      <FormField
        label="제목"
        required
        placeholder="로그 제목을 입력해주세요."
        variant="sm"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <FormField
        label="로그 한 줄 소개"
        placeholder="로그 한 줄 소개를 작성해주세요."
        variant="sm"
        value={oneReview}
        onChange={(e) => setOneReview(e.target.value)}
      />
      <VisibilityToggle onChange={setVisibility} />
      <ImageUpload label="대표사진" onUpload={(file) => setImgFile(file)}/>
    </FormWrapper>

    <BottomButton
      text="생성하기"
      onClick={handleAddLog}
    />
    </Container>
  );
}

export default CreateLogInfoPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin: 30px 20px;
`;