import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import KakaoRedirectPage from "./pages/auth/KakaoRedirectPage";
import SignupPage from "./pages/auth/SignupPage";
//import HomePage from "./pages/home/HomePage";
import MapPage from "./pages/map/MapPage";
import LogPage from "./pages/log/LogPage";
import CommunityPage from "./pages/community/CommunityPage";
import CreateDatePage from "./pages/log/CreateLogDatePage";
import CreateLogInfoPage from "./pages/log/CreateLogInfoPage";
import CreateLogCompletePage from "./pages/log/CreateLogCompletePage";
import CreateRegionPage from "./pages/log/CreateLogRegionPage";
import EditProfilePage from "./pages/mypage/EditProfilePage";
import MyPage from "./pages/mypage/MyPage";

// 테스트용
// import LogEntryPage from "./pages/log/LogEntryPage";
// import LogSearchPage from "./pages/log/LogSearchPage.tsx";
 import LogEntryPage from "./pages/log/LogEntryPage.tsx";
// import TestPage from "./pages/log/TestPage.tsx"

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
    //element: <HomePage />,
    //element: <LogSearchPage />
    element: <LogEntryPage />
    // element: <TestPage />
  },
  {
    path: "/map",
    element: <MapPage />,
  },
  {
    path: "/log",
    element: <LogPage />,
  },
  { path: "/community", element: <CommunityPage /> },
  { path: "/my", element: <MyPage /> },
  { path: "/log/create/region", element: <CreateRegionPage />},
  { path: "/log/create/date", element: <CreateDatePage /> },
  { path: "/log/create/info", element: <CreateLogInfoPage />},
  { path: "/log/complete", element: <CreateLogCompletePage />},
  { path: "/mypage/edit", element: <EditProfilePage /> },
  { path: "/mypage", element: <MyPage/>}
]);

export default router;
