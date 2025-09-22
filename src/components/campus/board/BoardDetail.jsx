import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  getBoardDetail,
  deleteBoard,
  boardDownloadUrl,
  getReplyList,
  createReply,
  deleteReply,
  updateReply,
  getUserSession,   // ✅ 수정 API 추가
} from "../api";
import { clip } from "../img";
import { FlexDiv } from "../commons/WHComponent";

// ===== styled-components =====
const MobileShell = styled.div`width: 100vw; background: #f7f7f7;`;
const TopBar = styled.div`display: flex; align-items: center; margin: 6px 0 10px;`;
const PageTitle = styled.div`font-size: 18px; font-weight: 700; margin-left: 10px;`;
const TopActions = styled.div`margin-left: auto; display: flex; gap: 8px; margin-right: 10px;`;
const DeleteBtn = styled.button`
  width: 50px; height: 26px; padding: 0 12px; font-size: 12px;
  border: none; background: #BEBEBE; color: #fff; border-radius: 5px; cursor: pointer;
`;
const ModifyBtn = styled.button`
  width: 50px; height: 26px; padding: 0 12px; font-size: 12px;
  border: none; background: #2EC4B6; color: #fff; border-radius: 5px; cursor: pointer;
`;
const PageDivider = styled.div`height: 2px; background: #2EC4B6; margin-bottom: 13px;`
const Card = styled.div`
  background: #fff;
  width: 412px;
  margin: 0 auto;
  overflow-y: auto;
`;
const CardHead = styled.h3`
  font-size: 16px; font-weight: 700; margin: 0 0 8px; line-height: 1.4; margin-left: 10px;
`;
const Meta = styled.div`font-size: 12px; color: #98a1a8; margin: 0 0 12px 10px;`;
const BodyText = styled.div`
  font-size: 14px; color: #6b7680; line-height: 1.7; white-space: pre-line;
  margin: 0 0 30px 10px;
`;
const Attachment = styled.div`
  display: flex; align-items: center; gap: 10px; border-radius: 12px; margin-left: 10px; width: 355px;
`;
const AttachmentIcon = styled.img`display: block; width: 14px; height: 14px; object-fit: contain;`;
const AttachmentName = styled.a`
  font-size: 13px; color: #444; text-decoration: none;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  &:hover { text-decoration: underline; }
`;
const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 30px;
  margin-top: 120px;
`;
const Button = styled.button`
  width: 50px; height: 26px; padding: 0 12px; font-size: 12px; cursor: pointer;
  border: 1px solid #aaa; background: #fff; color: #aaa; border-radius: 5px; margin: 0 10px 10px 0;
`;
const CardHr = styled.div`width: 370px; height: 1px; background: #D9D9D9; border: 0; margin: 15px 0;`;

const ReplySection = styled.div`
  width: 412px;
  margin: 20px auto 0;
  background: #fff;
  padding: 20px;
  overflow-y: auto;
`;
const ReplyTitle = styled.h4`
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 700;
  border-bottom: 2px solid #2EC4B6;
  padding-bottom: 6px;
`;
const ReplyItem = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  font-size: 14px;
  margin-top: 8px;
`;
const ReplyTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ReplyWriter = styled.span`font-weight: 600; display: block; margin-left:10px;`;
const ReplyDate = styled.span`
  color: #999;
  font-size: 12px;
  margin-left: 5px;
`;
const ReplyText = styled.div`
  margin-top: 4px;
  color: #444;
  line-height: 1.6;
`;
const ReplyActions = styled.div`display: flex; gap: 6px;`;
const ReplyBtnSmall = styled.button`
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid ${(p) => (p.primary ? "#2EC4B6" : "#ccc")};
  background: ${(p) => (p.primary ? "#2EC4B6" : "#f7f7f7")};
  color: ${(p) => (p.primary ? "#fff" : "#666")};
`;

const ReplyInputBox = styled.div`margin-top: 15px;`;
const ReplyHeader = styled.div`
  font-size: 13px; 
  font-weight: 600; 
  color: #555; 
  margin-bottom: 4px;
`;
const ReplyTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  resize: none;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  color: #444;
  &::placeholder { color: #aaa; }
  outline: none;
`;
const ReplySubmitBtn = styled.button`
  margin-top: 6px;
  margin-left: auto;
  display: block;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  background: #2EC4B6;
  color: #fff;
  font-weight: 600;
`;

// 날짜 포맷 함수
const fmtDate = (v) => {
  if (!v) return "";
  try {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${dd}`;
    }
    return String(v).slice(0, 10);
  } catch {
    return "";
  }
};

export default function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getUserSession();

  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");

  const [editingId, setEditingId] = useState(null); // ✅ 수정 중인 댓글
  const [editText, setEditText] = useState("");     // ✅ 수정 텍스트
  const stripHtmlTags = (html) => html?.replace(/<\/?[^>]+(>|$)/g, "") || "";

  // 댓글 목록 불러오기 함수
  const loadReplies = async () => {
    try {
      const { data } = await getReplyList(id);
      setReplies(data.items || []);
    } catch (e) {
      console.error("댓글 목록 로드 실패:", e);
    }
  };

  // 게시글 로드
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await getBoardDetail(id, { increaseView: true });
        if (!mounted) return;
        setItem(data?.item ?? data ?? null);
      } catch (e) {
        console.error("게시글 상세 로드 실패:", e);
        setItem(null);
      } finally {
        mounted = false;
        setLoading(false);
      }
    })();
  }, [id]);

  // 댓글 로드
  useEffect(() => {
    loadReplies();
  }, [id]);

  const goList = () => {
    const from = location.state?.from;
    if (from) navigate(`/board?memId=${user.mem_id}`, { state: from, replace: true });
    else navigate(`/board?memId=${user.mem_id}`);
  };

  const onDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteBoard(id);
      alert("삭제되었습니다.");
      goList();
    } catch (e) {
      console.error(e);
      alert("삭제에 실패했습니다.");
    }
  };

  const onReplySubmit = async () => {
    if (!newReply.trim()) return;
    try {
      const { data } = await createReply(id, newReply.trim());
      if (data.ok) {
        setNewReply("");
        loadReplies();
      } else {
        alert("댓글 등록 실패: " + data.reason);
      }
    } catch (e) {
      console.error("댓글 등록 실패:", e);
    }
  };

  const onReplyUpdate = async (rno, newText) => {
    if (!newText.trim()) return;
    try {
      const { data } = await updateReply(rno, newText.trim());
      if (data.ok) {
        setEditingId(null);
        setEditText("");
        loadReplies();
      } else {
        alert("댓글 수정 실패: " + data.reason);
      }
    } catch (e) {
      console.error("댓글 수정 실패:", e);
    }
  };

  if (loading) return <div style={{ padding: 16 }}>불러오는 중…</div>;

  if (!item) {
    return (
      <MobileShell>
        <div style={{ padding: 16 }}>게시글을 찾을 수 없습니다.</div>
        <div style={{ padding: 16 }}>
          <Button onClick={goList}>목록</Button>
        </div>
      </MobileShell>
    );
  }

  const category = item.category || "일반";
  const title = item.boardName || "";
  const writer = item.memName || item.writer || item.memId || "-";
  const date = fmtDate(item.boardDate);
  const content = item.boardContent ?? item.boardDesc ?? "";
  const hasFile = item.pfileName && item.pfileName !== "none.pdf";
  const fileLabel = item.pfileDetail || item.pfileName;
  const fileHref = boardDownloadUrl(item.boardId || id);

  const loginName = JSON.parse(sessionStorage.getItem("user") || "{}")?.mem_name || "사용자";

  return (
    <MobileShell>
      <div style={{ padding: "5px 20px 24px", backgroundColor: "#fff" }}>
        <TopBar>
          <PageTitle>게시판</PageTitle>
          <TopActions>
            <DeleteBtn onClick={onDelete}>삭제</DeleteBtn>
            <ModifyBtn
              onClick={() =>
                navigate(`/board/modify/${id}?memId=${user.mem_id}`, {
                  state: { from: location.state?.from || null },
                })
              }
            >
              수정
            </ModifyBtn>
          </TopActions>
        </TopBar>
        <PageDivider />

        <Card>
          <CardHead>[{category}] {title}</CardHead>
          <Meta>{writer} ｜ {date}</Meta>
          <CardHr />
          <BodyText>{stripHtmlTags(content)}</BodyText>
          <CardFooter>
            <Button onClick={goList}>목록</Button>
          </CardFooter>
          {hasFile && (
            <>
              <CardHr />
              <Attachment>
                <AttachmentIcon src={clip} alt="clip" />
                <AttachmentName href={fileHref} target="_blank" rel="noreferrer">
                  {fileLabel}
                </AttachmentName>
              </Attachment>
            </>
          )}
        </Card>
      </div>

      {/* 댓글 섹션 */}
      <ReplySection>
        <ReplyTitle>댓글 {replies.length}</ReplyTitle>

        {replies.length === 0 ? (
          <div style={{ color: "#777", padding: "8px 0" }}>댓글이 없습니다.</div>
        ) : (
          replies.map((r) => (
            <ReplyItem key={r.rno}>
              <ReplyTop style={{marginTop:'-5px'}}>
                <FlexDiv style={{width:'200px', marginTop:'-5px'}}>
                  <ReplyWriter>{r.replyer}</ReplyWriter>
                  <ReplyDate>| {fmtDate(r.regdate)}</ReplyDate>
                </FlexDiv>
                <ReplyActions style={{marginRight:'5px'}}>
                  {editingId === r.rno ? (
                    <>
                      {/* 취소 → 저장 순서 */}
                      <ReplyBtnSmall onClick={() => setEditingId(null)}>
                        취소
                      </ReplyBtnSmall>
                      <ReplyBtnSmall
                        primary
                        onClick={() => onReplyUpdate(r.rno, editText)}
                      >
                        저장
                      </ReplyBtnSmall>
                    </>
                  ) : (
                    <>
                      {/* 기본 상태: 삭제 + 수정 */}
                      <ReplyBtnSmall onClick={async () => {
                          if (!window.confirm("삭제하시겠습니까?")) return;
                          await deleteReply(r.rno); setReplies(replies.filter((x) => x.rno !== r.rno)); }} >
                        삭제
                      </ReplyBtnSmall>
                      <ReplyBtnSmall primary onClick={() => { setEditingId(r.rno); setEditText(r.replytext); }} >
                        수정
                      </ReplyBtnSmall>
                    </>
                  )}
                </ReplyActions>
              </ReplyTop>

              {editingId === r.rno ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ width: "360px", minHeight: "60px", marginTop: "10px", padding:'5px 8px', marginLeft:'6px', outline:'none'}}
                />
              ) : (
                <ReplyText style={{marginLeft:'10px'}}>{r.replytext}</ReplyText>
              )}
            </ReplyItem>
          ))
        )}

        {/* 댓글 입력 */}
        <ReplyInputBox>
          <ReplyHeader style={{marginLeft:'5px', marginBottom:'10px', fontWeight:'500'}}>
            {loginName} ｜ {fmtDate(new Date())}
          </ReplyHeader>
          <ReplyTextarea
            placeholder="댓글을 작성해주세요"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
          />
          <ReplySubmitBtn onClick={onReplySubmit} style={{marginRight:'5px'}}>등록</ReplySubmitBtn>
        </ReplyInputBox>
      </ReplySection>
    </MobileShell>
  );
}