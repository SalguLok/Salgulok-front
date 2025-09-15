// components/common/Card.tsx
import styled from "styled-components";
import type { ReactNode, MouseEventHandler } from "react";

type CardProps = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  clickable?: boolean;
  className?: string;
};

const CardBase = ({ children, onClick, clickable, className }: CardProps) => (
  <Wrap $clickable={!!clickable} onClick={onClick} className={className}>
    {children}
  </Wrap>
);

export default CardBase;

const Wrap = styled.div<{ $clickable: boolean }>`
  background: var(--white);
  padding: 20px;
  border-bottom: 1px solid var(--gray-100);
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  user-select: none;
  &:active {
    background: ${({ $clickable }) => ($clickable ? "rgba(0,0,0,0.02)" : "inherit")};
  }
`;
