import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  searchIcon, pageArrow1, pageArrow2, pageArrow3, pageArrow4, clip
} from "../img";
import {
  ListHeader, CatTitle, FlexDiv,
  SearchBar, SearchText,
  WHContainer, DateBox, Title, Button, CheckButton,
  PageNation, PageArrowButton, PageNumText, PageNumberButton, PageText
} from "../commons/WHComponent";
import { getUserSession } from "../api";
import { useHomeworkProRegistStore } from "../commons/modalStore";

// 날짜 포맷 (yyyy-MM-dd)
function fmtDateYMD(v) {
  if (!v) return "";
  const d = new Date(v);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function LectureHomeworkList() {
  const [params] = useSearchParams();
  const lecId = params.get("lecId");
  const navigate = useNavigate();

  // 세션에서 로그인 사용자 꺼내기
  const userData = sessionStorage.getItem("user");
  const memId = userData ? JSON.parse(userData).mem_id : null;

  const [rows, setRows] = useState([]);
  const [role, setRole] = useState(""); // "student" | "professor"
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");

  // ✅ 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPageNum = 10;
  const user = getUserSession();
  const showModal = useHomeworkProRegistStore((state) => state.showModal);

  useEffect(() => {
    if (!lecId || !memId) return;

    axios.get("/api/homework/list", {
      params: { lecId, memId, page, perPageNum, keyword }
    })
      .then((res) => {
        const data = res.data || {};
        setRole(data.role || "student");

        const voList = data.homeworkList || [];
        const submitMap = data.submitStatusMap || {};
        const feedMap = data.feedbackMap || {};

        const merged = voList.map((hw) => ({
          hwNo: hw.hwNo,
          title: hw.hwName,
          dateStr: fmtDateYMD(hw.hwStartDate),
          hasAttachment: !!hw.hwAttachCnt,
          submitted: !!submitMap[hw.hwNo],
          feedbacked: !!feedMap[hw.hwNo],
        }));
        setRows(merged);

        // ✅ 전체 페이지 수 계산
        const totalCount = data.pageMaker?.totalCount || 0;
        setTotalPages(Math.max(1, Math.ceil(totalCount / perPageNum)));
      })
      .catch((err) => console.error("❌ 목록 불러오기 실패:", err));
  }, [lecId, memId, page, keyword]);

  // 클릭 시 경로 분기
  const goDetail = (row) => {
    if (role === "professor") {
      navigate(`/homework/pro/${row.hwNo}?memId=${user.mem_id}`);
    } else {
      navigate(`/homework/${row.hwNo}/${memId}?memId=${user.mem_id}`);
    }
  };

  const onKeyDownSearch = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setKeyword(searchInput);
      setPage(1); // 검색 시 1페이지부터 시작
    } else if (e.key === "Escape") {
      setSearchInput("");
      setKeyword("");
      setPage(1);
    }
  };

  // ✅ 페이지 번호 계산 (최대 5개)
  const getPageNumbers = () => {
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div style={{width:"100%", minHeight:"100vh", backgroundColor:"#f7f7f7"}}>
      <ListHeader>
        <FlexDiv>
          <CatTitle>과제제출</CatTitle>
          {role === "professor" && (
            <Button onClick={showModal}>
              글쓰기
            </Button>
          )}
        </FlexDiv>

        {/* 검색창 */}
        <SearchBar style={{width:"363px", marginLeft:'0px', justifyContent: 'start'}}>
          <img src={searchIcon} style={{width:'15px', height:'16px'}} alt="" />
          <SearchText
            placeholder="검색어를 입력해 주세요."
            value={searchInput}
            onChange={(e)=>setSearchInput(e.target.value)}
            onKeyDown={onKeyDownSearch}
          />
        </SearchBar>
      </ListHeader>

      {/* 목록 */}
      {rows.length === 0 && (
        <div style={{ padding: 16, color: "#777" }}>검색 결과가 없습니다.</div>
      )}
      {rows.map((row, i) => (
        <WHContainer
          key={row.hwNo}
          style={{ cursor: "pointer" }}
          onClick={() => goDetail(row)}
        >
          <div style={{width:'37px', lineHeight:'35px'}}>
            {(page - 1) * perPageNum + i + 1}
          </div>
          <div style={{width:'192px'}}>
            <DateBox>{row.dateStr}</DateBox>
            <FlexDiv>
              <Title>{row.title}</Title>
              {row.hasAttachment && (
                <img src={clip} style={{height:'12px', marginTop:'6px', marginLeft:'8px'}} alt="" />
              )}
            </FlexDiv>
          </div>

          {row.submitted
            ? <CheckButton style={{border:'1px solid #2EC4B6', color:'#2EC4B6'}}>제출</CheckButton>
            : <CheckButton>미제출</CheckButton>
          }

          {row.feedbacked
            ? <CheckButton style={{border:'1px solid #2EC4B6', color:'#2EC4B6'}}>평가완료</CheckButton>
            : <CheckButton>미평가</CheckButton>
          }
        </WHContainer>
      ))}

      {/* 페이지네이션 */}
      <nav>
        <PageNation style={{ justifyContent: "center" }}>
          <PageArrowButton onClick={() => setPage(1)} disabled={page === 1}
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src={pageArrow1} style={{ width: "13px", height: "10px" }} alt="first" />
          </PageArrowButton>

          <PageArrowButton onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img src={pageArrow2} style={{ width: "6px", height: "10px" }} alt="prev" />
          </PageArrowButton>
          
          {getPageNumbers().map(num => (
            <PageNumberButton key={num} onClick={() => setPage(num)}>
              <PageNumText style={{
                color: num === page ? "#2EC4B6" : "#000",
                fontWeight: num === page ? "bold" : "normal"
              }}>
                {num}
              </PageNumText>
            </PageNumberButton>
          ))}

          <PageArrowButton onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img src={pageArrow3} style={{ width: "6px", height: "10px" }} alt="next" />
            </PageArrowButton>

            <PageArrowButton onClick={() => setPage(totalPages)} disabled={page === totalPages}
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img src={pageArrow4} style={{ width: "13px", height: "10px" }} alt="last" />
            </PageArrowButton>
        </PageNation>
      </nav>
    </div>
  );
}

export default LectureHomeworkList;