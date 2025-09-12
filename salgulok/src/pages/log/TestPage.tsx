import React from "react";
import styled from "styled-components";

import CommentInputBar from "../../components/common/CommentInputBar";
import ActionMenu from "../../components/common/ActionMenu";

const AnyCommentInputBar = CommentInputBar as React.ComponentType<any>;
const AnyActionMenu = ActionMenu as React.ComponentType<any>;

export default function TestPage() {
    return (
        <Wrap>
            {/* 상단: CommentInputBar */}
            <AnyCommentInputBar placeholder="댓글 입력 미리보기" />

            <Divider />
            <AnyActionMenu />
        </Wrap>
    );
}

/* ===== styled ===== */
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 720px;
  margin: 40px auto;
  padding: 0 20px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 20px 0;
`;
