import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ProfileInfoItem from "../../components/mypage/ProfileInfoItem";
import NavigationBar from "../../components/common/NavigationBar";
import LogCardList from "../../components/common/CardListItem";
import type { LogItem } from "../../components/common/CardListItem";
import HeaderLeft from "../../components/common/HeaderLeft";
import { getMyLogs } from "../../api/log/getMyLog";

const MyPage: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getMyLogs();

        const mappedLogs: LogItem[] = res.logs.map((log) => ({
          id: String(log.logId),
          image: log.imgUrl ?? "",
          writer: log.writer,
          writerProfile: log.writerProfile,
          title: log.title,
          date: `${log.startDate} - ${log.endDate}`,
          likes: 0,
          comments: 0,
        }));

        setLogs(mappedLogs);
      } catch (err) {
        console.error("내 로그 불러오기 실패", err);
      }
    };

    fetchLogs();
  }, []);

    return (    
      <Container>
        <HeaderLeft title="마이페이지"/>

        <ContentWrapper>
          <ProfileInfoItem/>
          <CardContainer>
            <LogCardList
              items={logs}
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