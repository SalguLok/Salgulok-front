import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import KakaoRedirectPage from "./pages/auth/KakaoRedirectPage";
import SignupPage from "./pages/auth/SignupPage";
import MainPage from "./pages/main/MainPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/oauth/kakao",
    element: <KakaoRedirectPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/",
    element: <MainPage />,
  },
]);

export default router;
