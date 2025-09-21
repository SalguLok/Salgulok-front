import ImageSlider from "./ImageSlider";
import styled, { css } from "styled-components";
import { Star } from "lucide-react";

export interface TemplateCardDoneProps {
  title: string;
  images?: string[];
  rating?: number;
  review: string;
  indexBadge?: string | number;
  onMenuClick?: () => void;
}

const TemplateCardDone: React.FC<TemplateCardDoneProps> = ({
  title,
  images,
  rating = 0,
  review,
  indexBadge = 1,
  onMenuClick,
}) => {
  return (
    <Layout aria-label={`${title} 카드`}>
      <CardContainer>
        <Header>
          <TitleArea>
            <Badge aria-label="순번">{indexBadge}</Badge>
            <Title title={title}>{title}</Title>
          </TitleArea>
          <MenuButton aria-label="more" onClick={onMenuClick}>
            ⋮
          </MenuButton>
        </Header>

        <ImageSlider images={images} title={title} />

        <Stars aria-label={`별점 ${rating}점`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              size={18}
              $active={i < Math.round(rating)}
              aria-hidden
            />
          ))}
        </Stars>

        <ReviewContainer>
          {review}
          asdfasdfasdfasdfasfasdfasdfasdfadsfasdfasdfasfaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        </ReviewContainer>
      </CardContainer>
    </Layout>
  );
};

export default TemplateCardDone;

const Layout = styled.div`
  display: flex;
  width: 335px;
  height: 373px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #fff;
  padding: 16px;
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

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #fb923c;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
          fill: #fb923c;
          color: #fb923c;
        `
      : css`
          color: #e5e7eb;
        `}
`;

const ReviewContainer = styled.div`
  display: flex;
  width: 300px;
`;

// const Review = styled.p`
//   font-size: 14px;
//   line-height: 1.6;
//   color: #374151;
//   white-space: pre-line;
// `;
