import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
 @font-face {
    font-family: "Pretendard-Light";
    src: url("/fonts/Pretendard-Light") format("woff2");
    font-weight: 300
    font-style: normal;
    font-display: swap;
  }
     @font-face {
    font-family: "Pretendard-Regular";
    src: url("/fonts/Pretendard-Regular") format("woff2");
    font-weight: 400
    font-style: normal;
    font-display: swap;
  }
 @font-face {
    font-family: "Pretendard-Medium";
    src: url("/fonts/Pretendard-Medium") format("woff2");
    font-weight: 500
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Pretendard-SemiBold";
    src: url("/fonts/Pretendard-SemiBold") format("woff2");
    font-weight: 600
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Pretendard-Bold";
    src: url("/fonts/Pretendard-Bold") format("woff2");
    font-weight: 700
    font-style: normal;
    font-display: swap;
  }

  :root{
    --app-width:375px;
    
    --white: #ffffff;

    --black: #000000;

    --main-pri: #E78254;
    --main-sec: #FFEADD;

    --gray-100: #EFEFEF;
    --gray-200: #D4D4D4;
    --gray-300: #B6B6B6;
    --gray-400: #A0A0A0;
    --gray-500: #7D7D7D;

    background-color: var(--white);
    font-family: Pretendard;

    -ms-overflow-style: none;
}
* {
  font-family: Pretendard;
}

 body{
    font-family: 'Pretendard','Nunito', sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    background: #f5f5f5;
    overflow: hidden;
  }

  #root {
    background: #FFFFFF;
    width: 375px;
    height: 100svh;
    margin:0 auto;
    overflow-x:hidden;
    overflow-y: auto;
    scrollbar-width: none;  
  }
`;

export default GlobalStyle;
