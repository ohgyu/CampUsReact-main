import axios from "axios";

// ✅ baseURL 설정 제거 (프록시가 알아서 처리)
// axios.defaults.baseURL = "http://localhost/campus";

// =========================
// 과제 관련
// =========================
export function getHomeworklist(lecId, memId) {
  return axios.get("/api/homework/list", {
    params: { memId, lecId },
  });
}

export function getStudentHomeworkDetail(hwNo, stuId) {
  return axios.get("/api/homework/student/detail", {
    params: { hwNo, stuId },
  });
}

// =========================
// 학생/교수 공용
// =========================
export function getStudent(memId) {
  return axios.get("/api/student", { params: { memId } });
}

// 마이페이지
export function getMypage(memId) {
  return axios.get("/api/mypage", { params: { memId } });
}

// 프로필 업로드
export function uploadProfile(memId, pictureFile) {
  const formData = new FormData();
  formData.append("mem_id", memId);
  formData.append("pictureFile", pictureFile);

  return axios.post("/api/member/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// =========================
// 로그인/세션 관련
// =========================
export function checkSession() {
  return axios.get("/api/login/check");
}

export function loginUser(id, pwd) {
  return axios.post("/api/login/index", { id, pwd });
}

export function logoutUser() {
  return axios.post("/api/login/logout", {});
}

// 세션에서 사용자 가져오기
export const getUserSession = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) return { name: "", id: "", pictureUrl: "" };

    return {
      ...user,
      pictureUrl: user.picture
        ? `/upload/profile/${user.picture}`   // DB에 저장된 파일명 앞에 경로 붙여줌
        : "/img/user1.png"                    // 기본 이미지
    };
  } catch (err) {
    console.error("세션에서 사용자 정보를 가져오는데 실패:", err);
    return { name: "", id: "", pictureUrl: "/img/user1.png" };
  }
};