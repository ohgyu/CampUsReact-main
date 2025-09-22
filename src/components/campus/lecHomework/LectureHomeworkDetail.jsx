import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { clip } from "../img";
import ConfirmModal from "../commons/ConfirmModal";
import { FlexDiv } from "../commons/WHComponent";
import { useToastStore } from "../commons/modalStore";


/* ============ style ============ */
const MobileShell = styled.div`
  width: 100vw;
  background: #f7f7f7;
`;
const TopBar = styled.div`
  display: flex;
  align-items: center;
  margin: 6px 0 10px;
`;
const PageTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-left: 10px;
`;
const TopActions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
`;
const ModifyBtn = styled.button`
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
  border: 1px solid #2EC4B6;
  background: #2EC4B6;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
`;
const PageDivider = styled.div`
  height: 2px;
  background: #2ec4b6;
  opacity: 0.6;
  border-radius: 2px;
  margin-top: 18px;
  margin-bottom: 14px;
`;
const Card = styled.div`
  background: #fff;
`;
const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin: 2px 0 8px;
  margin-left: 10px;
`;
const CardMeta = styled.div`
  font-size: 12px;
  color: #98a1a8;
  margin-left: 10px;
`;
const CardFooter = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 2px;
`;
const CardHr = styled.div`
  width: 372px;
  height: 1px;
  background: #d9d9d9;
  border: 0;
  margin: 12px 0 10px;
`;
const AssignBody = styled.div`
  font-size: 13px;
  color: #6b7680;
  line-height: 1.7;
  margin-bottom: 100px;
  margin-left: 10px;
  margin-right: 10px;
  white-space: pre-wrap;
`;
const Button = styled.button`
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
  border: 1px solid #dfe5ea;
  background: #fff;
  color: #59636b;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 40px;
  margin-right: 10px;
`;
const PrimaryButton = styled(Button)`
  background: #2ec4b6;
  color: #fff;
  border-color: #2ec4b6;
  margin-bottom: 10px;
  margin-top: 40px;
`;
const SubmissionHead = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
`;
export const SubmissionAuthor = styled.span`
  white-space: nowrap;
  font-size: 13px;
  margin-left: 10px;
`;
const SubmissionTime = styled.span`
  white-space: nowrap;
  font-size: 12px;
  color: #98a1a8;
`;
const SubmissionActions = styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
  white-space: nowrap;
`;
const ChipBrand = styled.span`
  display: inline-block;
  padding: 4px 9px;
  font-size: 12px;
  line-height: 1;
  border-radius: 5px;
  background: #fff;
  border: 1px solid #2ec4b6;
  color: #1a998d;
  margin-right: 10px;
  cursor: pointer;
`;
const SubmissionText = styled.div`
  font-size: 14px;
  color: #47525b;
  line-height: 1.7;
  margin: 10px 0 12px;
  margin-left: 10px;
  white-space: pre-wrap;
`;
const Attachment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  margin-left: 10px;
`;
const AttachmentIcon = styled.img`
  display: block;
  width: 14px;
  height: 14px;
  background: #fff;
  object-fit: contain;
`;
const AttachmentName = styled.div`
  font-size: 13px;
  color: #444;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Meta = styled.div`
  font-size: 12px;
  color: #98a1a8;
`;
const SectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  margin: 15px 0 6px;
  color: #707070;
  margin-left: 10px;
`;
const SectionDivider = styled.div`
  height: 2px;
  background: #2ec4b6;
  opacity: 0.6;
  border-radius: 2px;
  margin-bottom: 12px;
`;
const FeedbackHead = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 10px;
`;
const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background: #f2f4f6;
  border: 1px solid #e3e7ec;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #6b7680;
`;
const FeedbackName = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #374151;
`;
const FeedbackText = styled.div`
  font-size: 14px;
  color: #6b7680;
  line-height: 1.7;
  white-space: pre-line;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
`;

/* ============ component ============ */
export default function LectureHomeworkDetail() {
  const { hwNo, stuId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [existingFileName, setExistingFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const { showToast } = useToastStore();

  const user = (() => {
    try { return JSON.parse(sessionStorage.getItem("user") || "null"); }
    catch { return null; }
  })();
  const isProfessor = !!user?.mem_auth?.includes?.("ROLE02");
  const memId = user?.mem_id || user?.memId || "";

  useEffect(() => {
    axios.get("/api/homework/student/detail", { params: { hwNo, stuId } })
      .then((res) => setData(res.data));
  }, [hwNo, stuId]);

  if (!data) return <div>로딩중...</div>;
  const { homework, submit } = data;
  const isSubmitted = !!submit;

  const fmtDate = (ts) => (ts ? new Date(ts).toLocaleString() : "");
  const stripHtml = (html) => (html ? html.replace(/<[^>]*>/g, "").trim() : "");

  // 제출/수정
  const onSubmit = async () => {
    if (!comment.trim())
      return showToast("내용을 입력해주세요.");
    if (!homework?.hwNo)
      return showToast("과제 정보가 없습니다.");

    const fd = new FormData();
    fd.append("hwNo", homework.hwNo);
    fd.append("lecsId", homework.lecsId || homework.lecId || "");
    fd.append("stuId", stuId || memId);
    fd.append("hwsubComment", comment);
    if (file) fd.append("uploadFile", file);

    try {
      setSubmitting(true);
      const url = editing ? "/api/homeworksubmit/edit" : "/api/homeworksubmit/submit";
      await axios.post(url, fd, { headers: { "Content-Type": "multipart/form-data" } });

      const res = await axios.get("/api/homework/student/detail", { params: { hwNo, stuId } });
      setData(res.data);
      setComment("");
      setFile(null);
      setExistingFileName("");
      setEditing(false);
      showToast(editing ? "과제가 수정되었습니다." : "과제가 제출되었습니다.");
    } catch (e) {
      console.error(e);
      showToast("제출 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <MobileShell>
        <div style={{ padding: "5px 20px 24px", backgroundColor: "#fff" }}>
          <TopBar>
            <PageTitle onClick={() => navigate(-1)}>과제제출</PageTitle>
            <TopActions>
              {isProfessor && (
                <ModifyBtn type="button">수정</ModifyBtn>
              )}
            </TopActions>
          </TopBar>
          <PageDivider />
          <Card>
            <CardTitle>{homework?.hwName}</CardTitle>
            <CardMeta>
              {fmtDate(homework?.hwStartDate)} ~ {fmtDate(homework?.hwEndDate)}
            </CardMeta>
            <CardHr />
            <AssignBody>{stripHtml(homework?.hwDesc)}</AssignBody>
            <CardHr />
            <CardFooter>
              <Button type="button" onClick={() => navigate(-1)}>목록</Button>
            </CardFooter>
          </Card>
        </div>

        {/* 제출 정보 */}
        {isSubmitted && !editing ? (
          <div style={{ padding: "1px 20px 24px", backgroundColor: "#fff", marginTop: "20px" }}>
            <PageDivider />
            <Card>
              <SubmissionHead>
                <SubmissionAuthor>{stuId}</SubmissionAuthor>
                <Meta>ㅣ</Meta>
                <SubmissionTime>제출 시간 : {fmtDate(submit.submittedAt)}</SubmissionTime>
                <SubmissionActions>
                  {!submit?.hwsubFeedback ? (
                  <ChipBrand onClick={() => { setComment(submit.hwsubComment || ""); setExistingFileName(submit.hwsubFilename || ""); setFile(null); setEditing(true); }} >
                    수정
                  </ChipBrand>
                  ) : (null)}
                </SubmissionActions>
              </SubmissionHead>
              <SubmissionText>{stripHtml(submit?.hwsubComment)}</SubmissionText>
              <CardHr />
              {submit?.hwsubFilename && (
                <Attachment>
                  <AttachmentIcon src={clip} />
                  <AttachmentName>{submit.hwsubFilename}</AttachmentName>
                </Attachment>
              )}
            </Card>
          </div>
        ) : (
          <div style={{ padding: "10px 20px", backgroundColor: "#fff", marginTop: "20px" }}>
            <PageDivider />
            <Card style={{ padding: '0px 10px' }}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>
                {editing ? "과제 수정" : "과제 제출"}
              </div>
              <CardHr style={{width:'368px', marginLeft:'-8px'}}/>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: '14px', color: "#98a1a8", fontWeight:'600' }}>내용</label>
                <textarea
                  rows={6}
                  style={{marginLeft:'-6px', width: "365px", resize: "vertical", padding: 8, border: "1px solid #ccc", borderRadius:'4px', outline:'none' }}
                  placeholder="내용을 입력하세요"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <FlexDiv >
                <label className="btn btn-outline-secondary" style={{ cursor: "pointer", fontSize:'13px', padding:'3px 8px' }}>
                  파일 선택
                  <input type="file" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
                <span style={{ marginLeft: 8, fontSize:'13px', marginTop:'0px', display:'block', width:'270px' }}>
                  {file ? file.name : existingFileName ? existingFileName : "(첨부 없음)"}
                </span>
              </FlexDiv>
              <div style={{ display: "flex", justifyContent: "end"}}>
                <PrimaryButton type="button" onClick={onSubmit} disabled={submitting}>
                  {submitting ? (editing ? "수정 중..." : "제출 중...") : (editing ? "수정" : "제출")}
                </PrimaryButton>
              </div>
            </Card>
          </div>
        )}

        {/* 교수 피드백 */}
        {submit?.hwsubFeedback && (
          <div style={{ backgroundColor: "#fff", marginTop: "20px", padding: "5px 20px 24px" }}>
            <SectionTitle>피드백</SectionTitle>
            <SectionDivider />
            <Card>
              <FeedbackHead>
                <Avatar>
                  {submit.professorPicPath ? (
                    <img
                      src={`/member/picture/upload/${submit.professorPicPath}`}
                      alt="교수 사진"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span>교</span>
                  )}
                </Avatar>
                <FeedbackName>{submit.professorName || "교수"}</FeedbackName>
              </FeedbackHead>
              <FeedbackText>{submit.hwsubFeedback}</FeedbackText>
            </Card>
          </div>
        )}
      </MobileShell>
      <ConfirmModal />
    </div>
  );
}