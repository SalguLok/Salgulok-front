// pages/community/CommentItem.tsx
import Entry from "../../components/common/Entry";
import type { Comment } from "../../types/post";

export default function CommentItem({ c }: { c: Comment }) {
  return (
    <Entry variant="comment">
      <Entry.Header avatar={c.avatar} name={c.user} meta={c.date} />
      <Entry.Body>{c.content}</Entry.Body>
      {/* 댓글엔 보통 Footer 없음 */}
    </Entry>
  );
}
