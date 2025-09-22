import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { clip } from "../img";
import ConfirmModal from "../commons/ConfirmModal";
import { useToastStore } from "../commons/modalStore";

/* ===== styled-components ===== */
const MobileShell = styled.div`
  width: 100%;
  background: #f7f7f7;
`;
const TopBar = styled.div`display: flex; align-items: center;`;
const PageTitle = styled.div`font-size: 18px; margin-bottom: 5px; margin-left: 10px;`;
const TopActions = styled.div`
  margin-left: auto; 
  display: flex; 
  gap: 8px; 
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
`;
const ModifyBtn = styled.button`
  width: 50px; height: 26px; padding: 0 12px; font-size: 12px; border: none;
  background: #2EC4B6; color: #fff; border-radius: 5px; cursor: pointer;
`;
const PageDivider = styled.div`
  height: 2px; background: #2ec4b6; opacity: .6; border-radius: 2px; margin-bottom: 15px;
`;
const Card = styled.div`
  background: #fff;
  & + & { position: relative; margin-top: 20px; }
  & + &::before { content: ""; position: absolute; left: 0; right: 0; top: -12px; height: 2px; background: #2ec4b6; border-radius: 2px; }
`;
const CardTitle = styled.div`font-size: 16px; font-weight: 700; margin: 2px 0 8px; margin-left: 10px;`;
const CardMeta = styled.div`font-size: 12px; color: #98a1a8; margin-left: 10px;`;
const CardHr = styled.div`width: 372px; height: 1px; background: #D9D9D9; border: 0; margin: 16px 0 15px;`;
const AssignBody = styled.div`font-size: 14px; color: #6b7680; line-height: 1.7; margin-bottom: 100px; margin-left: 10px; margin-right: 10px;`;
const CardFooter = styled.div`margin-top: 12px; display: flex; justify-content: flex-end; gap: 8px;`;
const Button = styled.button`
  height: 28px; padding: 0 12px; font-size: 12px; border: 1px solid #dfe5ea;
  background: #fff; color: #59636b; border-radius: 8px; cursor: pointer; margin-right: 10px;
`;
const SectionTitle = styled.h4`font-size: 14px; font-weight: 700; margin: 15px 10px 6px;`;
const SectionDivider = styled.div`height: 2px; background: #2ec4b6; opacity: .6; border-radius: 2px; margin-bottom: 3px;`;
const List = styled.div`margin-left: 10px;`;
const Row = styled.div`
  width: 100%; text-align: left; padding: 12px 0;
  display: grid; grid-template-columns: 40px 1fr 20px; gap: 10px; align-items: flex-start;
  border-bottom: 1px solid #eceff1;
`;
const Avatar = styled.div`
  width: 36px; height: 36px; border-radius: 50%; background: #f2f4f6; border: 1px solid #e3e7ec;
  display: flex; align-items: center; justify-content: center; font-size: 14px; color: #6b7680; overflow: hidden;
`;
const AttachmentIcon = styled.img`display: block; width: 16px; height: 16px; object-fit: contain; margin-top: 10px;`;
const AvImg = styled.img`width: 100%; height: 100%; object-fit: cover;`;
const RowMain = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const RowTop = styled.div`display: flex; align-items: center; gap: 8px; font-size: 13px; color: #374151;`;
const StuName = styled.span`font-weight: 700; color: #374151;`;
const Time = styled.span`font-size: 12px; color: #98a1a8;`;
const Text = styled.div`font-size: 13px; color: #6b7680; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;

/* ===== util ===== */
const toYMD = (v) => {
  if (!v) return "";
  const d = new Date(v);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const toHM = (v) => {
  if (!v) return "";
  const d = new Date(v);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
const fmtDateTime = (v) => (v ? new Date(v).toLocaleString() : "-");

export default function LectureHomeworkProDetail() {
  const { hwNo } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    hwName: "",
    hwDesc: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    lecsId: "",
  });
  const { showToast } = useToastStore();

  const user = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("user") || "null"); }
    catch { return null; }
  }, []);
  const isProfessor = !!user?.mem_auth?.includes?.("ROLE02");

  const fetchDetail = async () => {
    const res = await axios.get("/api/homeworksubmit/listByHwNo", { params: { hwNo } });
    setData(res.data);
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        await fetchDetail();
      } catch (e) {
        console.error("교수 상세 로드 실패:", e);
        if (!ignore) setData(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [hwNo]);

  if (loading) return <div>로딩중...</div>;
  if (!data) return <div style={{ padding: 16 }}>데이터를 불러오지 못했습니다.</div>;

  const { homework, submitList = [] } = data || {};

  const enterEdit = () => {
    if (!homework) return;
    setForm({
      hwName: homework.hwName || "",
      hwDesc: homework.hwDesc || "",
      startDate: toYMD(homework.hwStartDate),
      startTime: toHM(homework.hwStartDate),
      endDate: toYMD(homework.hwEndDate),
      endTime: toHM(homework.hwEndDate),
      lecsId: homework.lecsId || homework.lecId || "",
    });
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const saveEdit = async () => {
    try {
      const payload = new URLSearchParams();
      payload.append("hwName", form.hwName);
      payload.append("lecsId", form.lecsId || homework.lecsId || homework.lecId || "");
      payload.append("startDate", form.startDate);
      payload.append("startTime", form.startTime);
      payload.append("endDate", form.endDate);
      payload.append("endTime", form.endTime);
      payload.append("hwNo", String(homework.hwNo));
      payload.append("hwDesc", form.hwDesc);

      await axios.post("/api/homework/edit", payload, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      await fetchDetail();
      setIsEditing(false);
      showToast("수정되었습니다.");
    } catch (e) {
      console.error(e);
      showToast("수정에 실패했습니다.");
    }
  };

  const openSubmission = (s) => {
    navigate(`/homework/stu/${s.hwsubHsno}?memId=${user.mem_id}`);
  };
  const downloadUrl = (filename) => `/api/homeworksubmit/download?filename=${encodeURIComponent(filename)}`;
  const goBack = () => navigate(-1);

  return (
    <div>
      <MobileShell>
        {/* 과제 설명 카드 */}
        <div style={{ backgroundColor: '#fff', marginBottom: '12px', padding: '1px 20px 24px' }}>
          <TopBar>
            <PageTitle>과제제출</PageTitle>
            <TopActions>
              {isProfessor && !isEditing && (
                <ModifyBtn onClick={enterEdit}>수정</ModifyBtn>
              )}
              {isProfessor && isEditing && (
                <>
                  <ModifyBtn onClick={cancelEdit} style={{ backgroundColor: '#aaa' }}>취소</ModifyBtn>
                  <ModifyBtn onClick={saveEdit}>저장</ModifyBtn>
                </>
              )}
            </TopActions>
          </TopBar>
          <PageDivider />

          <Card>
            {!isEditing ? (
              <>
                <CardTitle>{homework?.hwName}</CardTitle>
                <CardMeta>
                  {fmtDateTime(homework?.hwStartDate)} ~ {fmtDateTime(homework?.hwEndDate)}
                </CardMeta>
                <CardHr />
                <AssignBody>{homework?.hwDesc}</AssignBody>
              </>
            ) : (
              <div style={{ padding: "0 10px" }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 14, color: "#888", fontWeight: '500' }}>과제명</label>
                  <input type="text" name="hwName" value={form.hwName} onChange={onChange}
                    style={{ width: "360px", padding: '5px 8px', borderRadius: 3, border: "1px solid #ccc", outline: 'none', marginLeft: '-3px', fontSize: '14px' }}
                  />
                </div>

                <div style={{ marginBottom: 12, display: "flex", gap: 10, width: "360px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 14, color: "#888", fontWeight: '500' }}>시작일</label>
                    <input type="date" name="startDate" value={form.startDate} onChange={onChange}
                      style={{ width: "100%", padding: '5px 8px', borderRadius: 3, border: "1px solid #ccc", outline: 'none', marginLeft: '-3px', fontSize: '14px' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 14, color: "#888", fontWeight: '500' }}>시작 시간</label>
                    <input type="time" name="startTime" value={form.startTime} onChange={onChange}
                      style={{ width: "100%", padding: '5px 8px', borderRadius: 3, border: "1px solid #ccc", outline: 'none', marginLeft: '-3px', fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 12, display: "flex", gap: 10, width: "360px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 14, color: "#888", fontWeight: '500' }}>마감일</label>
                    <input type="date" name="endDate" value={form.endDate} onChange={onChange}
                      style={{ width: "100%", padding: '5px 8px', borderRadius: 3, border: "1px solid #ccc", outline: 'none', marginLeft: '-3px', fontSize: '14px' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 14, color: "#888", fontWeight: '500' }}>마감 시간</label>
                    <input type="time" name="endTime" value={form.endTime} onChange={onChange}
                      style={{ width: "100%", padding: '5px 8px', borderRadius: 3, border: "1px solid #ccc", outline: 'none', marginLeft: '-3px', fontSize: '14px' }}
                    />
                  </div>

                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 14, color: "#888", fontWeight: '500' }}>설명</label>
                  <textarea name="hwDesc" value={form.hwDesc} onChange={onChange} rows={6}
                    style={{ width: "360px", padding: '5px 8px', borderRadius: 3, border: "1px solid #ccc", outline: 'none', marginLeft: '-3px', fontSize: '14px' }}
                  />
                </div>
              </div>
            )}

            <CardHr />
            <CardFooter>
              <Button onClick={goBack}>목록</Button>
            </CardFooter>
          </Card>
        </div>

        {/* 제출 목록 카드 */}
        {!isEditing && (
          <div style={{ backgroundColor: '#fff', padding: '1px 20px 24px' }} >
            <SectionTitle style={{ marginBottom: '10px' }}>제출 과제</SectionTitle>
            <SectionDivider />
            <Card>
              <List>
                {submitList.length === 0 && (
                  <div style={{ width: '350px', height: '50px', textAlign: 'center', lineHeight: '50px', margin: 'auto', color: "#98a1a8" }}>제출 내역이 없습니다.</div>
                )}
                {submitList.map((s) => (
                  <Row key={s.hwsubHsno} onClick={() => openSubmission(s)}>
                    <Avatar>
                      {s.stuPicPath ? (
                        <AvImg src={`/member/picture/upload/${s.stuPicPath}`} alt="학생 사진" />
                      ) : (
                        <span>{s.stuName ? s.stuName[0] : "?"}</span>
                      )}
                    </Avatar>
                    <RowMain>
                      <RowTop>
                        <StuName>{s.stuName || "이름없음"}</StuName>
                        <Time>{fmtDateTime(s.submittedAt)}</Time>
                      </RowTop>
                      <Text>{s.hwsubComment || "제출 내용 없음"}</Text>
                    </RowMain>
                    {s.hwsubFilename ? (
                      <a
                        href={downloadUrl(s.hwsubFilename)}
                        onClick={(e) => e.stopPropagation()}
                        title={s.hwsubFilename}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <AttachmentIcon src={clip} alt="첨부" />
                      </a>
                    ) : (
                      <span />
                    )}
                  </Row>
                ))}
              </List>
            </Card>
          </div>
        )}
      </MobileShell>
      <ConfirmModal />
    </div>
  );
}