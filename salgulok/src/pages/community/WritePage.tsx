import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BottomButton from "../../components/common/BottomButton";

const WritePage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>{"<"}</BackButton>
        <Title>글쓰기</Title>
      </Header>
      <SelectRow>
        <SelectBtn>지역선택 ▼</SelectBtn>
        <SelectBtn>주제 ▼</SelectBtn>
      </SelectRow>
      <InputTitle placeholder="제목을 입력해주세요" />
      <Divider />
      <InputContent placeholder="여행자들과 어떤 이야기를 나누고 싶으신가요?" />
      <WriteButton>
        <BottomButton text="등록" onClick={() => {/* 등록 로직 */}} />
      </WriteButton>
    </Container>
  );
};

export default WritePage;

const Container = styled.div`
  min-height: 100vh;
  background: var(--white);
  padding: 0 20px;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 28px;
  color: var(--black);
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
`;

const SelectRow = styled.div`
  display: flex;
  gap: 12px;
  margin: 24px 0 24px 0;
`;

const SelectBtn = styled.button`
  padding: 10px 22px;
  border: 1px solid var(--gray-200);
  border-radius: 24px;
  background: var(--white);
  color: var(--black);
  font-size: 16px;
  cursor: pointer;
`;

const InputTitle = styled.input`
  width: 100%;
  border: none;
  border-radius: 0;
  border-bottom: 2px solid var(--gray-200);
  font-size: 18px;
  padding: 16px 0 8px 0;
  margin-bottom: 8px;
  outline: none;
  color: var(--black);
  &::placeholder {
    color: var(--gray-300);
  }
`;

const Divider = styled.div`
  border-bottom: 1.5px solid var(--gray-200);
  margin-bottom: 8px;
`;

const InputContent = styled.textarea`
  width: 100%;
  border: none;
  font-size: 16px;
  color: var(--gray-400);
  resize: none;
  min-height: 32px;
  outline: none;
  &::placeholder {
    color: var(--gray-300);
  }
`;

const WriteButton = styled.div`
  position: fixed;
  right: 24px;
  bottom: 32px;
  z-index: 10;
`;