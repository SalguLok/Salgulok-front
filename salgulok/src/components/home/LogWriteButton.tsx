import styled from "styled-components";
import Plus from "../../assets/common/plus.svg?react";
import { useNavigate } from "react-router-dom";

const LogWriteButton = () => {
  const navigate = useNavigate();
  return (
    <ButtonContainer onClick={() => navigate("/log/create/region")}>
      <Plus />
      <Text>살구로그 생성</Text>
    </ButtonContainer>
  );
};
export default LogWriteButton;

const ButtonContainer = styled.div`
  display: flex;
  position: fixed;
  right: 0;
  bottom: 80px;
  width: 104px;
  height: 36px;
  border-radius: 20px;
  background-color: var(--main-pri);
  justify-content: center;
  align-items: center;
  gap: 3px;
  cursor: pointer;
`;
const Text = styled.text`
  font-size: 11px;
  font-weight: 600;
  color: var(--white);
`;
