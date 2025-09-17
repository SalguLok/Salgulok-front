import React from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import TextInputSmall from "./TextInputSmall";

interface FormFieldProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  variant?: "sm" | "md" | "lg";
  buttonText?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonClick?: () => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  placeholder,
  variant = "md",
  buttonText,
  value,
  onChange,
  onButtonClick,
}) => {
  // variant에 따라 다른 컴포넌트 선택
  const InputComponent = variant === "sm" ? TextInputSmall : TextInput;

  return (
    <Wrapper>
      <Label>
        {label}
        {required && <RequiredMark>*</RequiredMark>}
      </Label>
      <InputRow>
        <InputComponent 
          placeholder={placeholder} 
          value={value}
          onChange={onChange}
        />
        {buttonText && onButtonClick && (
          <ActionButton onClick={onButtonClick}>{buttonText}</ActionButton>
        )}
      </InputRow>
    </Wrapper>
  );
};

export default FormField;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: var(--black);
`;

const RequiredMark = styled.span`
  color: var(--main-pri);
  margin-left: 5px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: var(--main-pri);
  color: var(--white);
  border: none;
  border-radius: 10px;
  width: 80px;
  height: 36px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;