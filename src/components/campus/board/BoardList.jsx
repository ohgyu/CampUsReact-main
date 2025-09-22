import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  dropdownArrow, searchIcon, pageArrow1, pageArrow2, pageArrow3, pageArrow4, clip,
} from '../img';
import {
  ListHeader, CatTitle, FlexDiv, Writer,
  SearchBar, SearchDrop, SearchText,
  DropHeader, DropList, DropOption,
  WHContainer, DateBox, Title, Button,
  PageNation, PageArrowButton, PageNumText, PageNumberButton, PageText,
} from '../commons/WHComponent';
import { getBoardList, changeBoardMajor, getReplyList, getUserSession } from '../api';   

const SEARCH_OPTIONS = ['전체', '제목', '작성자', '내용'];
const CATEGORY_OPTIONS = ['전체', '공지', '자유', '질문', '자료'];
const searchTypeMap = { 전체: '', 제목: 'title', 작성자: 'writer', 내용: 'content' };

function BoardList() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [searchSelected, setSearchSelected] = useState('전체');
  const [listSelected, setListSelected] = useState('전체');
  const [keyword, setKeyword] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const user = getUserSession();

  const formatDate = (v) => {
    try {
      const d = new Date(v);
      if (!Number.isNaN(d.getTime())) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const d2 = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${d2}`;
      }
      const s = String(v);
      return s.length >= 10 ? s.slice(0, 10) : s;
    } catch {
      return '';
    }
  };

  const fetchListWithReplies = useCallback(async () => {
    setLoading(true);
    try {
      const searchType = searchTypeMap[searchSelected] ?? '';
      const searchKeyword = keyword.trim();

      const { data } = await getBoardList({
        page,
        perPage,
        searchType,
        keyword: searchKeyword,
        category: listSelected === '전체' ? '' : listSelected,
      });

      let itemsWithReply = Array.isArray(data?.items) ? data.items : [];

      if (searchType === 'title' && searchKeyword) {
        itemsWithReply = itemsWithReply.filter(it =>
          (it.boardName || '').includes(searchKeyword)
        );
      }
      if (searchType === 'writer' && searchKeyword) {
        itemsWithReply = itemsWithReply.filter(it =>
          (it.memName || it.writer || it.memId || '').includes(searchKeyword)
        );
      }
      if (searchType === 'content' && searchKeyword) {
        itemsWithReply = itemsWithReply.filter(it =>
          (it.boardContent || it.boardDesc || '').includes(searchKeyword)
        );
      }

      const replyCounts = await Promise.all(
        itemsWithReply.map((it) =>
          getReplyList(it.boardId).then((res) => ({
            boardId: it.boardId,
            replyCnt: res.data.items?.length || 0,
          }))
        )
      );

      itemsWithReply = itemsWithReply.map((it) => {
        const rc = replyCounts.find((r) => r.boardId === it.boardId);
        return { ...it, replyCnt: rc?.replyCnt || 0 };
      });

      setItems(itemsWithReply);
      setTotalPage(data?.page?.totalPage ?? 1);
      setTotalCount(data?.page?.totalCount ?? 0);
    } catch (e) {
      console.error('게시판 목록 로드 실패:', e);
      setItems([]);
      setTotalPage(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, searchSelected, listSelected, keyword]);

  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const lecId =
      qs.get('lecId') ||
      qs.get('lec_id') ||
      sessionStorage.getItem('lecId') ||
      sessionStorage.getItem('lec_id') ||
      localStorage.getItem('selectedLecId') ||
      '';

    if (lecId) {
      changeBoardMajor(lecId)
        .catch(() => {})
        .finally(() => fetchListWithReplies()); 
    } else {
      fetchListWithReplies();   
    }
  }, [fetchListWithReplies, location.search]);

  const onSearchClick = () => {
    setPage(1);
    fetchListWithReplies();
  };
  const onSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      fetchListWithReplies();
    }
  };

  const toggleSearchOpen = () => setSearchOpen((v) => !v);
  const toggleListOpen = () => setListOpen((v) => !v);
  const handleSearchSelect = (value) => {
    setSearchSelected(value);
    setSearchOpen(false);
    setPage(1);
  };
  const handleListSelect = (value) => {
    setListSelected(value);
    setListOpen(false);
    setPage(1);
  };

  const goFirst = () => setPage(1);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPage, p + 1));
  const goLast = () => setPage(totalPage);
  const goTo = (n) => setPage(n);

  const pageNumbers = (() => {
    const span = 2;
    const start = Math.max(1, page - span);
    const end = Math.min(totalPage, page + span);
    const arr = [];
    for (let i = start; i <= end; i += 1) arr.push(i);
    return arr;
  })();

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#f7f7f7" }}>
      <ListHeader style={{ height: '146px' }}>
        <FlexDiv>
          <CatTitle>게시판</CatTitle>
          <Button onClick={() => navigate(`/board/write?memId=${user.mem_id}`)}>글쓰기</Button>
        </FlexDiv>

        <FlexDiv>
          <SearchDrop>
            <DropHeader onClick={toggleSearchOpen}>
              {searchSelected}
              <img src={dropdownArrow} style={{ width: 13, height: 8, marginLeft: 'auto', display: 'block', marginTop: 8 }} alt="" />
            </DropHeader>
            {searchOpen && (
              <DropList>
                {SEARCH_OPTIONS.map(o => (
                  <DropOption key={o} onClick={() => handleSearchSelect(o)}>{o}</DropOption>
                ))}
              </DropList>
            )}
          </SearchDrop>
          <SearchBar>
            <img src={searchIcon} style={{ width: 15, height: 16, marginBottom: 8, cursor: 'pointer' }} onClick={onSearchClick} alt="" />
            <SearchText
              placeholder="검색어를 입력해 주세요."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={onSearchKeyDown}
            />
          </SearchBar>
        </FlexDiv>

        <FlexDiv>
          <FlexDiv style={{ width: '668px' }}>
            <div style={{ marginTop: 16, fontSize: 14 }}>총 게시물 {totalCount.toLocaleString()}건</div>
            <div style={{ marginTop: 16, marginLeft: 13, fontSize: 14 }}>페이지 {Math.min(page, totalPage)}/{Math.max(totalPage, 1)}</div>
            {loading && <div style={{ marginTop: 16, marginLeft: 10, fontSize: 14, color: '#2EC4B6' }}>불러오는 중…</div>}
          </FlexDiv>
          <SearchDrop>
            <DropHeader onClick={toggleListOpen} style={{ borderTop: '1px solid #ccc', width: '70px', height: '28px', marginTop: '15px', lineHeight: '15px' }}>
              {listSelected}
              <img src={dropdownArrow} style={{ width: 13, height: 8, marginLeft: 'auto', display: 'block', marginTop: 5 }} alt="" />
            </DropHeader>
            {listOpen && (
              <DropList style={{ width: '70px' }}>
                {CATEGORY_OPTIONS.map(o => (
                  <DropOption key={o} onClick={() => handleListSelect(o)}>{o}</DropOption>
                ))}
              </DropList>
            )}
          </SearchDrop>
        </FlexDiv>
      </ListHeader>

      {items.length === 0 && !loading && (
        <div style={{ padding: 18, color: '#666' }}>게시글이 없습니다.</div>
      )}

      {items.map((it) => {
        const hasFile = it.pfileName && it.pfileName !== 'none.pdf';
        const titleText = `[${it.boardCat || '일반'}] ${it.boardName || ''}`;
        const writer = it.memName || it.writer || it.memId || '-';
        const replyCnt = Number(it.replyCnt) || 0;  

        return (
          <WHContainer
            key={it.boardId}
            style={{ height: "83px", cursor: 'pointer' }}
            onClick={() => navigate(`/board/detail/${it.boardId}?memId=${user.mem_id}`)}
            role="button"
            tabIndex={0}
          >
            <div style={{ width: '350px' }}>
              <DateBox>{formatDate(it.boardDate)}</DateBox>
              <FlexDiv>
                <Title>{titleText}</Title>
                {hasFile && <img src={clip} style={{ height: '12px', marginTop: '6px', marginLeft: '8px' }} alt="" />}
              </FlexDiv>
              <Writer>{writer}</Writer>
            </div>

            <div
              style={{
                width: "28px",
                height: "28px",
                border: "1px solid #ccc",
                borderRadius: "14px",
                marginTop: "11px",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  textAlign: "center",
                  lineHeight: "25px",
                  color: "#2EC4B6",
                  fontWeight: "700",
                }}
              >
                {replyCnt}
              </span>
            </div>
          </WHContainer>
        );
      })}

      {totalPage > 1 && (
        <nav>
          <PageNation>
            <PageArrowButton onClick={goFirst}>
              <PageText href="#"><img src={pageArrow1} style={{ width: "13px", height: "10px", marginLeft: '6px' }} alt="" /></PageText>
            </PageArrowButton>
            <PageArrowButton onClick={goPrev}>
              <PageText href="#"><img src={pageArrow2} style={{ width: "6px", height: "10px", marginLeft: '10px' }} alt="" /></PageText>
            </PageArrowButton>
            {pageNumbers.map((n) => (
              <PageNumberButton key={n} onClick={() => goTo(n)}>
                <PageNumText href="#" style={{ fontWeight: n === page ? 700 : 400, color: n === page ? '#2EC4B6' : undefined }}>
                  {n}
                </PageNumText>
              </PageNumberButton>
            ))}
            <PageArrowButton onClick={goNext}>
              <PageText href="#"><img src={pageArrow3} style={{ width: "6px", height: "10px", marginLeft: '10px' }} alt="" /></PageText>
            </PageArrowButton>
            <PageArrowButton onClick={goLast}>
              <PageText href="#"><img src={pageArrow4} style={{ width: "13px", height: "10px", marginLeft: '6px' }} alt="" /></PageText>
            </PageArrowButton>
          </PageNation>
        </nav>
      )}
    </div>
  );
}

export default BoardList;