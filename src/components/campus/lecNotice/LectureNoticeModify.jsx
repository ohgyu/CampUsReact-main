import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import $ from "jquery";
window.$ = window.jQuery = $;
import "summernote/dist/summernote-lite.css";
import "summernote/dist/summernote-lite.js";
import axios from "axios";

import { Cancle } from "../img";
import { updateLecNoticeMultipart } from "../api";
import { useToastStore } from "../commons/modalStore";

// ========== styled-components ==========
const TopBar = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
`;
const CloseBtn = styled.button`
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: url(${Cancle}) center / 24px 24px no-repeat transparent;
  cursor: pointer;
  margin-top: 25px;
  font-size: 0;
  color: transparent;
`;
const Spacer = styled.div` flex: 1; `;
const SubmitBtn = styled.button`
  width: 48px;
  height: 26px;
  background: #2ec4b6;
  color: #fff;
  border: 0;
  border-radius: 5px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 20px;
`;
const Body = styled.div`
  padding: 16px;
  box-sizing: border-box;
`;
const TitleInput = styled.input`
  width: 100%;
  border: 0;
  border-bottom: 1px solid #dcdcdc;
  padding: 10px 2px;
  font-size: 14px;
  outline: none;
  ::placeholder { color: #bdbdbd; }
`;
const EditorWrap = styled.div`
  margin-top: 16px;
  .note-editor.note-frame {
    border: 0;
    box-shadow: none;
    font-family: "Noto Sans KR","Noto Sans",sans-serif;
  }
  .note-toolbar { border: 0; padding: 6px 0; }
  .note-statusbar { display: none; }
  .note-editable {
    min-height: 305px;
    font-size: 14px;
    line-height: 1.5;
  }
`;
const FileRow = styled.div`
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #e5e5e5;
`;
const HiddenFile = styled.input.attrs({ type: "file", id: "lecPdsFile" })`
  display: none;
`;
const FileLabel = styled.label`
  width: 74px;
  height: 25px;
  text-align: center;
  align-content: center;
  display: inline-block;
  border: 1px solid #bdbdbd;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  background: #f4f4f4;
  margin-right: 10px;
`;
const FileText = styled.span`
  font-size: 12px;
  color: #707070;
`;

// ========== Component ==========
export default function LectureNoticeModify({ lecNoticeId }) {
  const [fileName, setFileName] = useState("선택된 파일이 없습니다.");
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");
  const editorRef = useRef(null);
  const { showToast } = useToastStore();

  // Summernote 초기화
  useEffect(() => {
    const $el = $(editorRef.current);
    $el.summernote({
      placeholder: "내용을 입력해주세요.",
      height: 305,
      minHeight: 305,
      toolbar: [
        ["style", ["bold", "underline", "clear"]],
        ["para", ["ul", "ol", "paragraph"]],
        ["insert", ["picture", "link"]],
        ["view", ["codeview"]],
      ],
      callbacks: {
        onChange: (contents) => setHtml(contents),
      },
    });

    return () => {
      try { $el.summernote("destroy"); } catch (_) { }
    };
  }, []);

  // ✅ 수정 제출
  const handleSubmit = async () => {
    console.log("🚀 handleSubmit 실행됨");
    const content = $(editorRef.current).summernote("code");
    const fd = new FormData();

    // 컨트롤러에서 요구하는 이름과 정확히 맞춰야 함
    fd.append("lecNoticeName", title ?? "");
    fd.append("lecNoticeDesc", content ?? "");
    for (let [key, value] of fd.entries()) {
      console.log(key, value);
    }
    // 삭제 옵션 체크박스 같은 UI가 있다면
    // if (removeFile1Checked) fd.append("removeFile1", "on");
    // if (removeFile2Checked) fd.append("removeFile2", "on");

    // 파일들
    const fileInput = document.getElementById("lecPdsFile");
    if (fileInput && fileInput.files.length > 0) {
      Array.from(fileInput.files).forEach(file => {
        fd.append("files", file);
      });
    }

    try {
      const res = await updateLecNoticeMultipart(lecNoticeId, fd);
      if (res.data.ok) {
        showToast("수정 완료!");
      } else {
        showToast("수정 실패: " + res.data.reason);
      }
    } catch (err) {
      console.error("수정 에러:", err);
      showToast("수정에 실패했습니다.");
    }
  };
  return (
    <div>
      <TopBar>
        <CloseBtn aria-label="닫기" />
        <Spacer />
        <SubmitBtn onClick={handleSubmit}>저장</SubmitBtn>
      </TopBar>
      <Body>
        <TitleInput
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <EditorWrap>
          <div ref={editorRef} />
        </EditorWrap>
        <FileRow>
          <HiddenFile
            onChange={(e) => {
              const f = e.target.files?.[0];
              setFileName(f ? f.name : "선택된 파일이 없습니다.");
            }}
          />
          <FileLabel htmlFor="lecPdsFile">파일선택</FileLabel>
          <FileText>{fileName}</FileText>
        </FileRow>
      </Body>
    </div>
  );
}