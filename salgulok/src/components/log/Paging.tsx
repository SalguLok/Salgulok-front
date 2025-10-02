import React from "react";
import styled from "styled-components";

interface PaginationProps {
  totalPages: number;
  currentPage: number; // 1-based
  onPageChange: (page: number) => void;
  listLength: number;
}

const Paging: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange, listLength }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1); // 1-based 배열

  return (
    <PaginationWrapper $isShort={listLength <= 4}>
      {pages.map((page) => (
        <PageButton
          key={page}
          $isActive={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </PageButton>
      ))}
    </PaginationWrapper>
  );
};

export default Paging;

const PaginationWrapper = styled.div<{ $isShort: boolean }>`
  display: flex;
  justify-content: center;
  margin: 12px 0px;
`;

const PageButton = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: ${({ $isActive }) => ($isActive ? "bold" : "normal")};
  color: ${({ $isActive }) => ($isActive ? "var(--main-pri)" : "var(--black)")};
  transition: color 0.2s;

  &:hover {
    color: var(--main-pri);
  }
`;