import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import profile from "../../assets/common/profile_default.svg?url";
import { getMyInfo } from "../../api/user/getMyProfile";
import type { UserResponse } from "../../api/user/getMyProfile";
import { issueGetPresigned } from "../../api/image/issueGetPresigned";

const ProfileInfoItem: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserResponse | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(profile);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyInfo();
        setUserInfo(data);

        if (data.profileImg) {
          try {
            const presignedData = await issueGetPresigned(data.profileImg);
            if (presignedData.items.length > 0) {
              setProfileImageUrl(presignedData.items[0].presignedUrl);
            }
          } catch (e) {
            console.error("Failed to get presigned URL", e);
          }
        } else {
          setProfileImageUrl(profile);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <Item>
        <ProfileImg src={profileImageUrl} alt="사용자 프로필" />

        <TextWrapper>
          <EditWrapper>
            <Nickname>{userInfo?.nickname}</Nickname>
            <EditLink to="/mypage/edit">프로필 수정 &gt;</EditLink>
          </EditWrapper>
          <Intro>{userInfo?.intro}</Intro>
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
