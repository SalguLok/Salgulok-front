import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import GlobalStyle from "./styles/GlobalStyle";

createRoot(document.getElementById("root")!).render(
  <>
    <GlobalStyle />
    <App />
  </>
);
