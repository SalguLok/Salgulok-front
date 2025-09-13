import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import BottomButton from "../../components/common/BottomButton";
import dropdown from "../../assets/common/dropdown.svg";

const WritePage = () => {
  
  const navigate = useNavigate();

  return (
    <>
    <Layout>
      <Header title="글쓰기" showBackButton={true} />
      
      <SelectRow>
        <SelectBtn>
          지역선택
          <Icon>
            <img src={dropdown} alt="dropdown icon" />
          </Icon>
        </SelectBtn>
        <SelectBtn>
          주제
          <Icon>
            <img src={dropdown} alt="dropdown icon" />
          </Icon>
        </SelectBtn>
      </SelectRow>

      <InputTitle placeholder="제목을 입력해주세요" />
      <InputContent placeholder="여행자들과 어떤 이야기를 나누고 싶으신가요?" />

  
    </Layout>
      <WriteButton onClick={() => navigate('')}>
          등록
      </WriteButton> 
    </>
  );
};

export default WritePage;

const APP_W = 375; // 폰 프레임 너비(px)

const Layout = styled.div`
  min-height: 100vh;
  background: var(--white);
  padding: 0 20px;
  align-items: center;
  position: relative;

  max-width: ${APP_W}px;
  margin: 0 auto;         /* 화면 가운데 정렬 */
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
`;

const SelectRow = styled.div`
  display: flex;
  gap: 12px;
  margin: 24px 0 24px 0;
`;

const SelectBtn = styled.button`
  display: flex;
  align-items: center;  
  padding: 0px 12px;
  height: 30px;
  border: 1px solid var(--gray-200);
  border-radius: 20px;
  background: var(--white);
  color: var(--black);
  font-size: 13px;
  font-family: pretendard, sans-serif;
  cursor: pointer;
  gap: 8px;
`;

const InputTitle = styled.input`
  width: 100%;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid var(--black);
  font-size: 16px;
  font-family: pretendard, sans-serif;
  padding: 16px 0 8px 0;
  margin-bottom: 8px;
  outline: none;
  color: var(--black);
  &::placeholder {
    color: var(--gray-400);
  }
`;

const InputContent = styled.textarea`
  width: 100%;
  border: none;
  font-size: 13px;
  font-family: pretendard, sans-serif;
  color: var(--gray-400);
  resize: none;
  min-height: 32px;
  outline: none;
  &::placeholder {
    color: var(--gray-200);
  }
`;


const BTN_W = 90;  // 버튼 너비
const GUTTER = 15;  // 프레임 오른쪽 여백

const WriteButton = styled.button`
  position: fixed; 
  z-index: 1100;

  /* 하단 여백 + iOS 안전영역 */
  bottom: calc(16px + env(safe-area-inset-bottom));

  /* 프레임 오른쪽 안쪽에 붙이기:
     50% (중앙) + 프레임의 절반 - 여백 - 버튼폭 */
  left: calc(50% + ${APP_W}px / 2 - ${GUTTER}px - ${BTN_W}px);
  right: auto;

  /* 작은 화면(프레임=화면폭)에서는 일반 right 기준으로 */
  @media (max-width: ${APP_W + GUTTER * 2}px) {
    left: auto;
    right: ${GUTTER}px;
  }

  width: 90px;
  height: 35px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  border: none; border-radius: 15px;
  background: var(--main-pri); color: #fff;
  font-size: 15px; font-weight: 400; font-family: 'pretendard', sans-serif;
  cursor: pointer;
`;

