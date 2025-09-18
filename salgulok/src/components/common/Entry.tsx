// components/common/Entry.tsx
import styled from "styled-components";
import type { ReactNode, MouseEvent } from "react";

type EntryProps = {
  variant?: "post" | "comment";
  clickable?: boolean;
  onClick?: () => void;
  children: ReactNode;
};

function Entry({ variant = "post", clickable, onClick, children }: EntryProps) {
  return (
    <Wrap $variant={variant} $clickable={!!clickable} onClick={onClick}>
      {children}
    </Wrap>
  );
}

type HeaderProps = {
  avatar: string;
  name: string;
  meta?: string;
  onMenuClick?: (e: MouseEvent) => void;
  menu?: ReactNode; // 기본값은 ⋮
};
Entry.Header = function Header({
  avatar,
  name,
  meta,
  onMenuClick,
  menu,
}: HeaderProps) {
  return (
    <HeaderRow>
      <Avatar src={avatar} alt={name} />
      <Info>
        <User>{name}</User>
        {meta && <Meta>{meta}</Meta>}
      </Info>
      <Menu
        aria-label="more"
        onClick={(e) => {
          e.stopPropagation();
          onMenuClick?.(e);
        }}
      >
        {menu ?? "⋮"}
      </Menu>
    </HeaderRow>
  );
};

Entry.Body = function Body({ children }: { children: ReactNode }) {
  return <Body>{children}</Body>;
};

Entry.Footer = function Footer({
  left,
  right,
}: {
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <FooterRow>
      <div>{left}</div>
      <div>{right}</div>
    </FooterRow>
  );
};

export default Entry;

// styles
const Wrap = styled.div<{ $variant: "post" | "comment"; $clickable: boolean }>`
  background: var(--white);
  padding: ${({ $variant }) => ($variant === "post" ? "20px" : "16px")};
  border-bottom: 1px solid var(--gray-100);
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;
const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 12px;
`;
const Info = styled.div`
  flex: 1;
`;
const User = styled.div`
  font-weight: 500;
  font-size: 13px;
`;
const Meta = styled.div`
  font-size: 11px;
  color: var(--gray-300);
`;
const Menu = styled.button`
  border: 0;
  background: transparent;
  font-size: 20px;
  color: var(--gray-300);
  cursor: pointer;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
