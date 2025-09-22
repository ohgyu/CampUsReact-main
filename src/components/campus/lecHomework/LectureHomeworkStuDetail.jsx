import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { clip, Cancle } from "../img";
import { Container } from "../topNav/TopNav";
import { Button } from "../commons/WHComponent";
import ConfirmModal from "../commons/ConfirmModal";
import { useToastStore } from "../commons/modalStore";

/* ===== 스타일 정의 (기존 그대로) ===== */
const MobileShell = styled.div`width: 100%; background: #f7f7f7;`;
const MintDivider = styled.div`width:100%;height:2px;background:#2ec4b6;opacity:.6;border-radius:2px;margin-bottom:14px;`;
const Card = styled.div`background:#fff;`;
const SubHeader = styled.div`display:flex;gap:10px;align-items:center;margin-left:15px;`;
const Avatar = styled.div`
  width:32px;height:32px;border-radius:50%;background:#f3f4f6;border:1px solid #e5e7eb;
  display:flex;align-items:center;justify-content:center;font-size:14px;color:#6b7680;overflow:hidden;
`;
const AvImg = styled.img`width:100%;height:100%;object-fit:cover;`;
const NameTimeRow = styled.div`display:flex;align-items:center;gap:8px;`;
const Name = styled.span`font-size:13px;font-weight:700;color:#374151;`;
const Time = styled.span`font-size:12px;color:#9ca3af;`;
const Meta = styled.div`font-size:12px;color:#98a1a8;`;
const FileLine = styled.div`display:flex;align-items:center;gap:8px;font-size:12px;color:#6b7280;margin-left:15px;`;
const FileLink = styled.a`
  font-size:13px;
  color:#707070;
  cursor:pointer;
  text-decoration:none;
`;
const BodyText = styled.p`
  font-size:14px;
  line-height:1.7;
  white-space:pre-line;
  margin:10px 15px 100px;
`;
const AttachmentIcon = styled.img`width:14px;height:14px;object-fit:contain;`;
const CardFooterRight = styled.div`display:flex;justify-content:flex-end;margin-top:12px;`;
const CardHr = styled.div`width:100%;height:1px;background:#D9D9D9;margin:10px 0 15px;`;
const GhostBtn = styled.button`
  height:30px;padding:0 14px;font-size:12px;border:1px solid #dfe5ea;
  background:#fff;color:#59636b;border-radius:8px;cursor:pointer;margin-right:15px;
`;
const SectionHead = styled.div`display:flex;align-items:center;padding:18px 0 6px;`;
const SectionTitle = styled.h4`margin:0;font-size:14px;font-weight:700;color:#707070;margin-left:15px;`;
const SectionDivider = styled.div`width:100%;height:2px;background:#2ec4b6;opacity:.6;border-radius:2px;margin-bottom:10px;`;
const FbCard = styled(Card)``;
const FbHeader = styled.div`display:grid;grid-template-columns:36px 1fr;gap:10px;align-items:center;margin-left:15px;`;
const FbHeaderRight = styled.div`display:flex;align-items:center;gap:8px;`;
const FbText = styled.div`margin-top:8px;font-size:13px;color:#6b7280;line-height:1.8;margin:0 15px 15px;`;

// 파일명 깔끔하게 만드는 함수
const cleanFilename = (full) => {
  if (!full) return "";
  const idx = full.indexOf("_");
  return idx >= 0 ? full.substring(idx + 1) : full;
};

export default function LectureHomeworkStuDetail() {
  const { submitId } = useParams(); // URL에서 제출 ID 확보
  const navigate = useNavigate();
  const [submit, setSubmit] = useState(null);
  // const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();
  const [feedback, setFeedback] = useState(""); // 실제 저장된 피드백
  const [draftFeedback, setDraftFeedback] = useState("");

  const user = (() => {
    try { return JSON.parse(sessionStorage.getItem("user") || "null"); }
    catch { return null; }
  })();

  const isProfessor = !!user?.mem_auth?.includes?.("ROLE02");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/homeworksubmit/detail", { params: { submitId } });
        if (res.data?.submit) {
          setSubmit(res.data.submit);
          setFeedback(res.data.submit.hwsubFeedback || "");
        }
      } catch (e) {
        console.error("제출 상세 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [submitId]);

  const handleSaveFeedback = async () => {
    if (!draftFeedback.trim()) {
      showToast("피드백을 입력하세요.");
      return;
    }
    try {
      await axios.post("/api/homeworksubmit/feedback", null, {
        params: {
          submitId,
          profId: user?.mem_id || user?.memId,
          feedbackText: draftFeedback,
        },
      });
      setFeedback(draftFeedback); // 저장 시 실제 피드백 업데이트
      setDraftFeedback(""); // 입력창 초기화
      showToast("피드백이 저장되었습니다.");
    } catch (e) {
      console.error(e);
      showToast("피드백 저장 실패");
    }
  };

  if (loading) return <div>로딩중...</div>;
  if (!submit) return <div style={{ padding: 16 }}>제출 데이터를 불러올 수 없습니다.</div>;

  return (
    <div>
      <MobileShell>
        <div style={{ backgroundColor: "#fff", padding: "1px 20px 24px" }}>
          <Container style={{ backgroundColor: "#fff", display: "flex", justifyContent: "space-between" }}>
            <img src={Cancle} alt="닫기" style={{ width: "19px", height: "19px", cursor: "pointer", marginTop: '5px', marginLeft: '-10px' }} onClick={() => navigate(-1)} />
          </Container>
          <MintDivider />

          <Card>
            <SubHeader>
              <Avatar>{submit.stuName ? submit.stuName[0] : (submit.stuId ? submit.stuId[0] : "?")}</Avatar>
              <NameTimeRow>
                <Name>{submit.stuName || submit.stuId}</Name>
                <Meta>ㅣ</Meta>
                <Time>{new Date(submit.submittedAt).toLocaleString()}</Time>
              </NameTimeRow>
            </SubHeader>
            <CardHr />

            <BodyText>{submit.hwsubComment || "내용 없음"}</BodyText>
            {submit.hwsubFilename && (
              <FileLine>
                <AttachmentIcon src={clip} />
                <FileLink
                  href={`/api/homeworksubmit/download?filename=${encodeURIComponent(submit.hwsubFilename)}`}
                  target="_blank"
                >
                  {cleanFilename(submit.hwsubFilename)}
                </FileLink>
              </FileLine>
            )}
            <CardHr />
            <CardFooterRight>
              <GhostBtn onClick={() => { setFeedback(""); setSubmit(null); navigate(-1); }}>목록</GhostBtn>
            </CardFooterRight>
          </Card>
        </div>

        {/* ===== 피드백 영역 ===== */}
        {isProfessor && (
          <div style={{ backgroundColor: "#fff", marginTop: "20px", padding: "0px 20px 24px" }}>
            <SectionHead>
              <SectionTitle>피드백 작성</SectionTitle>
              {!feedback && (
                <Button onClick={handleSaveFeedback} disabled={!draftFeedback}>저장</Button>
              )}
            </SectionHead>
            <SectionDivider />

            <FbCard>
              <FbHeader>
                <Avatar>{user?.mem_name ? user.mem_name[0] : "P"}</Avatar>
                <FbHeaderRight>
                  <Name>{user?.mem_name || "교수"}</Name>
                  <Meta>ㅣ</Meta>
                  <Time>{new Date().toLocaleString()}</Time>
                </FbHeaderRight>
              </FbHeader>
              {feedback ? (
                // 피드백이 이미 있는 경우
                <div style={{ padding: 10, borderTop: "1px solid #dfe5ea", marginTop: 10 }}>
                  {feedback}
                </div>
              ) : (
                // 피드백이 없는 경우, 입력 가능
                <textarea
                  value={draftFeedback}
                  onChange={(e) => setDraftFeedback(e.target.value)}
                  rows={5}
                  style={{ width: "100%", border: "1px solid #dfe5ea", borderRadius: 6, padding: 10, marginTop: 10 }}
                  placeholder="피드백을 입력하세요"
                />
              )}
            </FbCard>
          </div>
        )}
      </MobileShell>
      <ConfirmModal />
    </div>
  );
}