import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

import $ from "jquery";
window.$ = window.jQuery = $;
import "summernote/dist/summernote-lite.css";
import "summernote/dist/summernote-lite.js";

import { Cancle } from "../img";
import { Container } from "../topNav/TopNav";
import { Button } from "../commons/WHComponent";

import {
  getUserSession,
  createBoardMultipart,
  changeBoardMajor,
} from "../api";

// TopNav/SideMenu 가리는 전체 오버레이
const Fullscreen = styled.div`
  position: fixed; inset: 0; background:#fff; z-index:4000;
  display:flex; flex-direction:column; overflow-y:auto;
  -webkit-overflow-scrolling:touch;
`;
const Body = styled.div`padding:16px; box-sizing:border-box;`;
const TitleInput = styled.input`
  width:100%; border:0; border-bottom:1px solid #dcdcdc;
  padding:10px 2px; font-size:14px; outline:none;
  ::placeholder{ color:#bdbdbd; }
`;
const EditorWrap = styled.div`
  margin-top:16px;
  .note-editor.note-frame{ border:0; box-shadow:none; font-family:'Noto Sans KR','Noto Sans',sans-serif; }
  .note-toolbar{ border:0; padding:6px 0; }
  .note-statusbar{ display:none; }
  .note-editable{ min-height:305px; font-size:14px; line-height:1.5; }
`;
const FileRow = styled.div`margin-top:16px; padding-top:14px; border-top:1px solid #e5e5e5;`;
const HiddenFile = styled.input.attrs({ type: "file", id: "boardFile" })`display:none;`;
const FileLabel = styled.label`
  width:74px; height:25px; display:inline-block; text-align:center; align-content:center;
  border:1px solid #bdbdbd; border-radius:5px; background:#f4f4f4;
  font-size:12px; cursor:pointer; user-select:none; margin-right:10px;
`;
const FileText = styled.span`font-size:12px; color:#707070;`;

function isEmptyHtml(html) {
  if (!html) return true;
  const cleaned = html
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .replace(/<br\s*\/?>/gi, "")
    .replace(/<p>\s*<\/p>/gi, "")
    .trim();
  return cleaned === "" || cleaned === "<p></p>";
}

export default function BoardRegist({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserSession();

  // lecId 해석 (쿼리 → 세션/로컬)
  const qs = new URLSearchParams(location.search);
  const lecId =
    qs.get("lecId") ||
    qs.get("lec_id") ||
    sessionStorage.getItem("lecId") ||
    sessionStorage.getItem("lec_id") ||
    localStorage.getItem("selectedLecId") ||
    "";

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("선택된 파일이 없습니다.");
  const [submitting, setSubmitting] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
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
    const listPath = location.pathname.replace(/\/[^/]+$/, "");
    if (listPath && listPath !== location.pathname) navigate(listPath, { replace: true });
    else navigate(`/board?memId=${user.mem_id}`, { replace: true });
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setFileName(f ? f.name : "선택된 파일이 없습니다.");
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const html = getContentHtml();

    if (!title.trim()) { alert("제목을 입력해주세요."); return; }
    if (isEmptyHtml(html)) { alert("내용을 입력해주세요."); return; }
    if (!lecId) { alert("전공(lecId) 정보가 없습니다. 사이드메뉴에서 전공을 먼저 선택하세요."); return; }

    try {
      setSubmitting(true);

      // 세션 major 및 스토리지 동기화
      try { await changeBoardMajor(lecId); } catch { }
      sessionStorage.setItem("lecId", lecId);
      sessionStorage.setItem("lec_id", lecId);
      localStorage.setItem("selectedLecId", lecId);

      // FormData
      const fd = new FormData();
      fd.append("lecId", lecId);
      fd.append("lec_id", lecId); // 백엔드 키 차이 대비
      fd.append("boardName", title.trim());
      fd.append("boardDesc", html);
      fd.append("memId", user?.mem_id || "");
      fd.append("category", "자유");
      if (file) fd.append("files", file);

      console.log("[BoardRegist] POST /api/board payload:", {
        lecId, boardName: title.trim(), category: "자유", file: !!file
      });

      await createBoardMultipart(fd);

      alert("등록되었습니다.");
      navigate(
        `/board?lecId=${encodeURIComponent(lecId)}&ts=${Date.now()}`,
        { replace: true, state: { lecId } }
      );
    } catch (e) {
      console.error("게시글 등록 실패:", e?.response?.data || e);
      alert("등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Fullscreen>
      <Container
        style={{ backgroundColor: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <img src={Cancle} alt="닫기" style={{ width: 19, height: 19, cursor: "pointer" }} onClick={() => navigate(-1)} />
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
          <FileLabel htmlFor="boardFile">파일선택</FileLabel>
          <FileText>{fileName}</FileText>
        </FileRow>
      </Body>
    </Fullscreen>
  );
}