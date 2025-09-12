import styled from "styled-components";
import type { FC, MouseEvent } from "react";

export type RegionItem = {
  id: string;
  location: string;
  image: string;
};

type Props = {
  title?: string;
  items: RegionItem[];
  onClick?: (id: string) => void;
};

const LocationSlider: FC<Props> = ({ items }) => {
  return (
    <Layout>
      {items.map((it) => (
        <LocationContainer key={it.id} onClick={() => it.id}>
          <Image src={it.image} alt="" loading="lazy"></Image>
          <Location>{it.location}</Location>
        </LocationContainer>
      ))}
    </Layout>
  );
};

export default LocationSlider;

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;

  /* 가로 슬라이드 */
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  touch-action: pan-x;

  /* 스크롤바 숨김 */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  /* 왼쪽 여백만, 오른쪽은 0 → 끝에 공백 없음 */
  padding-left: 20px;
  padding-right: 20px;

  /* 스냅 기준도 왼쪽만 */
  scroll-padding-left: 20px;
  scroll-padding-right: 20px;
`;
const LocationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;
const Image = styled.img`
  width: 65px;
  height: 65px;
  border-radius: 100px;
  overflow: hidden;
  background-color: var(--gray-200);
`;

const Location = styled.text`
  font-size: 16px;
  font-weight: 500;
`;
