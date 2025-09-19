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
  formData.append("memId", memId);
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

// 영상 목록 조회
export function getLectureVideoList(lecId, memId, week = "1주차") {
  return axios.get("/api/lecture/vidlist", {
    params: { lecId, memId, week },
  });
}

// 영상 상세 조회
export function getLectureVideoDetail(lecId, lecvidId, memId) {
  return axios.get("/api/lecture/detail", {
    params: { lecId, lecvidId, memId },
  });
}

// 영상 등록
export function registerLectureVideo(lecId, title, videoFile, thumbFile) {
  const formData = new FormData();
  formData.append("lecId", lecId);
  formData.append("title", title);
  formData.append("videoFile", videoFile);
  formData.append("thumbFile", thumbFile);

  return axios.post("/api/lecture/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// 영상 수정
export function modifyLectureVideo(lecvidId, title, detail, week, videoFile, thumbFile) {
  const formData = new FormData();
  formData.append("lecvidId", lecvidId);
  formData.append("title", title);
  formData.append("detail", detail);
  formData.append("week", week);

  if (videoFile instanceof File) {
    formData.append("videoFile", videoFile);
  }
  if (thumbFile instanceof File) {
    formData.append("thumbFile", thumbFile);
  }

  return axios.post("/api/lecture/modify", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// 진행도 업데이트
export function updateLectureProgress(aNo, progress) {
  return axios.post("/api/lecture/progress", null, {
    params: { aNo, progress },
  });
}

// 세션에서 사용자 가져오기
export const getUserSession = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) return { mem_name: "", mem_id: "", pictureUrl: "/img/user1.png" };

    return {
      ...user,
      pictureUrl: user.picture 
        ? `/api/member/getPicture?id=${user.mem_id}`
        : "/img/user1.png"
    };
  } catch (err) {
    console.error("세션에서 사용자 정보를 가져오는데 실패:", err);
    return { mem_name: "", mem_id: "", pictureUrl: "/img/user1.png" };
  }
};
