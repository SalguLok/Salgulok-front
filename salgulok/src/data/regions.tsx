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
  { id: 0, nameEn: "all", nameKo: "전체", image: null, imageUrl: "https://images.squarespace-cdn.com/content/v1/586ebc34d482e9c69268b69a/1624386887478-9Z3XA27D8WFVDWKW00QS/20201230173806551_JRT8E1VC.png" },
  { id: 1, nameEn: "seoul", nameKo: "서울", image: <Seoul />, imageUrl: "https://img.freepik.com/premium-photo/korea-namsan-tower-seoul-south-korea_40171-69.jpg" },
  { id: 2, nameEn: "busan", nameKo: "부산", image: <Busan />, imageUrl: "https://www.visitbusan.net/uploadImgs/files/hqimgfiles/20200326112404471_thumbL" },
  { id: 3, nameEn: "daegu", nameKo: "대구", image: <Daegu />, imageUrl: "https://cdn.topstarnews.net/news/photo/202508/15781485_1688515_347.jpg" },
  { id: 4, nameEn: "incheon", nameKo: "인천", image: <Incheon />, imageUrl: "https://www.ito.or.kr/images/bbs/galleryko/2020/incheondaegyo_007.jpg" },
  
  // 두 번째 행 (5개)
  { id: 5, nameEn: "gwangju", nameKo: "광주", image: <Gwangju />, imageUrl: "https://vrthumb.clipartkorea.co.kr/2020/09/23/tc00240032219.jpg" },
  { id: 6, nameEn: "daejeon", nameKo: "대전", image: <Daejeon />, imageUrl: "https://www.chosun.com/resizer/v2/RTUEBHHFBRGAHIMLHKZ7YYLUAA.jpg?auth=ac1e1b1fa7ef81cf995a6c8bdc15e09330a73f2976b69006bc79f963875380cb&width=616" },
  { id: 7, nameEn: "ulsan", nameKo: "울산", image: <Ulsan />, imageUrl: "https://tong.visitkorea.or.kr/cms/resource/80/2020480_image2_1.jpg" },
  { id: 8, nameEn: "sejong", nameKo: "세종", image: <Sejong />, imageUrl: "https://cdn.dtnews24.com/news/photo/202307/749111_359757_4522.jpg" },
  { id: 9, nameEn: "gyeonggi", nameKo: "경기", image: <Gyeonggi />, imageUrl: "https://gnews.gg.go.kr/OP_UPDATA/UP_DATA/_FILEZ/201807/20180702162253475945565.jpg" },
  
  // 세 번째 행 (5개)
  { id: 10, nameEn: "chungcheong", nameKo: "충청", image: <Chungcheong />, imageUrl: "https://img4.daumcdn.net/thumb/R658x0.q70/?fname=https://t1.daumcdn.net/news/202411/13/speaktravel/20241113070003313eysv.jpg" },
  { id: 11, nameEn: "jeonbuk", nameKo: "전라", image: <Jeolla />, imageUrl: "https://file2.nocutnews.co.kr/newsroom/image/2021/01/29/202101291454159226_0.jpg" },
  { id: 12, nameEn: "gyeongsang", nameKo: "경상", image: <Gyeongsang />, imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgnOe1pjCSpQuD8YW-jauUSk1c-EZi-iOabA&s" },
  { id: 13, nameEn: "gangwon", nameKo: "강원", image: <Gangwon />, imageUrl: "https://tour.pc.go.kr/upload/2025/0324/202503241742799095792049.jpg" },
  { id: 14, nameEn: "jeju", nameKo: "제주", image: <Jeju />, imageUrl: "https://minio.nculture.org/amsweb-opt/multimedia_assets/97/85792/93375/c/%ED%95%9C%EB%9D%BC%EC%82%B0-%283%29_rev-medium-size.jpg" }];

export default regions;
