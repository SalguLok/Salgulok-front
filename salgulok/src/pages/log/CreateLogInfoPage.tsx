import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FormField from "../../components/common/FormField";
import ImageUpload from "../../components/common/ImageUpload";
import VisibilityToggle from "../../components/log/VisibilityTogle";
import BottomButton from "../../components/common/BottomButton";
import { useCreateLogStore } from "../../stores/CreateLogStore";
import Header from "../../components/common/Header";
import ConfirmModal from "../../components/common/ConfirmModal";
import { createLog } from "../../api/log/createLog";
import type { LogCreateRequest } from "../../api/log/createLog";
import { uploadImagesFlow } from "../../api/image/uploadFlow";

const CreateLogInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { setStep3, regionId, startDate, endDate } = useCreateLogStore();

  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [imgFile, setImgFile] = useState<File | null>(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [createdLogId, setCreatedLogId] = useState<number>();

  const handleAddLog = async () => {
    const step3Data = {
      title,
      isPublic: visibility === "public",
      imgFile: imgFile ?? undefined,
    };
    setStep3(step3Data);

    if (!title) {
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
        return;
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
    };

    try {
      const createdLog = await createLog(finalData);
      setCreatedLogId(createdLog.logId);
      setShowLogoutModal(true);
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
      <VisibilityToggle onChange={setVisibility} />
      <ImageUpload label="대표사진" onUpload={(file) => setImgFile(file)}/>
    </FormWrapper>

    <BottomButton
      text="생성하기"
      onClick={handleAddLog}
    />

    {/*로그생성 완료 모달*/}
    <ConfirmModal
      open={showLogoutModal}
      message="로그 생성이 완료되었습니다."
      confirmText="확인"
      showCancel={false}
      onConfirm={async () => {
        setShowLogoutModal(false);
        navigate("/log/complete", { state: { logId: createdLogId } });
      }}
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
  margin: 20px 20px 30px 20px;
`;