import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import KakaoRedirectPage from "./pages/auth/KakaoRedirectPage";
import SignupPage from "./pages/auth/SignupPage";
import HomePage from "./pages/home/HomePage";
import MapPage from "./pages/map/MapPage";
import LogPage from "./pages/log/LogPage";
import CommunityPage from "./pages/community/CommunityPage";
import CreateDatePage from "./pages/log/CreateLogDatePage";
import CreateLogInfoPage from "./pages/log/CreateLogInfoPage";
import CreateLogCompletePage from "./pages/log/CreateLogCompletePage";
import CreateRegionPage from "./pages/log/CreateLogRegionPage";
import EditProfilePage from "./pages/mypage/EditProfilePage";
import MyPage from "./pages/mypage/MyPage";
import WritePage from "./pages/community/WritePage.tsx";
import CommunityDetailPage from "./pages/community/CommunityDetailPage.tsx";

// 테스트용
// import LogEntryPage from "./pages/log/LogEntryPage";
// import LogSearchPage from "./pages/log/LogSearchPage.tsx";
import LogEntryPage from "./pages/log/LogEntryPage.tsx";
// import TestPage from "./pages/log/TestPage.tsx"

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/oauth/kakao", element: <KakaoRedirectPage /> },
  { path: "/signup", element: <SignupPage /> },

  // 엑세스 토큰 없이 접근 불가
  { path: "/", element: <ProtectedRoute element={<HomePage />} /> },
  { path: "/map", element: <ProtectedRoute element={<MapPage />} /> },
  { path: "/log", element: <ProtectedRoute element={<LogPage />} /> },
  {
    path: "/log/:logId/entries",
    element: <ProtectedRoute element={<LogEntryPage />} />,
  },
  {
    path: "/log/:logId",
    element: <ProtectedRoute element={<LogEntryPage />} />,
  },
  {
    path: "/community",
    element: <ProtectedRoute element={<CommunityPage />} />,
  },
  { path: "/my", element: <ProtectedRoute element={<MyPage />} /> },
  {
    path: "/log/create/region",
    element: <ProtectedRoute element={<CreateRegionPage />} />,
  },
  {
    path: "/log/create/date",
    element: <ProtectedRoute element={<CreateDatePage />} />,
  },
  {
    path: "/log/create/info",
    element: <ProtectedRoute element={<CreateLogInfoPage />} />,
  },
  {
    path: "/log/complete",
    element: <ProtectedRoute element={<CreateLogCompletePage />} />,
  },
  {
    path: "/mypage/edit",
    element: <ProtectedRoute element={<EditProfilePage />} />,
  },
  { path: "/mypage", element: <ProtectedRoute element={<MyPage />} /> },

  {
    path: "/",
    element: <HomePage />,
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
  { path: "/log/create/region", element: <CreateRegionPage /> },
  { path: "/log/create/date", element: <CreateDatePage /> },
  { path: "/log/create/info", element: <CreateLogInfoPage /> },
  { path: "/log/complete", element: <CreateLogCompletePage /> },
  { path: "/mypage/edit", element: <EditProfilePage /> },
  { path: "/mypage", element: <MyPage /> },
  { path: "/community/WritePage", element: <WritePage /> },
  { path: "/community/:postId", element: <CommunityDetailPage /> },
]);

export default router;
