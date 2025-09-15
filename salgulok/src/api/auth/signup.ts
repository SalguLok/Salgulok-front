import api from "../api";

// 최초 로그인 시 회원정보 입력 api
interface SignupDto {
  username: string;      
  intro?: string | null; 
  profileImg?: string | null;
}

export const sendUserInfoIfNew = async (data: SignupDto): Promise<SignupDto> => {
    try{
        const response = await api.post<SignupDto>("/users/info", data);
        return response.data;
    } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        alert(data.message || "입력값이 잘못되었습니다.");
      } else {
        console.error("서버 오류", data);
        alert("서버에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } else {
      console.error("네트워크 오류", error);
      alert("네트워크 오류가 발생했습니다.");
    }
    throw error;
  }
};