import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/common/Header";
import LogDetailHeader from "../../components/log/LogDetailIHeader.tsx";
import TemplateCard from "../../components/common/TemplateCard.tsx";

import LogEntryList from "../../components/log/LogEntryList.tsx";
import { useEffect, useState } from "react";
import { getLogDetail } from "../../api/log/getLogDetail.ts";

const LogEntryPage: React.FC = () => {
  const { logId } = useParams<{ logId: string }>();
  const numericLogId = Number(logId);
  const [logDetail, setLogDetail] = useState<{ startDate: string; endDate: string } | null>(null);
  const [showTemplateCard, setShowTemplateCard] = useState(false);

  useEffect(() => {
    if (numericLogId) {
      getLogDetail(numericLogId).then(detail => {
        setLogDetail({
          startDate: detail.startDate,
          endDate: detail.endDate,
        });
        setShowTemplateCard(false);
      });
    }
  }, [numericLogId]);

  // TemplateCard 보여주는 핸들러
  const handleSalguItemClick = () => {
    setShowTemplateCard(true); // 보여주도록 변경
  };

  return (
    <Container>
      <Header title="살구로그 생성" showBackButton />
      <div style={{ marginTop: "15px" }}>
        <LogDetailHeader logId={numericLogId} />
      </div>
      {logDetail && (
          <LogEntryList
              logId={numericLogId}
              startDate={logDetail.startDate}
              endDate={logDetail.endDate}
              onItemClick={handleSalguItemClick}
          />
      )}
      {showTemplateCard && (
          <TemplateCardWrapper>
            {/* TODO: 임시 설정 */}
            <TemplateCard 
              logId={1}
              entryDate={"2025-09-19"}
            />
          </TemplateCardWrapper>
      )}
      {/*<TemplateCardDone title="" review="" />*/}

    </Container>
  );
};

export default LogEntryPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 67px; /* NavigationBar height */
`;

const TemplateCardWrapper = styled.div`
  width: 90%;   
  max-width: 600px; 
  margin: 0 auto;   
`;

// const ActionContainer = styled.div`
//   height: 56px;
//   display: flex;
//   align-items: center;
//   padding-top: 4px;
// `;

// const ContentWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   margin-top: 8px;
//   gap: 16px;
//   align-items: center;
//   width: 100%;
// `;

// const CardContainer = styled.div`
//   display: flex;
//   margin: 0 20px;
// `;

// const IconButton = styled.button`
//   width: 28px;
//   height: 28px;
//   border: 0;
//   background: transparent;
//   display: grid;
//   place-items: center;
//   cursor: pointer;
//   position: relative;

//   &:disabled {
//     opacity: 0.6;
//     cursor: not-allowed;
//   }

//   & > svg {
//     width: 20px;
//     height: 20px;
//     display: block;
//     top: -5px;
//     position: relative;
//   }
// `;

// const SearchRow = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100%;
//   padding: 0 16px;
//   box-sizing: border-box;
//   overflow: visible;
//   z-index: 1;
// `;

// const FilterBarContainer = styled.div`
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
//   height: 100%;
//   width: 100%;
//   padding: 0 16px;
// `;
