import axios from "axios";

axios.defaults.withCredentials = true;

if (import.meta?.env?.VITE_API_BASE) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE;
}

function toFormData(obj = {}) {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    fd.append(k, v);
  });
  return fd;
}

export function getStudent(memId){
  return axios.get(`/api/student?memId=${memId}`)
}

// ------------------------------------------ 프로젝트팀

export const registerProject = (payload) => {
  return axios.post("/api/project/regist", payload);
};
export const getProjectRegistData = () => {
  return axios.get("/api/project/regist");
};
export const getProjectDetail = (project_id) => {
  return axios.get(`/api/project/modify/stu?project_id=${project_id}`)
}
export const requestProjectModify = (payload) => {
  return axios.post("/api/project/modify/stu", payload);
};
export const getModifyCheck = (project_id) => {
  return axios.get(`/api/project/modify/pro?project_id=${project_id}`)
}
export const modifyProjectTeamCheck = (payload) => {
  return axios.post("/api/project/modify/pro", payload);

};
export const removeTeam = (team_id) => {
  return axios.get("/api/project/remove", { params: { team_id } });
};
export const getProjectTeamListPro = (memId, page = 1, samester = '', projectName = '', projectStDate = '', projectEnDate = '', perPageNum = 3) => {

  return axios.get('/api/project/list/pro', {
    params: {
      memId,
      page,
      samester,
      project_name: projectName || '', // 검색 안 해도 빈 문자열 보내기
      project_stdate: projectStDate || '',
      project_endate: projectEnDate || '',
      perPageNum
    }

  });
}
export const getProjectTeamListStu = (
  memId, 
  page = 1, 
  samester = '', 
  projectName = '', 
  projectStDate = '', 
  projectEnDate = '',
  evalStatus,
    perPageNum  = 3
) => {
  return axios.get('/api/roadmap/projectlist/stu', {  // @RestController 경로
    params: {
      memId,
      page,
      samester,
      project_name: projectName || '',
      project_stdate: projectStDate || '',
      project_endate: projectEnDate || '',
      eval_status : evalStatus,
      perPageNum
    }
  });
};
export const getProjectTeamList = (memId, page = 1, samester = '', projectName = '', projectStDate = '', projectEnDate = '') => {
  return axios.get('/api/project/list/stu', {
    params: {
      memId,
      page,
      samester,
      project_name: projectName || '', // 검색 안 해도 빈 문자열 보내기
      project_stdate: projectStDate || '',
      project_endate: projectEnDate || ''
    }
  });
}
export const getProjectObjectList = (projectId, memId, rmCategory = '', rmName = '', rmStdate = '', rmEndate = '', page = 1) => {
  return axios.get('/api/roadmap/list/stu', {
    params: {
      project_id: projectId,
      memId: memId,
      rm_category: rmCategory,
      rm_name: rmName,
      rm_stdate: rmStdate,
      rm_endate: rmEndate,
      page
    }
  });
};
export const getProjectTeamListProRest = (
  memId,
  page = 1,
  samester = '',
  projectName = '',
  projectStDate = '',
  projectEnDate = '',
  modifyRequest = false

) => {
  return axios.get('/api/roadmap/projectlist/pro', {
    params: {
      memId, // session에서 서버가 받아야 하지만, axios에서는 보내도 무방
      page,
      samester,
      project_name: projectName || '',
      project_stdate: projectStDate || '',
      project_endate: projectEnDate || '',
      modifyRequest
    }
  });
};
export const getRoadMapDetail = async (rm_id, memId, pageMakers = {}, pageMaker = {}) => {
  try {
    const params = {
      rm_id,
      memId,
      ...pageMakers,
      ...pageMaker
    };

    const res = await axios.get("/api/roadmap/detail", { params });
    return res.data;
  } catch (err) {
    console.error("로드맵 상세 조회 실패:", err.response?.data || err);
    throw err;
  }
};
export const getEvaluationForm = (rm_id) => {
  return axios.get("/api/roadmap/evaluation/form", {
    params: { rm_id }
  })
};
export const registerEvaluation = (payload) => {
  return axios.post(`/api/roadmap/evaluation/regist?memId=${payload.profes_id}`, payload)
};
export const getEvaluationForModify = (eval_id, rm_id) => {
  return axios.get(`/api/roadmap/modify?eval_id=${eval_id}&rm_id=${rm_id}`);
};
export const modifyEvaluation = (payload) => {
  return axios.post(
    `/api/roadmap/modify?eval_id=${payload.eval_id}&rm_id=${payload.rm_id}&memId=${payload.profes_id}`,
    payload
  );
};
// ------------------------------------------ 공용

export function checkSession() {
  return axios.get('/api/login/check');
}
// 로그아웃
export function logoutUser() {
  return axios.post('/api/login/logout', {});
}
export function loginUser(id, pwd) {
  return axios.post(
    '/api/login/index',
    { id, pwd }
  );
}
export const getUserSession = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) return { name: "", id: "", pictureUrl: "/img/user1.png" };

    // 파일명만 뽑아내기
    const fileName = user.picture ? user.picture.split("\\").pop().split("/").pop() : null;

    return {
      ...user,
      pictureUrl: fileName 
        ? `/upload/profile/${fileName}`   // 서버 매핑된 URL로 변환
        : "/img/user1.png"
    };

    // return {
    //   ...user,
    //   pictureUrl: user.mem_id 
    //     ? `http://localhost/campus/member/getPicture?id=${user.mem_id}` 
    //     : ""
    // };
  } catch (err) {
    console.error("세션에서 사용자 정보를 가져오는데 실패:", err);
    return { name: "", id: "", pictureUrl: "/img/user1.png" };
  }
};


// ------------------------------------------ 강의 공지사항

export function changeLecMajor(lec_id) {
  return axios.post("/api/lecnotice/changeMajor", null, { params: { lec_id } });
}

export function getLecNoticeList({
  memId,
  lecId,
  page = 1,
  perPage = 10,
  searchType = "",
  keyword = "",
}) {
  return axios.get("/api/lecnotice", {
    params: {
      memId,
      lecId,
      page,
      perPage,
      ...(searchType ? { searchType } : {}),
      ...(keyword ? { keyword } : {}),
    },
  });
}

export function getLecNoticeDetail(id, { increaseView = true } = {}) {
  return axios.get(`/api/lecnotice/${id}`, { params: { increaseView } });
}

export function createLecNoticeMultipart(formData) {
  return axios.post("/api/lecnotice", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
export function createLecNoticeJson(body) {
  return createLecNoticeMultipart(toFormData(body));
}
export function updateLecNoticeJson(id, body) {
  return axios.put(`/api/lecnotice/${id}`, toFormData(body), {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
export function updateLecNoticeMultipart(id, formData) {
  return axios.post(`/api/lecnotice/${id}/update`, formData);
}
export function deleteLecNotice(id) {
  return axios.delete(`/api/lecnotice/${id}`);
}

export function lecNoticeDownloadUrl(id, which = 1) {
  return `/campus/lecnotice/file?lecNoticeId=${id}&which=${which}`;
}
export async function downloadLecNoticeFile(id, which = 1) {
  const url = lecNoticeDownloadUrl(id, which);
  const res = await axios.get(url, { responseType: "blob" });
  return res.data;
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

// ------------------------------------------ 게시판

export function changeBoardMajor(lec_id) {
  return axios.post("/api/board/changeMajor", null, { params: { lec_id } });
}

const SEARCH_MAP = { title: "t", writer: "w", content: "c", t: "t", w: "w", c: "c", "": "" };

export function getBoardList({
  page = 1,
  perPage = 10,
  searchType = "", 
  keyword = "",
  category = "",
  lecId = "",
}) {
  const st = SEARCH_MAP[searchType] ?? SEARCH_MAP[""];
  return axios.get("/api/board", {
    params: {
      page,
      perPage,
      ...(st ? { searchType: st } : {}),
      ...(keyword ? { keyword } : {}),
      ...(category ? { category } : {}),
      ...(lecId ? { lecId } : {}),
    },
  });
}

export function getBoardDetail(id, { increaseView = true } = {}) {
  return axios.get(`/api/board/${id}`, { params: { increaseView } });
}

export function createBoardJson(body) {
  return axios.post("/api/board", toFormData(body), {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
export function createBoardMultipart(formData) {
  return axios.post("/api/board", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
export function updateBoardJson(id, body) {
  return axios.put(`/api/board/${id}`, toFormData(body), {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
export function updateBoardMultipart(id, formData) {
  return axios.put(`/api/board/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
export function deleteBoard(id) {
  return axios.delete(`/api/board/${id}`);
}

export function boardDownloadUrl(id) {
  return `/campus/board/file?boardId=${encodeURIComponent(id)}`;
}
export async function downloadBoardFile(id) {
  const url = boardDownloadUrl(id);
  const res = await axios.get(url, { responseType: "blob" });
  return res.data;
}
export function increaseBoardView(boardId) {
  return axios.post("/api/board/increaseView", null, { params: { boardId } });
}

export const createReply = (boardId, replytext) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const fd = new FormData();
  fd.append("boardId", boardId);
  fd.append("replytext", replytext);
  fd.append("memId", user.mem_id || "");
  fd.append("memName", user.mem_name || "");

  return axios.post("/api/reply/regist", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 댓글 목록
export const getReplyList = (boardId) =>
  axios.get(`/api/reply/list/${boardId}`);

// 댓글 수정
export const updateReply = (rno, replytext) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const fd = new FormData();
  fd.append("replytext", replytext);
  fd.append("memId", user.mem_id || "");

  return axios.post(`/api/reply/${rno}/update`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
// 댓글 삭제
// 댓글 삭제
export const deleteReply = (rno) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  return axios.delete(`/api/reply/${rno}`, {
    params: { memId: user.mem_id || "" }
  });
};

// ------------------------------------------ 과제

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

// ------------------------------------------ 마이페이지

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

// ------------------------------------------ 홈 대시보드


export function getHomeWrapperStu() {
  const userStorage = sessionStorage.getItem("user-storage");

  let memId;
  if (userStorage) {
    try {
      const parsed = JSON.parse(userStorage);
      memId = parsed?.state?.user?.mem_id;
    } catch (e) {
      console.error("user-storage 파싱 실패", e);
    }
  }

  let url = "/api/lecDashStu/main";
  if (memId) url += `?memId=${memId}`;

  return axios.get(url); // baseURL 제거, 프록시 사용
}




// ------------------------------------------ 메일

export function getMailDash() {
  const userStorage = sessionStorage.getItem("user-storage");

  let memId;
  if (userStorage) {
    try {
      const parsed = JSON.parse(userStorage);
      memId = parsed?.state?.user?.mem_id;
    } catch (e) {
      console.error("user-storage 파싱 실패", e);
    }
  }

  let url = "/api/message/main";
  if (memId) url += `?memId=${memId}`;

  return axios.get(url); // baseURL 제거, 프록시 사용
}

export function getMailReceive(page = 1, filter = "", keyword = "") {
  const userStorage = sessionStorage.getItem("user-storage");

  let memId;
  if (userStorage) {
    try {
      const parsed = JSON.parse(userStorage);
      memId = parsed?.state?.user?.mem_id;
    } catch (e) {
      console.error("user-storage 파싱 실패", e);
    }
  }

  const params = new URLSearchParams({
    memId, page, keyword, perPageNum: 10
  });

  if (filter) {
    params.append("filter", filter);
  }

  let url = `/api/message/receive?${params.toString()}`;

  return axios.get(url); // baseURL 제거, 프록시 사용
}

export function getMailSend(page = 1, filter = "", keyword = "") {
  const userStorage = sessionStorage.getItem("user-storage");

  let memId;
  if (userStorage) {
    try {
      const parsed = JSON.parse(userStorage);
      memId = parsed?.state?.user?.mem_id;
    } catch (e) {
      console.error("user-storage 파싱 실패", e);
    }
  }

  const params = new URLSearchParams({
    memId, page, keyword, perPageNum: 10
  });

  if (filter) {
    params.append("filter", filter);
  }

  let url = `/api/message/send?${params.toString()}`;

  return axios.get(url); // baseURL 제거, 프록시 사용
}

export function getMailWaste(page = 1, keyword = "") {
  const userStorage = sessionStorage.getItem("user-storage");

  let memId;
  if (userStorage) {
    try {
      const parsed = JSON.parse(userStorage);
      memId = parsed?.state?.user?.mem_id;
    } catch (e) {
      console.error("user-storage 파싱 실패", e);
    }
  }

  const params = new URLSearchParams({
    memId, page, keyword, perPageNum: 10
  });


  let url = `/api/message/waste?${params.toString()}`;

  return axios.get(url); // baseURL 제거, 프록시 사용
}

export function getMailDetail(mail_id, memId) {
  const userStorage = sessionStorage.getItem("user-storage");

  if (userStorage) {
    try {
      const parsed = JSON.parse(userStorage);
      memId = parsed?.state?.user?.mem_id;
    } catch (e) {
      console.error("user-storage 파싱 실패", e);
    }
  }

  const params = new URLSearchParams({
    memId, mail_id
  });


  let url = `/api/message/detail?${params.toString()}`;

  return axios.get(url); // baseURL 제거, 프록시 사용
}

export const registMail = async (formData) => {
  return axios.post("/api/message/regist", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


export const updateMailSnedLockToggle = async (mail_id) => {
  return axios.post("/api/message/toggleSLock", null, { params: { mail_id } })
};

export const updateMailSendImpToggle = async (mail_id) => {
  return axios.post("/api/message/toggleSImp", null, { params: { mail_id } })
};

export const updateMailReceiveLockToggle = async (mail_id) => {
  return axios.post("/api/message/toggleRLock", null, { params: { mail_id } })
};

export const updateMailReceiveImpToggle = async (mail_id) => {
  return axios.post("/api/message/toggleRImp", null, { params: { mail_id } })
};

export const updateMailWaste = async (mail_id) => {
  return axios.post("/api/message/movewaste", null, { params: { mail_id } })
};

export const updateMailDetailWaste = async (mail_id) => {
  return axios.post("/api/message/movewaste/detail", null, { params: { mail_id } })
};

export const updateMailWasteBack = async (mail_id) => {
  return axios.post("/api/message/backwaste", null, { params: { mail_id } })
};

export const deleteMail = async (mail_id) => {
  return axios.post("/api/message/delete", null, { params: { mail_id } })
};

export const deleteMailAll = async () => {
  return axios.post("/api/message/allWaste")
};


// ------------------------------------------




// ------------------------------------------






