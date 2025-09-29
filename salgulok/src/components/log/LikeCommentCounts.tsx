import styled from "styled-components";
import type { FC, MouseEvent } from "react";
import { useEffect, useState } from "react";
import Heart from "../../assets/common/heart.svg?react";
import HeartOutline from "../../assets/common/heart-outline.svg?react";
import Comment from "../../assets/common/comment.svg?react";
import { getLogLikes, likeLog, unlikeLog } from "../../api/log/getLogLikes";
import { checkIfLiked } from "../../api/log/checkIfLiked";

interface Props {
    logId: number;
    commentCount: number;
    onClickComment?: (e: MouseEvent<HTMLButtonElement>) => void;
    size?: number; // 아이콘 크기
    gap?: number;  // 아이템 간격
    className?: string;
}

const Wrap = styled.div<{ gap: number }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ gap }) => `${gap}px`};
  color: #222;
`;

const Item = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  color: inherit;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }

  svg {
    display: block;
      overflow: visible;
  }
`;

const Count = styled.span`
  font-size: 13px;
  line-height: 1;
`;

const LikeCommentCounts: FC<Props> = ({
                                          logId,
                                          commentCount,
                                          onClickComment,
                                          size = 16,
                                          gap = 12,
                                          className,
                                      }) => {
    const [likeCount, setLikeCount] = useState<number | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [likes, liked] = await Promise.all([
                    getLogLikes(logId),
                    checkIfLiked(logId)
                ]);
                setLikeCount(likes);
                setIsLiked(liked);
            } catch (err) {
                console.error(`로그 [${logId}]의 좋아요 데이터를 불러오는데 실패했습니다.`, err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, [logId]);

    const handleLikeClick = async () => {
        if (likeCount === null) return;

        const newIsLiked = !isLiked;
        const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;

        setIsLiked(newIsLiked);
        setLikeCount(newLikeCount);

        try {
            if (newIsLiked) {
                await likeLog(logId);
            } else {
                await unlikeLog(logId);
            }
            // API 성공 후, 최신 데이터로 다시 동기화 (선택적)
            const freshLikeCount = await getLogLikes(logId);
            setLikeCount(freshLikeCount);

        } catch (err) {
            console.error(`좋아요/취소 처리 중 에러 발생:`, err);
            // 에러 발생 시 원래 상태로 롤백
            setIsLiked(!newIsLiked);
            setLikeCount(likeCount);
        }
    };

    return (
        <Wrap gap={gap} className={className}>
            <Item onClick={handleLikeClick} aria-label={isLiked ? "좋아요 취소" : "좋아요"} disabled={isLoading}>
                {isLiked ? (
                    <Heart width={size} height={size} />
                ) : (
                    <HeartOutline width={size} height={size} />
                )}
                <Count>{isLoading ? '...' : likeCount}</Count>
            </Item>

            <Item onClick={onClickComment} aria-label="댓글 보기">
                <Comment width={size} height={size} fill="#8C8C8C" />
                <Count>{commentCount}</Count>
            </Item>
        </Wrap>
    );
};

export default LikeCommentCounts;