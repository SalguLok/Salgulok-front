import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body{
    font-family: 'Pretendard','Nunito', sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    background: #f5f5f5;
  }

  #root {
    background: #FFFFFF;
    width: 375px;
    height: 800px;
    overflow: hidden;
    padding: 20px;
  }
`;

export default GlobalStyle;
