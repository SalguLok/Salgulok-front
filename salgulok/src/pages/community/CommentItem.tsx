// pages/community/CommentItem.tsx
import Entry from "../../components/common/Entry";
import type { Comment } from "../../types/post";

type Props = { comment: Comment };

export default function CommentItem({ comment }: Props) {
  return (
    <Entry variant="comment">
      <Entry.Header avatar={comment.avatar} name={comment.user} meta={comment.date} />
      <Entry.Body>{comment.content}</Entry.Body>
      {/* 댓글엔 보통 Footer 없음 */}
    </Entry>
  );
}
