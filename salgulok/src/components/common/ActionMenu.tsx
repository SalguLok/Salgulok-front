import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import deleteIcon from "../../assets/common/delete.svg";
import drawIcon from "../../assets/common/draw.svg";

// ...imports 동일
type ActionMenuProps = {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  x?: number;
  y?: number;
  maxWidth?: number;
  variant?: "context" | "modal"; // ★ 추가
  viewportWidth?: number; // ★ 추가 (기본 375)
};

const ActionMenu: React.FC<ActionMenuProps> = ({
  open,
  onClose,
  onEdit,
  onDelete,
  x = 0,
  y = 0,
  maxWidth = 280,
  variant = "context",
  viewportWidth = 375, // ★ 기본 375px
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        onClose();
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  const style =
    variant === "context" ? { left: x, top: y, maxWidth } : undefined;

  return (
    <Backdrop onClick={onClose} $center={variant === "modal"}>
      {variant === "modal" ? (
        <Viewport
          onClick={(e) => e.stopPropagation()}
          $width={viewportWidth}
          aria-label="modal viewport"
        >
          <Card ref={menuRef} $variant="modal">
            <HandleBar aria-hidden />
            <List>
              <Item
                onClick={() => {
                  onEdit();
                  onClose();
                }}
              >
                <Icon src={drawIcon} alt="수정 아이콘" />
                <Label>수정</Label>
              </Item>
              <Divider />
              <Item
                className="danger"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
              >
                <Icon src={deleteIcon} alt="삭제 아이콘" />
                <Label className="danger">삭제</Label>
              </Item>
            </List>
          </Card>
        </Viewport>
      ) : (
        <Card
          ref={menuRef}
          style={style}
          $variant="context"
          onClick={(e) => e.stopPropagation()}
        >
          <HandleBar aria-hidden />
          <List>
            <Item
              onClick={() => {
                onEdit();
                onClose();
              }}
            >
              <Icon src={drawIcon} alt="수정 아이콘" />
              <Label>수정</Label>
            </Item>
            <Divider />
            <Item
              className="danger"
              onClick={() => {
                onDelete();
                onClose();
              }}
            >
              <Icon src={deleteIcon} alt="삭제 아이콘" />
              <Label className="danger">삭제</Label>
            </Item>
          </List>
        </Card>
      )}
    </Backdrop>
  );
};

export default ActionMenu;

/* ================= styles ================= */
const Backdrop = styled.div<{ $center?: boolean }>`
  position: fixed;
  inset: 0;
  //background: rgba(0, 0, 0, 0.12);
  background: ${(p) => (p.$center ? "rgba(0, 0, 0, 0.12)" : "transparent")};
  z-index: 1000;
  // display: ${(p) => (p.$center ? "grid" : "flex")};
  display: ${(p) => (p.$center ? "grid" : "block")};
  place-items: ${(p) => (p.$center ? "center" : "unset")};
`;

/* 375px 뷰포트 래퍼 */
const Viewport = styled.div<{ $width: number }>`
  width: ${(p) => p.$width}px; /* 보이는 가상 기기 폭 */
  max-width: 100vw;
  padding: 0 16px; /* 좌우 여백 */
  box-sizing: border-box;
  display: grid;
  place-items: center; /* 내부 카드 중앙 정렬 */
`;

const Card = styled.div<{ $variant: "context" | "modal" }>`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  min-width: 180px;
  padding: 8px 0 10px;
  overflow: hidden;

  ${(p) =>
      p.$variant === "context" &&
      `
      position: absolute;
      transform: translate(calc(-100% - -10px), 5%); 
      /* ← 버튼 왼쪽으로 8px 띄우고, y는 중앙에 맞춤 */
    `}

  // ${(p) => p.$variant === "context" && `position: absolute;`}
  ${(p) => p.$variant === "modal" && `position: relative; width: 220px;`}
`;

const HandleBar = styled.div`
  width: 72px;
  height: 4px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.12);
  margin: 8px auto 6px;
`;

const List = styled.ul`
  list-style: none;
  padding: 4px 8px 8px;
  margin: 0;
`;
const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s ease;
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
  &.danger:hover {
    background: rgba(255, 59, 48, 0.08);
  }
`;
const Icon = styled.img`
  width: 20px;
  height: 20px;
`;
const Label = styled.span`
  font-size: 15px;
  line-height: 1;
  color: #000;
  &.danger {
    color: #ff3b30;
    font-weight: 600;
  }
`;
const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 6px;
`;