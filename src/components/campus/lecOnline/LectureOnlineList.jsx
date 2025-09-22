import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getLectureVideoList } from "../api";
import {
    ListHeader,
    CatTitle,
    FlexDiv,
    WHContainer,
    DateBox,
    Title,
    Button,
    SearchDrop,
    DropHeader,
    DropList,
    DropOption,
} from "../commons/WHComponent";
import { dropdownArrow, listArrow } from "../img";
import LectureOnlineRegist from "./LectureOnlineRegist";

export const Thumnail = styled.div`
  width: 106px;
  height: 64px;
  border-radius: 5px;
  background-image: url("${(props) => props.src || ""}");
  background-size: cover;
  background-position: center;
`;

function LectureOnlineList() {
    const [dropOpen, setDropOpen] = useState(false);
    const [dropSelected, setDropSelected] = useState("전체");
    const [videoList, setVideoList] = useState([]);
    const [role, setRole] = useState(""); // ✅ 사용자 역할
    const [showRegistModal, setShowRegistModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const lecId = searchParams.get("lec_id");
    const memId = searchParams.get("memId");

    const toggleOpen = () => setDropOpen((prev) => !prev);
    const handleDropSelect = (value) => {
        setDropSelected(value);
        setDropOpen(false);
    };

    useEffect(() => {
        if (!lecId || !memId) return;

        const fetchVideos = async () => {
            try {
                const res = await getLectureVideoList(lecId, memId, "1주차");
                console.log("📌 API 응답 전체 res:", res);
                setVideoList(res.data.videoList || []);
                setRole(res.data.role || "student");
            } catch (err) {
                console.error("영상 목록 불러오기 실패:", err);
            }
        };

        fetchVideos();
    }, [location.search]);

    return (
        <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#f7f7f7" }}>
            <ListHeader style={{ height: "96px" }}>
                <div>
                    <FlexDiv>
                        <CatTitle>온라인 강의</CatTitle>

                        {/* ✅ ROLE02(교수)만 등록 버튼 보이도록 */}
                        {role === "professor" && (
                            <Button onClick={() => setShowRegistModal(true)}>등록</Button>
                        )}
                    </FlexDiv>
                </div>
                <FlexDiv style={{ marginTop: "10px", justifyContent: "center" }}>
                    <SearchDrop style={{ width: "371px", marginTop: "-9px" }}>
                        <DropHeader
                            style={{
                                width: "371px",
                                height: "28px",
                                fontSize: "13px",
                                lineHeight: "16px",
                                justifyContent: "center",
                                gap: "10px",
                            }}
                            onClick={toggleOpen}
                        >
                            <div>{dropSelected}</div>
                            <div>
                                <img
                                    src={dropdownArrow}
                                    style={{
                                        width: "13px",
                                        height: "8px",
                                        marginLeft: "auto",
                                        marginTop: "4px",
                                    }}
                                    alt="v"
                                />
                            </div>
                        </DropHeader>
                        {dropOpen && (
                            <DropList style={{ width: "371px", textAlign: "center" }}>
                                <DropOption onClick={() => handleDropSelect("전체")}>
                                    전체
                                </DropOption>
                                <DropOption onClick={() => handleDropSelect("옵션1")}>
                                    옵션1
                                </DropOption>
                                <DropOption onClick={() => handleDropSelect("옵션2")}>
                                    옵션2
                                </DropOption>
                            </DropList>
                        )}
                    </SearchDrop>
                </FlexDiv>
            </ListHeader>

            {/* ✅ 영상 목록 */}
            {videoList.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "40px", color: "#666" }}>
                    등록된 강의가 없습니다.
                </div>
            ) : (
                videoList.map((video) => (
                    <WHContainer
                        key={video.lecvidId}
                        style={{
                            height: "122px",
                            flexDirection: "column",
                            cursor: "pointer",
                        }}
                        onClick={() =>
                            navigate(
                                `/online/detail?lec_id=${lecId}&lecvid_id=${video.lecvidId}&memId=${memId}`
                            )
                        }
                    >
                        <FlexDiv>
                            <Thumnail src={`http://localhost//campus/${video.lecvidThumbnail}`} />
                            <div
                                style={{
                                    marginLeft: "5px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "2px",
                                }}
                            >
                                <Title style={{ marginBottom: "20px" }}>{video.lecvidName}</Title>
                                <DateBox>
                                    {video.lecvidDeadline
                                        ? new Date(video.lecvidDeadline).toLocaleDateString("ko-KR")
                                        : "기간 미정"}
                                </DateBox>
                            </div>
                            <div style={{ marginLeft: "auto", marginTop: "8px" }}>
                                <img
                                    src={listArrow}
                                    style={{ height: "20px", marginTop: "6px" }}
                                    alt=">"
                                />
                            </div>
                        </FlexDiv>
                        <div style={{ marginTop: "10px" }}>
                            <div
                                style={{
                                    width: "372px",
                                    height: "20px",
                                    background: "#ddd",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                }}
                            >
                                <div
                                    style={{
                                        width: `${video.progress || 0}%`,
                                        height: "100%",
                                        background: "#2EC4B6",
                                        textAlign: "center",
                                        lineHeight: "20px",
                                        color: "#212121",
                                    }}
                                >
                                    {video.progress || 0}%
                                </div>
                            </div>
                        </div>
                    </WHContainer>
                ))
            )}
            {/* ✅ 등록 모달 */}
            {showRegistModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0, left: 0,
                        width: "100%", height: "100%",
                        backgroundColor: "#fff",
                        zIndex: 2000,
                        overflowY: "auto",
                    }}
                >
                    <LectureOnlineRegist onClose={() => setShowRegistModal(false)} />
                </div>
            )}
        </div>
    );
}

export default LectureOnlineList;