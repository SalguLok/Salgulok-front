import styled from "styled-components";
import type { FC, MouseEvent } from "react";

export type RegionItem = {
  id: string;
  location: string;
  image: string | React.ReactNode;
};

type Props = {
  title?: string;
  items: RegionItem[];
  onClick?: (id: string) => void;
};

const LocationSlider: FC<Props> = ({ items, onClick }) => {
  return (
    <Layout>
      {items.map((it) => (
        <LocationContainer key={it.id} onClick={() => onClick?.(it.id)}>
          {typeof it.image === "string" ? (
            <Img src={it.image} alt={it.location} loading="lazy" />
          ) : (
            <Image>{it.image}</Image>
          )}
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

  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  touch-action: pan-x;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  padding-left: 20px;
  padding-right: 20px;

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
const Image = styled.div`
  width: 65px;
  height: 65px;
  border-radius: 100px;
  overflow: hidden;
  background-color: var(--gray-200);
`;
const Img = styled.img`
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
