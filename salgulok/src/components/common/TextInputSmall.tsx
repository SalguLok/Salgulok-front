import React from "react";
import styled from "styled-components";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const TextInput: React.FC<TextInputProps> = (props) => {
  return <StyledInput {...props} />;
};

export default TextInput;

const StyledInput = styled.input`
  border: 1.5px solid var(--gray-300);
  color: var(--gray-300);
  border-radius: 10px;
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  flex:1;
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
