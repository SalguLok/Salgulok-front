import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

interface ProfileInfoItemProps {
  nickname: string;
  intro?: string;
  profileImgUrl?: string;
  isMine?: boolean;
}

const ProfileInfoItem: React.FC<ProfileInfoItemProps> = ({
  nickname,
  intro,
  profileImgUrl,
  isMine = true,
}) => {
  return (
    <Item>
      <ProfileImg src={profileImgUrl} alt="사용자 프로필" />
      <TextWrapper>
        <EditWrapper>
          <Nickname>{nickname}</Nickname>
          {isMine && <EditLink to="/mypage/edit">프로필 수정 &gt;</EditLink>}
        </EditWrapper>
        <Intro>{intro}</Intro>
      </TextWrapper>
    </Item>
  );
};

export default ProfileInfoItem;

const Item = styled.div`
  display: flex;
  align-items: center;
  width: 335px;
  height: auto;
  gap: 14px;
`;

const ProfileImg = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
  flex-shrink: 0;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

const EditWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const Nickname = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: var(--black);
`;

const Intro = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: var(--black);
`;

const EditLink = styled(Link)`
  font-size: 11px;
  font-weight: 400;
  color: var(--gray-500);
  text-decoration: none;
`;