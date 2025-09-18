import styled from "styled-components";
import type { FC, MouseEvent } from "react";
import { useState, useEffect } from "react";
import Heart from "../../assets/common/heart.svg?react";
import Comment from "../../assets/common/comment.svg?react";
import Profile from "../../assets/common/profile_default.svg?react";
import Lock from "../../assets/mypage/lock.svg?react";
import { useNavigate } from "react-router-dom";
import { issueGetPresigned } from "../../api/image/issueGetPresigned";

export type LogItem = {
  id: number;
  image: string;
  writer: string;
  writerProfile?: string;
  isPublic?: boolean;
  title: string;
  date: string;
  likes: number;
  liked?: boolean;
  comments?: number;
  oneLine?: string;
};

type Props = {
  items: LogItem[];
  onClick?: (id: number) => void;
  onToggleLike?: (id: number, e: MouseEvent) => void;
  onClickMore?: (id: number, e: MouseEvent) => void;
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

  // if (!url) return <div {...props} />;

  return <img src={url} {...props} />;
};

const LogCardList: FC<Props> = ({ items, onClick, onClickMore }) => {
  const navigate = useNavigate();

  return (
    <Layout>
      {items.map((item) => (
        <Card
          key={item.id}
          onClick={() => {
            navigate(`/log/${item.id}`);
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
                <ReactionText>{item.comments}</ReactionText>
              </ReactionWrapper>
            </ReactionContainer>
          </ImageContainer>

          <DetailContainer>
            <WriterContainer>
              <WriterWrapper>
                {item.writerProfile ? (
                  <WriterImg objectKey={item.writerProfile} alt="" />
                ) : (
                  <Profile aria-hidden />
                )}
                <Writer>{item.writer}</Writer>
              </WriterWrapper>
              {onClickMore && (
                <MoreButton
                  aria-label="더보기"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClickMore(item.id, e);
                  }}
                />
              )}
            </WriterContainer>
            <Title>{item.title}</Title>
            <Date>
              {item.date} {item.isPublic ? "" : <Lock />}
            </Date>
          </DetailContainer>
        </Card>
      ))}
    </Layout>
  );
};

export default LogCardList;

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const Card = styled.div`
  border-radius: 10px;
  margin-bottom: 5px;
  background-color: white;
`;
const ImageContainer = styled.div`
  position: relative;
  width: 159px;
  height: 150px;
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
  margin: 8px 0px 0px 4px;
`;
const WriterContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;
const WriterWrapper = styled.div`
  display: flex;
  gap: 5px;
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
const MoreButton = styled.button`
  display: flex;
  width: 24px;
  height: 24px;
  border: 0;
  background: transparent;
  cursor: pointer;
  position: relative;
  border-radius: 50%;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 3px;
    height: 3px;
    background: #9aa0a6;
    border-radius: 50%;
    transform: translateY(-50%);
    box-shadow: 0 -6px 0 #9aa0a6, 0 6px 0 #9aa0a6;
  }
  &:active {
    background: rgba(0, 0, 0, 0.06);
  }
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
