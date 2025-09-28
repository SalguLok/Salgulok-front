import React from "react";
import styled from "styled-components";
import TemplateAddIconUrl from "../../assets/log/template_add.svg";

type Props = {
    onAdd: () => void;
    disabled?: boolean;
    className?: string;
};

const TemplateAddButton: React.FC<Props> = ({
                                                onAdd,
                                                disabled = false,
                                                className,
                                            }) => {
    return (
        <Container className={className}>
            <AddButton
                type="button"
                onClick={onAdd}
                disabled={disabled}
                aria-label="템플릿 추가"
            >
                <img src={TemplateAddIconUrl} alt="템플릿 추가" />
            </AddButton>
        </Container>
    );
};

export default TemplateAddButton;

/* ===== styles ===== */
const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 16px 0;
`;

const AddButton = styled.button`
  width: 335px;
  height: 48px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: opacity 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
`;