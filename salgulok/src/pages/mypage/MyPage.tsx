import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ProfileInfoItem from "../../components/mypage/ProfileInfoItem";
import NavigationBar from "../../components/common/NavigationBar";
import LogCardList from "../../components/common/CardListItem";
import type { LogItem } from "../../components/common/CardListItem";
import Header from "../../components/common/Header";

const dummy: {
  nickname: string;
  intro: string;
  profileImg: string;
  logs: LogItem[];
} = {
  nickname: "제티",
  intro: "안뇽",
  profileImg: "",
  logs: [
    {
      id: "1",
      image: "",
      writer: "여행이좋아요",
      writerProfile: "",
      title: "25년 여름 제주는 아름다워",
      date: "250703-250807",
      likes: 17,
      comments: 25,
    },
    {
      id: "2",
      image: "",
      writer: "여행이좋아요",
      title: "산토리니 블루",
      date: "250703-250807",
      likes: 12,
      comments: 9,
    },
    {
      id: "3",
      image: "",
      writer: "여행이좋아요",
      title: "산토리니 블루",
      date: "250703-250807",
      likes: 12,
      comments: 9,
    },
  ],
};

const MyPage: React.FC = () => {
    const navigate = useNavigate();

    const handleEditPage = (file: File) => {
        navigate("/");
    };
  
    return (    
      <Container>
        <Header title="마이페이지" showBackButton/>

        <ContentWrapper>
          <ProfileInfoItem
            nickname={dummy.nickname}
            intro={dummy.intro}
            profileImg={dummy.profileImg}
          />
          <CardContainer>
            <LogCardList
              items={dummy.logs}
              onClick={(id) => console.log("open", id)}
              onToggleLike={(id) => console.log("like", id)}
            />
          </CardContainer>
        </ContentWrapper>

        <NavigationBar />
      </Container>
    );
}

export default MyPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: 16px;
  align-items: center;
  width: 100%;
`;

const CardContainer = styled.div`
  display: flex;
  margin: 0px 20px;
`;