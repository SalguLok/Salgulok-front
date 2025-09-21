import styled from "styled-components";
import { useRef, useState, type KeyboardEventHandler, type FC, type ReactNode } from "react";

type Props = {
    placeholder?: string;
    buttonText?: ReactNode;
    onSubmit?: (text: string) => void;
    maxLength?: number;
    initialValue?: string;
    disabled?: boolean;
    className?: string;
    autoFocus?: boolean;
};

const CommentInputBar: FC<Props> = ({
                                        placeholder = "댓글을 입력해주세요.",
                                        buttonText = "등록",
                                        onSubmit,
                                        maxLength = 500,
                                        initialValue = "",
                                        disabled = false,
                                        className,
                                        autoFocus,
                                    }) => {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    const submit = () => {
        const t = value.trim();
        if (!t || disabled) return;
        onSubmit?.(t);
        setValue("");
        inputRef.current?.blur();
    };

    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter") submit();
    };

    const isSubmitDisabled = disabled || value.trim().length === 0;

    return (
        <Container className={className}>
            <Input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                maxLength={maxLength}
                autoFocus={autoFocus}
                aria-label="댓글 입력"
            />
            <SubmitBtn
                type="button"
                onClick={submit}
                disabled={isSubmitDisabled}
                aria-label="댓글 등록"
            >
                {buttonText}
            </SubmitBtn>
        </Container>
    );
};

export default CommentInputBar;

/* ===== styles ===== */
const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  height: 40px;
  border-radius: 8px;
  outline: none;
  padding: 0 12px;
    border: 1px solid #ddd;
    font-size: 14px;
    font-family: "Pretendard", sans-serif;

    background-color: #fff;   
    color: #000;
    &::placeholder {
        color: #888;            /* ✅ placeholder 색 */
    }
`;

const SubmitBtn = styled.button`
  height: 40px;
  padding: 0 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  background-color: var(--main-pri);
  color: var(--white);
  font-size: 14px;
  font-weight: 600;
  font-family: "Pretendard", sans-serif;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
