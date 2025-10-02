import ImageSlider from "../common/ImageSlider";
import styled, { css } from "styled-components";
import { Star } from "lucide-react";
import { useState, useRef } from "react";
import ActionMenu from "../common/ActionMenu";
import Salgu from "../../assets/log/salgu.svg?react";
import { deleteTemplates } from "../../api/logEntry/deleteTemplate";
import ConfirmModal from "../common/ConfirmModal";
// import PresignedImage from "../common/PresignedImage";

export interface TemplateCardDoneProps {
  logId: number;
  placeName: string;
  title: string;
  entryId: number;
  templateId: number;
  images?: string[];
  rating?: number;
  review: string;
  indexBadge?: string | number;
  onMenuClick?: () => void;
  onChangeRating?: (value: number) => void;
  onEditClick?: () => void;
  onDeleteClick?: (templateId: number) => void;
  isOwner?: boolean;
}

const TemplateCardDone: React.FC<TemplateCardDoneProps> = ({
  logId,
  entryId,
  placeName,
  templateId,
  title,
  images,
  rating = 0,
  review,
  indexBadge = 1,
  onMenuClick,
  onEditClick,
  onDeleteClick,
  isOwner = false,
}) => {
  console.log("[TemplateCardDone images]", images);
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  menuPos;
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] =
    useState("정말로 삭제하시겠습니까?");
  const [onConfirmHandler, setOnConfirmHandler] = useState<
    () => void | Promise<void>
  >(() => () => setConfirmOpen(false));

  const openMenu = () => {
    onMenuClick?.();
    const rect = menuBtnRef.current?.getBoundingClientRect();

    //const GAP = 8; // 버튼과 메뉴 사이 간격
    const x = rect ? rect.left : 0; // 버튼의 왼쪽
    const y = rect ? rect.top + rect.height / 2 : 0; // 버튼의 세로 중앙

    setMenuPos({ x, y });
    setMenuOpen(true);
  };

  //삭제 API 연결
  const delTemplate = async () => {
    if (deleting) return;
    try {
      setDeleting(true);
      await deleteTemplates(logId, entryId, templateId);
      onDeleteClick?.(templateId);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setMenuOpen(false);
    }
  };

  // 삭제 메뉴 클릭 시: 모달로 한 번 더 확인
  const handleRequestDelete = () => {
    setConfirmMessage("정말로 삭제하시겠습니까?");
    setOnConfirmHandler(() => async () => {
      setConfirmOpen(false);
      await delTemplate();
    });
    setConfirmOpen(true);
  };

  return (
    <Layout aria-label={`${title} 카드`}>
      <CardContainer>
        <Header>
          <TitleArea>
            <IconWrapper>
              <Salgu />
              <Badge aria-label="순번">{indexBadge}</Badge>
            </IconWrapper>
            <Title title={placeName}>{placeName}</Title>
          </TitleArea>
          {isOwner && (
            <MenuButton ref={menuBtnRef} aria-label="more" onClick={openMenu}>
              ⋮
            </MenuButton>
          )}
        </Header>

        {isOwner && (
          <ActionMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            onEdit={() => onEditClick?.()}
            onDelete={handleRequestDelete}
            variant="context"
            x={menuPos.x}
            y={menuPos.y}
            maxWidth={220}
            viewportWidth={375}
          />
        )}

        <ImageSlider imageKeys={images} />

        <Stars aria-label={`별점 ${rating}점`} data-readonly>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              size={20}
              $active={i < Math.round(rating)}
              aria-hidden
            />
          ))}
        </Stars>

        <ReviewContainer>
          <ReviewText>{review}</ReviewText>
        </ReviewContainer>
      </CardContainer>

      <ConfirmModal
        open={confirmOpen}
        message={confirmMessage}
        confirmText="확인"
        cancelText="취소"
        onConfirm={onConfirmHandler}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />

      {/* <ActionMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onEdit={() => onEditClick?.()}
        onDelete={delTemplate}
        variant="context"
        x={menuPos.x}
        y={menuPos.y}
        maxWidth={220}
        viewportWidth={375}
      /> */}
    </Layout>
  );
};

export default TemplateCardDone;

const Layout = styled.div`
  display: flex;
  justify-content: center;
  width: 305px;
  padding: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const IconWrapper = styled.div`
  position: relative;
  align-items: center;
  justify-content: center;

  svg {
    width: 23px;
    height: 23px;
  }
`;

const Badge = styled.span`
  z-index: 999;
  position: absolute;
  top: 3.2px;
  right: 0.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: white;
  font-weight: 500;
  font-size: 15px;
`;
const Title = styled.h2`
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: -3px;
`;

const MenuButton = styled.button`
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 4px 6px;
`;
const Stars = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 4px;
`;

const StarIcon = styled(Star)<{ $active?: boolean }>`
  ${(p) =>
    p.$active
      ? css`
          fill: var(--main-pri);
          color: var(--main-pri);
        `
      : css`
          color: var(--gray-200);
        `}
`;

const ReviewContainer = styled.div`
  display: flex;
  width: 300px;
`;

const ReviewText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  white-space: pre-line;
`;
