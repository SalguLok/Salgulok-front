import React from "react";
import styled from "styled-components";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "sm" | "md" | "lg";
}

const TextInput: React.FC<TextInputProps> = ({ variant = "md", ...props }) => {
  return <StyledInput $variant={variant} {...props} />;
};

export default TextInput;

const sizeMap = {
  sm: { height: "36px" },
  md: { height: "100px" },
  lg: { height: "196px" },
};

const StyledInput = styled.input<{ $variant?: "sm" | "md" | "lg" }>`
  border: 1.5px solid var(--gray-300);
  color: var(--gray-300);
  border-radius: 10px;
  flex: 1;
  height: ${(props) => sizeMap[props.$variant || "sm"].height};
  padding: 0 14px;
  font-size: 13px;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: var(--main-pri);
    color: var(--black);
  }

  &::placeholder {
    color: var(--gray-300);
  }
`;
