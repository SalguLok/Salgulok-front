import React from "react";
import styled from "styled-components";

interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  variant?: "sm" | "md" | "lg";
  value?: string;
}

const sizeMap = {
  sm: { height: "36px" },
  md: { height: "100px" },
  lg: { height: "196px" },
} as const;

const TextInput: React.FC<TextAreaProps> = ({ variant = "md", value, ...props }) => {
  const hasValue = Boolean(value && value.length > 0);

  return <StyledTextarea $variant={variant} $hasValue={hasValue} value={value} {...props} />;
};

export default TextInput;

const StyledTextarea = styled.textarea<{ $variant?: "sm" | "md" | "lg"; $hasValue: boolean }>`
  border: 1.5px solid var(--gray-300);
  border-radius: 10px;
  flex: 1;
  height: ${(props) => sizeMap[props.$variant ?? "sm"].height};
  resize: none;
  padding: 12px 14px;
  font-size: 13px;
  line-height: 13px;
  font-weight: 500;
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
