import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

import $ from "jquery";
window.$ = window.jQuery = $;
import "summernote/dist/summernote-lite.css";
import "summernote/dist/summernote-lite.js";

import { Cancle } from "../img";
import { Container } from "../topNav/TopNav";
import { Button } from "../commons/WHComponent";

import {
  getUserSession,
  createLecNoticeMultipart,
  changeLecMajor,
} from "../api";
import { useToastStore } from "../commons/modalStore";

const Body = styled.div`padding:16px;box-sizing:border-box;`;
const TitleInput = styled.input`
  width:100%;border:0;border-bottom:1px solid #dcdcdc;padding:10px 2px;font-size:14px;outline:none;
  ::placeholder{color:#bdbdbd;}
`;
const EditorWrap = styled.div`
  margin-top:16px;
  .note-editor.note-frame{border:0;box-shadow:none;font-family:'Noto Sans KR','Noto Sans',sans-serif;}
  .note-toolbar{border:0;padding:6px 0;}
  .note-statusbar{display:none;}
  .note-editable{min-height:305px;font-size:14px;line-height:1.5;}
`;
const FileRow = styled.div`margin-top:16px;padding-top:14px;border-top:1px solid #e5e5e5;`;
const HiddenFile = styled.input.attrs({ type: "file", id: "lecPdsFile" })`display:none;`;
const FileLabel = styled.label`
  width:74px;height:25px;text-align:center;align-content:center;display:inline-block;border:1px solid #bdbdbd;border-radius:5px;
  font-size:12px;cursor:pointer;user-select:none;background:#f4f4f4;margin-right:10px;
`;
const FileText = styled.span`font-size:12px;color:#707070;`;

export default function LectureNoticeRegist({ onClose, memId: propMemId, lecId: propLecId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToastStore();

  const user = getUserSession();
  const auth = user?.mem_auth || "";
  const isProfessor = auth.includes("ROLE02") || auth.includes("ROLE_ROLE02");

  const search = new URLSearchParams(location.search);
  const resolvedLecId =
    propLecId ||
    search.get("lecId") ||
    sessionStorage.getItem("lecId") ||
    localStorage.getItem("selectedLecId") ||
    "";

  const resolvedProfesId =
    propMemId ||
    search.get("memId") ||
    sessionStorage.getItem("memId") ||
    user?.mem_id ||
    "";

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("선택된 파일이 없습니다.");
  const [submitting, setSubmitting] = useState(false);

  const editorRef = useRef(null);

  useEffect(() => {
    if (!isProfessor) { showToast("작성 권한이 없습니다."); goBack(); return; }
    const $el = $(editorRef.current);
    $el.summernote({
      placeholder: "내용을 입력해주세요.",
      height: 305, minHeight: 305,
      toolbar: [
        ["style", ["bold", "underline", "clear"]],
        ["para", ["ul", "ol", "paragraph"]],
        ["insert", ["picture", "link"]],
        ["view", ["codeview"]],
      ],
    });
    return () => { try { $el.summernote("destroy"); } catch (_) { } };
  }, []);

  const getContentHtml = () => $(editorRef.current).summernote("code");

  const goBack = () => {
    if (typeof onClose === "function") { onClose(false); return; }
    navigate(`/notice?memId=${resolvedProfesId}&lecId=${resolvedLecId}`, { replace: true });
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setFileName(f ? f.name : "선택된 파일이 없습니다.");
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const html = getContentHtml();
    const text = html.replace(/<[^>]*>/g, "").replace(/&nbsp;|\s+/g, " ").trim();

    if (!title.trim()) { showToast("제목을 입력해주세요."); return; }
    if (!text) { showToast("내용을 입력해주세요."); return; }
    if (!resolvedLecId) { showToast("강의(전공) 선택 정보가 없습니다."); return; }
    if (!resolvedProfesId) { showToast("작성자 정보가 없습니다(로그인 세션 확인)."); return; }

    try {
      setSubmitting(true);
      try { await changeLecMajor(resolvedLecId); } catch { }

      const fd = new FormData();
      fd.append("memId", resolvedProfesId)
      fd.append("lecId", resolvedLecId);
      fd.append("profesId", resolvedProfesId);
      fd.append("lecNoticeName", title.trim());
      fd.append("lecNoticeDesc", html);
      if (file) fd.append("files", file);

      const res = await createLecNoticeMultipart(fd);
      console.log("📌 등록 API 응답:", res);
      if (res.data?.ok) {
        showToast("등록되었습니다.");
        if (typeof onClose === "function") onClose(true);
        else navigate(`/notice?memId=${resolvedProfesId}&lecId=${resolvedLecId}`, { replace: true });
      } else {
        showToast("등록 실패: " + (res.reason || "알 수 없는 오류"));
      }

    } catch (e) {
      console.error("공지 등록 실패:", e?.response?.data || e);
      showToast("등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Container
        style={{
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src={Cancle} alt="닫기" style={{ width: 19, height: 19, cursor: "pointer" }} onClick={goBack} />
        <Button as="button" type="button" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "등록 중..." : "등록"}
        </Button>
      </Container>

      <Body>
        <TitleInput
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <EditorWrap><div ref={editorRef} /></EditorWrap>

        <FileRow>
          <HiddenFile onChange={handleFileChange} />
          <FileLabel htmlFor="lecPdsFile">파일선택</FileLabel>
          <FileText>{fileName}</FileText>
        </FileRow>
      </Body>
    </div>
  );
}