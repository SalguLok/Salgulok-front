import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import theme from "./styles/theme";
import router from "./router";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        <RouterProvider router={router} />
      </>
    </ThemeProvider>
  );
}

export default App;
