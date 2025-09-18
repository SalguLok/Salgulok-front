import axios from 'axios'

// baseURL을 ''로 두면 요청이 상대경로로 나감 (http://localhost:5173/community/..)
// dev 서버가 위 프록시 설정으로 백엔드로 전달해줌.
const communityApi = axios.create({
  baseURL: '',          // ★ 중요: 절대 URL 금지 (상대경로)
  withCredentials: true,
})

export default communityApi
