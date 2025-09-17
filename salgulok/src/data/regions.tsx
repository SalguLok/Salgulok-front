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
  { id: 1, nameEn: "seoul", nameKo: "서울", image: <Seoul /> },
  { id: 2, nameEn: "busan", nameKo: "부산", image: <Busan /> },
  { id: 3, nameEn: "daegu", nameKo: "대구", image: <Daegu /> },
  { id: 4, nameEn: "incheon", nameKo: "인천", image: <Incheon /> },
  { id: 5, nameEn: "gwangju", nameKo: "광주", image: <Gwangju /> },
  { id: 6, nameEn: "daejeon", nameKo: "대전", image: <Daejeon /> },
  { id: 7, nameEn: "ulsan", nameKo: "울산", image: <Ulsan /> },
  { id: 8, nameEn: "sejong", nameKo: "세종", image: <Sejong /> },
  { id: 9, nameEn: "gyeonggi", nameKo: "경기", image: <Gyeonggi /> },
  { id: 10, nameEn: "chungcheong", nameKo: "충청", image: <Chungcheong /> },
  {
    id: 11,
    nameEn: "jeonbuk",
    nameKo: "전라",
    image: <Jeolla />,
  },
  {
    id: 12,
    nameEn: "gyeongsang",
    nameKo: "경상",
    image: <Gyeongsang />,
  },

  {
    id: 13,
    nameEn: "gangwon",
    nameKo: "강원",
    image: <Gangwon />,
  },

  { id: 14, nameEn: "jeju", nameKo: "제주", image: <Jeju /> },
];

export default regions;
