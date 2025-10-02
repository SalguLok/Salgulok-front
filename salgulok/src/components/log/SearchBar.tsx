import React, { forwardRef, useCallback } from "react";
import styled from "styled-components";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  onFocus?: React.InputHTMLAttributes<HTMLInputElement>["onFocus"];
  onBlur?: React.InputHTMLAttributes<HTMLInputElement>["onBlur"];
};

const SearchBar = forwardRef<HTMLInputElement, Props>(
  (
    {
      value,
      onChange,
      onSubmit,
      placeholder = "검색을 통해 로그를 찾아보세요",
      className,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && onSubmit) {
          onSubmit(value.trim());
        }
      },
      [onSubmit, value]
    );

    return (
      <Wrapper className={className} role="search" aria-label="검색">
        <Icon aria-hidden="true" viewBox="0 0 24 24">
          <path
            d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm8.707 12.293-2.83-2.83a1 1 0 1 0-1.415 1.415l2.83 2.83a1 1 0 0 0 1.415-1.415Z"
            fill="currentColor"
          />
        </Icon>

        <Input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-label="검색어 입력"
        />
      </Wrapper>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;

/* ===== Styles ===== */

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  /* 사이즈 */
  height: 36px; /* 이미지 비율에 맞춤 */
  width: 100%;
  max-width: 340px; /* 필요 시 부모에서 override 가능 */

  /* 배경/테두리 */
  background: #ffffff;
  border: 1px solid #ececec;
  border-radius: 10px;

  /* 살짝 떠보이는 그림자 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;

  /* 내부 패딩: 아이콘 공간 + 입력 여백 */
  padding-left: 34px;
  padding-right: 12px;
`;

const Icon = styled.svg`
  position: absolute;
  left: 10px;
  width: 18px;
  height: 18px;
  color: #b8b8b8;
`;

const Input = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;

  font-size: 13px;
  color: #222;

  ::placeholder {
    color: #b8b8b8; /* 흐린 회색 */
  }
`;
