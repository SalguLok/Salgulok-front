import { useParams } from "react-router-dom";
import styled from "styled-components";
import Header from "../../components/common/Header";
import LogDetailHeader from "../../components/log/LogDetailIHeader.tsx";
import TemplateCardDone from "../../components/log/TemplateCardDone.tsx";

const LogEntryPage: React.FC = () => {
  const { logId } = useParams<{ logId: string }>();
  const numericLogId = Number(logId);

  return (
    <Container>
      <Header title="살구로그 생성" showBackButton />
      <div style={{ marginTop: "15px" }}>
        <LogDetailHeader logId={numericLogId} />
      </div>
      <TemplateCardDone title="" review="" />
    </Container>
  );
};

export default LogEntryPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 67px; /* NavigationBar height */
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
