import styled from "styled-components";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MapBlack from "../../assets/common/map_black.svg?react";
import HomeBlack from "../../assets/common/home_black.svg?react";
import LogBlack from "../../assets/common/log_black.svg?react";
import CommunityBlack from "../../assets/common/community_black.svg?react";
import MyBlack from "../../assets/common/my_black.svg?react";
import MapGray from "../../assets/common/map_gray.svg?react";
import HomeGray from "../../assets/common/home_gray.svg?react";
import LogGray from "../../assets/common/log_gray.svg?react";
import CommunityGray from "../../assets/common/community_gray.svg?react";
import MyGray from "../../assets/common/my_gray.svg?react";
type TabKey = "main" | "map" | "log" | "community" | "my" | "mypage" | "home";

const NavigationBar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState<TabKey | undefined>(undefined);

  useEffect(() => {
    const pathToTab: Record<string, TabKey> = {
      "/": "main",
      "/map": "map",
      "/log": "log",
      "/community": "community",
      "/my": "mypage",
    };
    setSelected(pathToTab[location.pathname] ?? "home");
  }, [location.pathname]);

  const handleNavigation = (tab: TabKey, path: string): void => {
    setSelected(tab);
    navigate(path);
  };

  return (
    <Layout>
      <IconContainer onClick={() => handleNavigation("main", "/")}>
        {selected === "main" ? <HomeBlack /> : <HomeGray />}
        <Text selected={selected === "main"}>홈</Text>
      </IconContainer>
      <IconContainer onClick={() => handleNavigation("map", "/map")}>
        {selected === "map" ? <MapBlack /> : <MapGray />}
        <Text selected={selected === "map"}>지역탐색</Text>
      </IconContainer>
      <IconContainer onClick={() => handleNavigation("log", "/log")}>
        {selected === "log" ? <LogBlack /> : <LogGray />}
        <Text selected={selected === "log"}>살구로그</Text>
      </IconContainer>
      <IconContainer
        onClick={() => handleNavigation("community", "/community")}
      >
        {selected === "community" ? <CommunityBlack /> : <CommunityGray />}
        <Text selected={selected === "community"}>커뮤니티</Text>
      </IconContainer>
      <IconContainer onClick={() => handleNavigation("my", "/my")}>
        {selected === "my" ? <MyBlack /> : <MyGray />}
        <Text selected={selected === "my"}>마이</Text>
      </IconContainer>
    </Layout>
  );
};

export default NavigationBar;

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: var(--white);
  width: 375px;
  height: 67px;
  position: fixed;
  bottom: 0;
  border-top: 1px solid var(--gray-200);
  gap: 27px;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  width: 44px;
`;

interface TextProps {
  selected: boolean;
}
const Text = styled.span<TextProps>`
  font-size: 10px;
  font-weight: 400;
  color: ${(props) => (props.selected ? "black" : "var(--gray-200)")};
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
`;
