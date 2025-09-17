import React from "react";
import styled from "styled-components";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
}

const TextInput: React.FC<TextInputProps> = ({ value, ...props }) => {
  const hasValue = Boolean(value && value.length > 0);
  return <StyledInput $hasValue={hasValue} value={value} {...props} />;
};

export default TextInput;

const StyledInput = styled.input<{ $hasValue: boolean }>`
  border: 1.5px solid var(--gray-300);
  border-radius: 10px;
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  flex: 1;
  box-sizing: border-box;

  color: ${(props) => (props.$hasValue ? "var(--black)" : "var(--gray-300)")};

  &:focus {
    outline: none;
    border-color: var(--main-pri);
    color: var(--black);
  }

  &::placeholder {
    color: var(--gray-300);
  }
`;
