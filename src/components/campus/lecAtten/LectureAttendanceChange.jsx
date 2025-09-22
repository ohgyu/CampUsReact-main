import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import $ from "jquery";
import "summernote/dist/summernote-lite.css";
import "summernote/dist/summernote-lite.js";

import { Cancle } from "../img";
import { Button } from "../commons/WHComponent";
import { useAttendanceChangeStore } from "../commons/modalStore";
import useModalStore from "../commons/modalStore";

// ================== 모달 기본 ==================
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 3000;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
`;

const ExitButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const ModalFooter = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
`;

// ================== 메인 ==================
function LectureAttendanceChange() {
  const { visible, hide } = useAttendanceChangeStore();
  const { showConfirm } = useModalStore();
  const editorRef = useRef(null);
  const [fileName, setFileName] = useState("선택된 파일이 없습니다.");

  useEffect(() => {
    if (!visible) return;
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
    });
    return () => {
      try { $el.summernote("destroy"); } catch (_) {}
    };
  }, [visible]);

  const handleSubmit = () => {
    const current = $(editorRef.current).summernote("code");
    showConfirm("이의신청을 하시겠습니까?", () => {
      console.log("제출 HTML:", current);
      hide();   // 모달 닫기
    });
  };

  if (!visible) return null;

  return (
    <ModalOverlay onClick={hide}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ExitButton onClick={hide}>
            <img src={Cancle} alt="닫기" style={{ width: 19, height: 19 }} />
          </ExitButton>
          <Button onClick={handleSubmit}>등록</Button>
        </ModalHeader>

        <ModalBody>
          {/* 제목 */}
          <input
            type="text"
            placeholder="제목을 입력해주세요."
            style={{
              width: "100%",
              border: "none",
              borderBottom: "1px solid #ccc",
              padding: "12px 4px",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          />

          {/* 에디터 */}
          <div ref={editorRef} />

          {/* 파일 업로드 */}
          <div style={{ marginTop: "20px" }}>
            <input
              type="file"
              id="attFile"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                setFileName(f ? f.name : "선택된 파일이 없습니다.");
              }}
            />
            <label
              htmlFor="attFile"
              style={{
                display: "inline-block",
                border: "1px solid #aaa",
                borderRadius: "5px",
                padding: "4px 10px",
                fontSize: "12px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              파일선택
            </label>
            <span style={{ fontSize: "12px", color: "#666" }}>{fileName}</span>
          </div>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default LectureAttendanceChange;