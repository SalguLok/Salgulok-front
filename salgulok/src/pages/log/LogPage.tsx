import styled from "styled-components";
import NavigationBar from "../../components/common/NavigationBar";
import LogCardList from "../../components/common/CardListItem";
import type { LogItem } from "../../components/common/CardListItem";

const mock: LogItem[] = [
  {
    id: "1",
    image: "/imgs/travel1.jpg",
    writer: "여행이좋아요",
    writerProfile: "",
    title: "25년 여름 제주는 아름다워",
    date: "250703-250807",
    likes: 17,
    comments: 25,
  },
  {
    id: "2",
    image: "/imgs/travel2.jpg",
    writer: "여행이좋아요",
    title: "산토리니 블루",
    date: "250703-250807",
    likes: 12,
    comments: 9,
  },
  {
    id: "3",
    image: "/imgs/travel2.jpg",
    writer: "여행이좋아요",
    title: "산토리니 블루",
    date: "250703-250807",
    likes: 12,
    comments: 9,
  },
];
const LogPage = () => {
  return (
    <Layout>
      <CardContainer>
        <LogCardList items={mock} onClick={(id) => console.log("open", id)} />
      </CardContainer>
      <NavigationBar />
    </Layout>
  );
};

export default LogPage;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;
const CardContainer = styled.div`
  display: flex;
  margin: 0 20px;
`;
