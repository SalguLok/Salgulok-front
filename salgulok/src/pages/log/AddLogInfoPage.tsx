import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import FormField from "../../components/common/FormField";
import ImageUpload from "../../components/common/ImageUpload";
import VisibilityToggle from "../../components/log/VisibilityTogle";
import BottomButton from "../../components/common/BottomButton";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAddLog = () => {
    // TODO: 로그생성 api 연결
    navigate("/log/add-complete");
  }

  const [visibility, setVisibility] = useState<"public" | "private">("public");
  
  return (    
    <Container>
      <FormWrapper>
      <FormField
        label="제목"
        required
        placeholder="로그 제목을 입력해주세요."
        variant="sm"
      />
      <FormField
        label="로그 한 줄 소개"
        placeholder="로그 한 줄 소개를 작성해주세요."
        variant="sm"
      />
      <VisibilityToggle onChange={setVisibility} />
      <ImageUpload label="대표사진"/>
    </FormWrapper>

    <BottomButton
      text="생성하기"
      onClick={handleAddLog}
    />
    </Container>
  );
}

export default SignupPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 50px;  //임시
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin: 0 20px;
`;