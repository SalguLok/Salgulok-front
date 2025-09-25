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
  // 첫 번째 행 (5개)
  { id: 0, nameEn: "all", nameKo: "전체", image: null, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" },
  { id: 1, nameEn: "seoul", nameKo: "서울", image: <Seoul />, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" },
  { id: 2, nameEn: "busan", nameKo: "부산", image: <Busan />, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" },
  { id: 3, nameEn: "daegu", nameKo: "대구", image: <Daegu />, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" },
  { id: 4, nameEn: "incheon", nameKo: "인천", image: <Incheon />, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" },
  
  // 두 번째 행 (5개)
  { id: 5, nameEn: "gwangju", nameKo: "광주", image: <Gwangju />, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" },
  { id: 6, nameEn: "daejeon", nameKo: "대전", image: <Daejeon />, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" },
  { id: 7, nameEn: "ulsan", nameKo: "울산", image: <Ulsan />, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" },
  { id: 8, nameEn: "sejong", nameKo: "세종", image: <Sejong />, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" },
  { id: 9, nameEn: "gyeonggi", nameKo: "경기", image: <Gyeonggi />, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" },
  
  // 세 번째 행 (5개)
  { id: 10, nameEn: "chungcheong", nameKo: "충청", image: <Chungcheong />, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" },
  { id: 11, nameEn: "jeonbuk", nameKo: "전라", image: <Jeolla />, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" },
  { id: 12, nameEn: "gyeongsang", nameKo: "경상", image: <Gyeongsang />, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" },
  { id: 13, nameEn: "gangwon", nameKo: "강원", image: <Gangwon />, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800" },
  { id: 14, nameEn: "jeju", nameKo: "제주", image: <Jeju />, imageUrl: "https://mblogthumb-phinf.pstatic.net/MjAyNDA2MThfMTMx/MDAxNzE4Njc0MDcwMTM5.39fnbeAr2b_0HiCDOfeAaa31R_Zf33CDSmokYr3hg7sg.igWNKGclsAXMUN1m5JpgiJwMrucJGotyKNKmhQLL-40g.JPEG/%EC%BD%94%EB%82%9C%ED%95%B4%EB%B3%8020.JPEG?type=w800" },
];

export default regions;
