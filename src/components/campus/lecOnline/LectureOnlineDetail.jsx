import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getLectureVideoDetail, getUserSession } from "../api";

// ====== styled-components 그대로 유지 ======
const PageWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background: #fff;
`;

const MobileShell = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 10px 20px 24px;
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
`;
const ModifyBtn = styled.button`
  width: 50px;
  height: 26px;
  padding: 0 12px;
  font-size: 12px;
  border: none;
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
  margin-bottom: 15px;
  margin-top: 20px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0 10px 8px;
`;
const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #98a1a8;
  margin-left: 10px;
`;
const CardHr = styled.div`
  width: 372px;
  height: 1px;
  background: #D9D9D9;
  border: 0;
  margin: 12px 0 20px;
`;

const VideoWrap = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
  border: 1px solid #e9eef2;
  margin-bottom: 18px;
`;
const VideoTag = styled.video`
  display: block;
  width: 100%;
  height: auto;
`;

const Desc = styled.p`
  font-size: 14px;
  color: #6b7680;
  line-height: 1.7;
  margin: 12px 10px 50px;
`;
const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
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
  margin-right: 10px;
`;

// ====== 컴포넌트 ======
export default function LectureOnlineDetail() {
  const [searchParams] = useSearchParams();
  const lecId = searchParams.get("lec_id");
  const lecvid_id = searchParams.get("lecvid_id");
  const memId = searchParams.get("memId");
  const navigate = useNavigate(); 
  const user = getUserSession();
  const isProfessor = user?.mem_auth?.includes("ROLE02");

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lecId || !lecvid_id || !memId) return;

    setLoading(true);
    getLectureVideoDetail(lecId, lecvid_id, memId)
      .then(res => setVideo(res.data.video))
      .catch(err => console.error("강의 상세 불러오기 실패:", err))
      .finally(() => setLoading(false));
  }, [lecId, lecvid_id, memId]);

  if (loading) return <div style={{ textAlign:"center", marginTop:"50px" }}>불러오는 중...</div>;
  if (!video) return <div style={{ textAlign:"center", marginTop:"50px" }}>강의를 찾을 수 없습니다.</div>;

  return (
    <PageWrap>
      <MobileShell>
        <TopBar>
          <PageTitle>온라인 강의</PageTitle>
          <TopActions>
          {isProfessor && (
            <ModifyBtn 
              onClick={() => navigate(`/online/${lecvid_id}/modify?lec_id=${lecId}&memId=${memId}`)}
            >
              수정
            </ModifyBtn>
          )}
        </TopActions>
        </TopBar>
        <PageDivider />

        <Title>{video.lecvidName}</Title>
        <MetaRow>
          <span>{video.lecvidWeek || "주차 미정"}</span>
          <span>
            {video.lecvidDeadline
              ? new Date(video.lecvidDeadline).toLocaleDateString("ko-KR")
              : "기간 미정"}
          </span>
        </MetaRow>

        <CardHr />

        <VideoWrap>
          <VideoTag
            controls
            preload="metadata"
            poster={`http://localhost/campus/${video.lecvidThumbnail}`}
            src={`http://localhost/campus/${video.lecvidVidpath}`}
          />
        </VideoWrap>
        <CardHr />

        <Desc>{video.lecvidDetail || "강의 설명이 없습니다."}</Desc>

        <CardHr />

        <Footer>
          <Button onClick={() => navigate(-1)}>
            목록
          </Button>
        </Footer>
      </MobileShell>
    </PageWrap>
  );
}