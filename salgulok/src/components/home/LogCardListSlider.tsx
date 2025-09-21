import styled from "styled-components";
import type { FC, MouseEvent } from "react";
import { useState, useEffect } from "react";
import Heart from "../../assets/common/heart.svg?react";
import Comment from "../../assets/common/comment.svg?react";
import Profile from "../../assets/common/profile_default.svg?react";
import { useNavigate } from "react-router-dom";
import { issueGetPresigned } from "../../api/image/issueGetPresigned";

export type LogItem = {
  id: number;
  image: string;
  writer: string;
  writerProfile?: string;
  title: string;
  date: string;
  likes: number;
  liked?: boolean;
  comments?: number;
};

type Props = {
  items: LogItem[];
  onClick?: (id: number) => void;
  onToggleLike?: (id: number, e: MouseEvent) => void;
};

const PresignedImage: FC<{
  objectKey?: string | null;
  src?: string;
  [key: string]: any;
}> = ({ objectKey, ...props }) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!objectKey) {
      setUrl("");
      return;
    }

    const fetchUrl = async () => {
      try {
        const res = await issueGetPresigned(objectKey);
        if (res.items && res.items.length > 0) {
          setUrl(res.items[0].presignedUrl);
        } else {
          setUrl("");
        }
      } catch (e) {
        console.error("Failed to get presigned URL", e);
        setUrl("");
      }
    };

    fetchUrl();
  }, [objectKey]);

  //if (!url) return <div {...props} />;

  return <img src={url} {...props} />;
};

const LogCardListSlider: FC<Props> = ({ items, onClick }) => {
  const navigate = useNavigate();

  return (
    <Layout>
      {items.map((item) => (
        <Card
          key={item.id}
          onClick={() => {
            navigate(`/log/${item.id}/entries`);
            onClick?.(item.id);
          }}
        >
          <ImageContainer>
            <CoverImg objectKey={item.image} alt="" loading="lazy" />
            <ReactionContainer>
              <ReactionWrapper>
                <Heart />
                <ReactionText>{item.likes}</ReactionText>
              </ReactionWrapper>
              <ReactionWrapper>
                <Comment />
                <ReactionText>{item.comments || 0}</ReactionText>
              </ReactionWrapper>
            </ReactionContainer>
          </ImageContainer>

          <DetailContainer>
            <WriterContainer>
              {item.writerProfile ? (
                <WriterImg objectKey={item.writerProfile} alt="" />
              ) : (
                <Profile aria-hidden />
              )}
              <Writer>{item.writer}</Writer>
            </WriterContainer>
            <Title>{item.title}</Title>
            <Date>{item.date}</Date>
          </DetailContainer>
        </Card>
      ))}
    </Layout>
  );
};

export default LogCardListSlider;

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;

  /* 가로 슬라이드 */
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  touch-action: pan-x;

  /* 스크롤바 숨김 */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* 왼쪽 여백만, 오른쪽은 0 → 끝에 공백 없음 */
  padding-left: 20px;
  padding-right: 20px;

  /* 스냅 기준도 왼쪽만 */
  scroll-padding-left: 20px;
  scroll-padding-right: 20px;
`;

const Card = styled.div`
  border-radius: 10px;
  margin-bottom: 5px;

  /* 카드 폭 고정 + 스냅 포인트 */
  flex: 0 0 154px;
  scroll-snap-align: start;

  /* 혹시 전역/상위 스타일에서 margin-right가 들어온 경우 대비 */
  &:last-child {
    margin-right: 0;
  }
`;
const ImageContainer = styled.div`
  position: relative;
  width: 154px;
  height: 144px;
  background-color: var(--gray-300);
  border-radius: 10px;
  overflow: hidden;
`;
const CoverImg = styled(PresignedImage)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const ReactionContainer = styled.div`
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: flex;
  gap: 6px;
  background-color: var(--white);
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  padding: 5px 7px;
`;
const ReactionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;
const ReactionText = styled.div`
  font-size: 11px;
  font-weight: 400;
  line-height: 100%;
`;
const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 4px 4px 4px;
`;
const WriterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
`;
const WriterImg = styled(PresignedImage)`
  width: 17px;
  height: 17px;
  border-radius: 50%;
  object-fit: cover;
`;
const Writer = styled.span`
  font-size: 13px;
  font-weight: 400;
`;
const Title = styled.span`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 3px;
`;
const Date = styled.span`
  color: var(--gray-400);
  font-family: Pretendard;
  font-size: 11px;
`;
