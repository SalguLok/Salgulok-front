import Seoul from "../assets/home/seoul.svg?react";
import Busan from "../assets/home/busan.svg?react";
import Daegu from "../assets/home/daegu.svg?react";
import Incheon from "../assets/home/incheon.svg?react";
import Gwangju from "../assets/home/gwangju.svg?react";
import Daejeon from "../assets/home/daejeon.svg?react";
import Ulsan from "../assets/home/ulsan.svg?react";
import Sejong from "../assets/home/sejong.svg?react";
import Gyeonggi from "../assets/home/gyeonggi.svg?react";
import Jeju from "../assets/home/jeju.svg?react";
import Chungcheong from "../assets/home/chungcheong.svg?react";
import Gyeongsang from "../assets/home/gyeongsang.svg?react";
import Gangwon from "../assets/home/gangwon.svg?react";
import Jeolla from "../assets/home/jeolla.svg?react";

export const regions = [
  { id: "seoul", location: "서울", image: <Seoul /> },
  { id: "busan", location: "부산", image: <Busan /> },
  { id: "daegu", location: "대구", image: <Daegu /> },
  { id: "incheon", location: "인천", image: <Incheon /> },
  { id: "gwangju", location: "광주", image: <Gwangju /> },
  { id: "daejeon", location: "대전", image: <Daejeon /> },
  { id: "ulsan", location: "울산", image: <Ulsan /> },
  {
    id: "sejong",
    location: "세종",
    image: <Sejong />,
  },
  { id: "gyeonggi", location: "경기", image: <Gyeonggi /> },
  { id: "chungcheong", location: "충청", image: <Chungcheong /> },
  {
    id: "gyeongsang",
    location: "경상",
    image: <Gyeongsang />,
  },

  {
    id: "gangwon",
    location: "강원",
    image: <Gangwon />,
  },
  {
    id: "jeonbuk",
    location: "전라",
    image: <Jeolla />,
  },
  { id: "jeju", location: "제주", image: <Jeju /> },
];

export default regions;
