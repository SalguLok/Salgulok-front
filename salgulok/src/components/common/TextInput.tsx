import React from "react";
import styled from "styled-components";

interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  variant?: "sm" | "md" | "lg";
}

const TextInput: React.FC<TextAreaProps> = ({ variant = "md", ...props }) => {
  return <StyledTextarea $variant={variant} {...props} />;
};

export default TextInput;

const sizeMap = {
  sm: { height: "36px" },
  md: { height: "100px" },
  lg: { height: "196px" },
};

const StyledTextarea = styled.textarea<{ $variant?: "sm" | "md" | "lg" }>`
  border: 1.5px solid var(--gray-300);
  color: var(--gray-300);
  border-radius: 10px;
  flex: 1;
  height: ${(props) => sizeMap[props.$variant || "sm"].height};
  resize: none;
  padding: 10.8px 14px;
  font-size: 13px;
  line-height: 13px;
  align-items: center; 
  font-weight: 500;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--main-pri);
    color: var(--black);
  }

  &::placeholder {
    color: var(--gray-300);
  }
`;
