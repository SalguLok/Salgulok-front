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
  }

  #root {
    background: #f5f5f5;
    width: 375px;
    height: 800px;
    overflow: hidden;
  }
`;

export default GlobalStyle;
