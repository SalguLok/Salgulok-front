import React, { useState } from "react";
import styled from "styled-components";

interface VisibilityToggleProps {
  onChange?: (value: "public" | "private") => void;
}

const VisibilityToggle: React.FC<VisibilityToggleProps> = ({ onChange }) => {
  const [value, setValue] = useState<"public" | "private">("public");

  const handleClick = (newValue: "public" | "private") => {
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <Wrapper>
      <Label>
        공개 여부 <RequiredMark>*</RequiredMark>
      </Label>
      <ButtonGroup>
        <ToggleButton
          selected={value === "public"}
          onClick={() => handleClick("public")}
        >
          공개
        </ToggleButton>
        <ToggleButton
          selected={value === "private"}
          onClick={() => handleClick("private")}
        >
          비공개
        </ToggleButton>
      </ButtonGroup>
    </Wrapper>
  );
};

export default VisibilityToggle;

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ToggleButton = styled.button<{ selected: boolean }>`
  width: 80px;
  height: 35px;
  border-radius: 8px;
  border: 1.5px solid
    ${(props) => (props.selected ? "var(--main-pri)" : "var(--gray-300)")};
  background-color: ${(props) =>
    props.selected ? "var(--main-pri)" : "var(--white)"};
  color: ${(props) => (props.selected ? "var(--white)" : "var(--gray-300)")};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
`;
