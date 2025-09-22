import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { clip } from "../img";
import {
  getUserSession,
  getLecNoticeDetail,
  updateLecNoticeMultipart,
  deleteLecNotice,
  downloadLecNoticeFile,
} from "../api";
import { FlexDiv } from "../commons/WHComponent";
import useModalStore, { useToastStore } from "../commons/modalStore";
import ConfirmModal from "../commons/ConfirmModal";

const MobileShell = styled.div`
  width: 100vw;
  padding: 12px 20px 24px;
  background: #fff;
`;

const TopBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 6px 0 10px;
`;

const PageTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-left: 10px;
`;

const TopActions = styled.div`
  display: flex;
  gap: 8px;
`;

const MutedBtn = styled.button`
  width: 50px;
  height: 26px;
  padding: 0 12px;
  font-size: 12px;
  border: none;
  background: #bebebe;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
`;

const PrimaryBtn = styled.button`
  width: 50px;
  height: 26px;
  padding: 0 12px;
  font-size: 12px;
  border: none;
  background: #2ec4b6;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
`;

const PageDivider = styled.div`
  width: 372px;
  height: 2px;
  background: #2ec4b6;
  opacity: 0.6;
  border-radius: 2px;
  margin-bottom: 14px;
`;

const Card = styled.div`
  background: #fff;
`;

const CardHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 6px;
  line-height: 1.4;
  margin-left: 10px;
`;

const ViewCount = styled.span`
  font-size: 13px;
  color: #98a1a8;
  margin-right: 10px;
  width: 70px;
  text-align: right;
`;

const DateText = styled.div`
  font-size: 12px;
  color: #98a1a8;
  margin-left: 10px;
`;

const CardHr = styled.div`
  width: 372px;
  height: 1px;
  background: #d9d9d9;
  border: 0;
  margin: 12px 0 10px;
`;

const GrayLine = styled.div`
  width: 372px;
  height: 1px;
  background: #d9d9d9;
  border: 0;
  margin: 9px auto 14px;
`;

const BodyText = styled.div`
  font-size: 13px;
  color: #212121;
  line-height: 1.5;
  white-space: pre-line;
  margin-left: 10px;
  margin-bottom: 200px;
  width: 350px;
`;

const Attachment = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  margin-top: 16px;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 0;
  width: 360px;
`;

const AttachmentIcon = styled.img`
  display: block;
  width: 14px;
  height: 14px;
  background: #fff;
  object-fit: contain;
  margin-left: 10px;
`;

const AttachmentName = styled.div`
  font-size: 13px;
  color: #444;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardFooter = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
`;

const OutlineBtn = styled.button`
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
  border: 1px solid #2ec4b6;
  background: #fff;
  color: #2ec4b6;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 10px;
`;

const TitleInput = styled.input`
  width: 350px;
  padding: 5px;
  font-size: 14px;
  margin-left: 10px;
  border: 1px solid #ccc;
  outline: none;
  ::placeholder { color: #bdbdbd; }
`;

const ContentInput = styled.textarea`
  width: calc(100% - 20px);
  min-height: 220px;
  margin: 8px 10px 0 10px;
  border: 1px solid #ccc;
  padding: 12px;
  font-size: 13px;
  line-height: 1.5;
  resize: vertical;
  outline: none;
`;

const FileRow = styled.div`
  margin-top: 12px;
  padding: 10px 10px 0 10px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HiddenFile = styled.input.attrs({ type: "file" })`
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
`;

const FileText = styled.span`
  font-size: 12px;
  color: #707070;
`;

const fmtDate = (v) => {
  try {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    const s = String(v);
    return s.length >= 10 ? s.slice(0, 10) : s;
  } catch {
    return "";
  }
};

export default function LectureNoticeDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const state = location.state;
  const user = getUserSession();

  const [item, setItem] = useState(state?.item || null);

  const noticeId =
    params.lecNoticeId ??
    params.id ??
    state?.item?.lecNoticeId ??
    state?.item?.id ??
    item?.lecNoticeId ??
    item?.id ??
    null;

  const auth = user?.mem_auth || "";
  const isProfessor = auth.includes("ROLE02") || auth.includes("ROLE_ROLE02");

  const [loading, setLoading] = useState(!state?.item);
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [newFile, setNewFile] = useState(null);
  const fileInputRef = useRef(null);
  const stripHtmlTags = (html) => html?.replace(/<\/?[^>]+(>|$)/g, "") || "";

  const qs = new URLSearchParams(location.search);
  const urlMemId = qs.get("memId") || "";
  const urlLecId = qs.get("lecId") || qs.get("lec_id") || "";

  const stateMemId = state?.from?.memId;
  const stateLecId = state?.from?.lecId || state?.from?.lec_id;
  const { showToast } = useToastStore();

  const fallbackLecId =
    item?.lecId ||
    localStorage.getItem("selectedLecId") ||
    "";

  const resolveListQuery = () => {
    const memId = stateMemId || urlMemId || user?.mem_id || "";
    const lec_id = stateLecId || urlLecId || fallbackLecId || "";
    return { memId, lec_id };
  };

  useEffect(() => {
    const fetchDetail = async (id) => {
      try {
        setLoading(true);
        const { data } = await getLecNoticeDetail(id);
        setItem(data);
      } catch (e) {
        console.error("공지 상세 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    if (!item && noticeId) fetchDetail(noticeId);
  }, [noticeId]);

  const goBack = () => {
    const { memId, lec_id } = resolveListQuery();
    if (!memId || !lec_id) {
      navigate(-1);
      return;
    }
    navigate(`/notice?memId=${encodeURIComponent(memId)}&lec_id=${encodeURIComponent(lec_id)}`, {
      replace: true,
      state: state?.from,
    });
  };

  // 수정
  const onClickModify = () => {
    if (!item) return;
    setTitle(item.lecNoticeName || "");
    setDesc(item.lecNoticeDesc || "");
    setNewFile(null);
    setEdit(true);
  };

  const onCancelEdit = () => {
    setEdit(false);
    setNewFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSaveEdit = async () => {
    if (!noticeId) {
      showToast("잘못된 접근입니다(id 없음).");
      return;
    }
    if (!title.trim()) {
      showToast("제목을 입력해주세요.");
      return;
    }

    try {
      const form = new FormData();
      form.append("lecNoticeName", title);
      form.append("lecNoticeDesc", desc);
      if (newFile) {
        form.append("files", newFile);
      }

      const { data } = await updateLecNoticeMultipart(String(noticeId), form);

      setItem((prev) => ({
        ...prev,
        lecNoticeName: data?.lecNoticeName ?? title,
        lecNoticeDesc: data?.lecNoticeDesc ?? desc,
        fileName: data?.fileName ?? prev?.fileName,
        fileDetail: data?.fileDetail ?? prev?.fileDetail,
      }));

      setEdit(false);
      showToast("수정되었습니다.");
    } catch (e) {
      console.error("공지 수정 실패:", e.response?.data || e);
      showToast("수정에 실패했습니다.");
    }
  };

  const onDelete = async () => {
    if (!noticeId) {
      showToast("잘못된 접근입니다(id 없음).");
      return;
    }
    useModalStore.getState().showConfirm(
      "정말로 삭제하시겠습니까?",
      async () => {
        try {
          await deleteLecNotice(String(noticeId));
          showToast("삭제되었습니다.");
          goBack();
        } catch (e) {
          console.error("공지 삭제 실패:", e.response?.data || e);
          showToast("삭제에 실패했습니다.");
        }
      });
  };

  const onDownload = async () => {
    if (!noticeId) {
      showToast("잘못된 접근입니다(id 없음).");
      return;
    }
    if (!item?.fileName && !item?.fileDetail) {
      showToast("첨부파일이 없습니다.");
      return;
    }
    try {
      const filename = item.fileName || item.fileDetail || "attachment";
      const blob = await downloadLecNoticeFile(String(noticeId));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("첨부 다운로드 실패:", e.response?.data || e);
      showToast("파일 다운로드에 실패했습니다.");
    }
  };

  // 렌더
  if (!noticeId) {
    return (
      <div style={{ padding: 16 }}>
        잘못된 접근입니다. (공지 ID 없음)
        <div style={{ marginTop: 12 }}>
          <button onClick={goBack}>목록으로</button>
        </div>
      </div>
    );
  }
  if (loading || !item) return <div style={{ padding: 16 }}>불러오는 중…</div>;

  return (
    <>
      <MobileShell>
        <TopBar>
          <PageTitle>공지사항</PageTitle>

          {isProfessor && !edit && (
            <TopActions>
              <MutedBtn onClick={onDelete}>삭제</MutedBtn>
              <PrimaryBtn onClick={onClickModify}>수정</PrimaryBtn>
            </TopActions>
          )}
          {isProfessor && edit && (
            <TopActions>
              <MutedBtn onClick={onCancelEdit}>취소</MutedBtn>
              <PrimaryBtn onClick={onSaveEdit}>저장</PrimaryBtn>
            </TopActions>
          )}
        </TopBar>

        <PageDivider />

        <Card>
          <CardHead>
            {edit ? (
              <TitleInput
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해주세요."

              />
            ) : (
              <>
                <FlexDiv>
                  <div style={{ width: '290px' }}>
                    <CardTitle>{item.lecNoticeName}</CardTitle>
                    <DateText>{fmtDate(item.lecNoticeDate)}</DateText>
                  </div>
                  <ViewCount>조회수: {item.viewCnt ?? 0}</ViewCount>
                </FlexDiv>
              </>
            )}
          </CardHead>

          <CardHr />

          {edit ? (
            <>
              <ContentInput
                value={stripHtmlTags(desc)}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="내용을 입력해주세요."
              />
              <FileRow>
                <HiddenFile
                  ref={fileInputRef}
                  id="lecNoticeFile"
                  onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
                />
                <FileLabel htmlFor="lecNoticeFile">파일선택</FileLabel>
                <FileText>
                  {newFile
                    ? newFile.name
                    : item.fileName || item.fileDetail || "선택된 파일이 없습니다."}
                </FileText>
              </FileRow>
            </>
          ) : (
            <>
              <BodyText>{stripHtmlTags(item.lecNoticeDesc)}</BodyText>
              {(item.fileName || item.fileDetail) && (
                <Attachment onClick={onDownload}>
                  <AttachmentIcon src={clip} />
                  <AttachmentName>{item.fileName || item.fileDetail}</AttachmentName>
                </Attachment>
              )}
            </>
          )}

          <GrayLine />

          <CardFooter>
            <OutlineBtn onClick={goBack}>목록</OutlineBtn>
          </CardFooter>
        </Card>
      </MobileShell>
      <ConfirmModal />
    </>
  );
}