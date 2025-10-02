// components/common/Chip.tsx
import styled from "styled-components";

export const Chip = styled.button<{selected?: boolean}>`
  padding: 6.5px 17px; border-radius: 999px; border: 1px solid var(--gray-200);
  background: ${({selected}) => selected ? "rgba(255,102,51,0.08)" : "#fff"};
  color: ${({selected}) => selected ? "var(--main-pri)" : "#7D7D7D"};
  border-color: ${({selected}) => selected ? "var(--main-pri)" : "var(--gray-200)"};
  font-size: 13px; cursor: pointer;
`;
export const ChipRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 한 줄에 5개 요소 */
  gap: 7px;
  padding: 8px 0 16px;
`;
