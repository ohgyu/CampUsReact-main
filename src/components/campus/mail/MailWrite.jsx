import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import $ from "jquery";
window.$ = window.jQuery = $;
import "summernote/dist/summernote-lite.css";
import "summernote/dist/summernote-lite.js";

import { Cancle } from "../img";
import { Container } from "../topNav/TopNav";
import { Button } from "../commons/WHComponent";
import useModalStore, { useMailWriteModalStore, useSideMenuStore, useToastStore } from "../commons/modalStore";
import { getUserSession, registMail } from "../api";
import ConfirmModal from "../commons/ConfirmModal";

export const MailModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 900;

  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => (visible ? 'translateY(0)' : 'translateY(20px)')};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
  transition: all 0.1s ease-in-out;
`

const TopBar = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 24;
  box-sizing: border-box;
  gap: 16px;
`;

const CloseArea = styled.div`
  width: 54px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseBtn = styled.button`
  width: 28px; height: 28px;
  padding: 0; border: none;
  background: url(${Cancle}) center / 24px 24px no-repeat transparent;
  cursor: pointer;
  margin-top: 15px;
  font-size: 0; color: transparent;
`;

const Spacer = styled.div` flex: 1; `;

const SendBtn = styled.button`
  width:62px; height:26px;
  background:#2EC4B6; color:#fff; border:0; border-radius:5px;
  font-weight:500; cursor:pointer;
`;

const Body = styled.div`
  padding: 0 24px 24px;
  box-sizing: border-box;
`;

const ReceiverField = styled.div`
  margin-top: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #909090;
  display: flex;
  align-items: center;
  gap: 10px;
`;
const ReceiverLabel = styled.div`
  width: 72px;
  font-size: 14px;
  font-weight: 600;
  color: #606060;
`;
const ReceiverInput = styled.input`
  flex: 1; min-width: 0;
  border: 0; outline: none; background: transparent;
  font-size: 14px; color: #333;
  ::placeholder { color: #BDBDBD; }
`;

const TitleInput = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid #909090;
  padding: 14px 2px 12px;
  font-size: 14px;
  outline: none;
  ::placeholder { color: #BDBDBD; }
`;

const Divider = styled.div`
  height: 1px; background: #e5e5e5; margin: 12px 0;
`;

const EditorWrap = styled.div`
  .note-editor.note-frame { border:0; box-shadow:none; font-family:'Noto Sans KR','Noto Sans',sans-serif; }
  .note-toolbar { border:0; padding:6px 0; }
  .note-statusbar { display:none; }
  .note-editable { min-height:305px; line-height:1.5; }
`;

const FileRow = styled.div` margin-top: 16px; `;
const FileDivider = styled.div` height:1px; background:#D9D9D9; margin-bottom:14px; `;
const HiddenFile = styled.input.attrs({ type: "file", id: "mailFile" })` display:none; `;
const FileLabel = styled.label`
  display:inline-block; width:74px; height:25px; text-align:center; align-content:center;
  border:1px solid #bdbdbd; border-radius:5px; font-size:12px; cursor:pointer; user-select:none;
  background:#f4f4f4; margin-right:10px;
`;
const FileText = styled.span` font-size:12px; color:#707070; `;

export default function MailWrite() {
  const [receiver, setReceiver] = useState("");
  const [title, setTitle] = useState("");
  const [html, setHtml] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileName, setFileName] = useState("선택된 파일이 없습니다.");
  const editorRef = useRef(null);
  const { visible, hideModal } = useMailWriteModalStore();
  const user = getUserSession();
  const { showToast } = useToastStore();

  useEffect(() => {
    const $el = $(editorRef.current);
    $el.summernote({
      placeholder: "내용을 입력해주세요.",
      height: 305,
      minHeight: 305,
      backgroundColor: '#fff',
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
    return () => { try { $el.summernote("destroy"); } catch (_) { } };
  }, [visible]);

  const handleSubmit = async () => {

    if (!receiver.trim()) {
      showToast("받는 사람를 입력해주세요.");
      return;
    }
    if (!title.trim()) {
      showToast("제목을 입력해주세요.");
      return;
    }
    if (!html.trim()) {
      showToast("내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();

    formData.append("mail_name", title);
    formData.append("mail_desc", html);
    formData.append("mail_receiver", receiver);
    formData.append("mail_sender", user.mem_id);

    for (let file of selectedFiles) {
      formData.append("uploadFile", file); // 커멘드 필드명과 동일
    }

    useModalStore.getState().showConfirm(
      "정말로 보내시겠습니까?",
      async () => {

        try {
          const res = await registMail(formData);
          if (res.data.success) showToast("메일을 보냈습니다.");
          hideModal(); // 모달 닫기
          // 필요하다면 상태 초기화
          setReceiver("");
          setTitle("");
          setHtml("");
          setSelectedFiles([]);
          setFileName("선택된 파일이 없습니다.");

        } catch (err) {
          console.error(err);
          showToast("보내기를 실패했습니다.");
        }
      }
    );
  };

  return (
    <div style={{ padding: '0px' }}>
      <MailModal visible={visible}>
        {visible && (
          <div>
            <Container style={{ backgroundColor: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <img src={Cancle} style={{ width: '19px', height: '19px', cursor: 'pointer' }} onClick={hideModal}></img>
              <Button onClick={handleSubmit}>보내기</Button>
            </Container>

            <Body>
              <ReceiverField>
                <ReceiverLabel>받는 사람</ReceiverLabel>
                <ReceiverInput
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  placeholder="이메일 또는 이름을 입력하세요"
                />
              </ReceiverField>

              <TitleInput placeholder="제목을 입력해주세요." value={title} onChange={(e) => setTitle(e.target.value)} />

              <EditorWrap>
                <div ref={editorRef} />
              </EditorWrap>

              <FileRow>
                <FileDivider />
                <HiddenFile
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setSelectedFiles(files);
                    setFileName(files.length > 0 ? files.map(f => f.name).join(", ") : "선택된 파일이 없습니다.");
                  }}
                />
                <FileLabel htmlFor="mailFile">파일선택</FileLabel>
                <FileText>{fileName}</FileText>
              </FileRow>
            </Body>
          </div>
        )}
      </MailModal>
      <ConfirmModal />
    </div>
  );
}