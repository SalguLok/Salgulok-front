// src/components/common/TemplateActionButtons.tsx
import React from "react";
import styled, { css, keyframes } from "styled-components";

type Props = {
  onAdd?: () => void; // "추가" 클릭
  onSubmit?: () => void; // "등록" 클릭
  disabled?: boolean; // 둘 다 비활성
  loading?: boolean; // 등록 진행중 표시
  className?: string; // 스타일 확장용
};

const TemplateActionButtons: React.FC<Props> = ({
  onAdd,
  onSubmit,
  disabled,
  loading,
  className,
}) => {
  return (
    <Wrap className={className} aria-disabled={disabled || loading}>
      <AddButton
        type="button"
        onClick={onAdd}
        disabled={disabled || loading}
        aria-label="템플릿 추가"
      >
        추가
      </AddButton>

      <SubmitButton
        type="button"
        onClick={onSubmit}
        disabled={disabled || loading}
        aria-label="하루 기록 등록"
      >
        {loading ? <Spinner aria-label="등록 중" /> : "등록"}
      </SubmitButton>
    </Wrap>
  );
};

export default TemplateActionButtons;

/* ===== styles ===== */
const ORANGE = "#ED8E66";
//const BLACK = "#0F0F0F";
const RADIUS = "10px"; // 이미지처럼 둥근 모서리

const Wrap = styled.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;
`;

const baseBtn = css`
  height: 36px; /* 원본과 동일 높이 */
  padding: 0 14px;
  font-size: 14px;
  line-height: 1;
  border-radius: ${RADIUS};
  border: 1.5px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.04s ease, opacity 0.2s ease,
    background-color 0.2s ease, border-color 0.2s ease;
  letter-spacing: 0.2px;

  &:active {
    transform: translateY(1px);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }
`;

const AddButton = styled.button`
  ${baseBtn};
  background: #fff;
  color: ${ORANGE};
  border-color: 1px solid ${ORANGE};
  box-shadow: 0 0 0 1px ${ORANGE} inset; /* 얇은 아웃라인 느낌 */

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:focus-visible {
    outline: 2px solid ${ORANGE};
    outline-offset: 2px;
  }
`;

const SubmitButton = styled.button`
  ${baseBtn};
  background: ${ORANGE};
  color: #fff;

  &:hover:not(:disabled) {
    opacity: 0.92;
  }
  &:focus-visible {
    outline: 2px solid ${ORANGE};
    outline-offset: 2px;
  }
`;

/* 로딩 스피너 */
const spin = keyframes`
  to { transform: rotate(360deg); }
`;
const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  display: inline-block;
  animation: ${spin} 0.7s linear infinite;
`;
