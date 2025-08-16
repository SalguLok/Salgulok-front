import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import KakaoRedirectPage from "./pages/auth/KakaoRedirectPage";
import SignupPage from "./pages/auth/SignupPage";
import MainPage from "./pages/main/MainPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth/kakao" element={<KakaoRedirectPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;