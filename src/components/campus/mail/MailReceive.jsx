import React, { useEffect, useState } from 'react'
import MailNavBar from './MailNavBar'
import { Container } from '../topNav/TopNav'
import {
    searchIcon, listArrow, pageArrow1, pageArrow2, pageArrow3,
    pageArrow4, allSelect, trash, radioCheck, replace, read, unRead, unImp, imp,
    unLock, lock,
    Cancle,
    clip
} from '../img'
import {
    ListHeader, FlexDiv, SearchBar, SearchText,
    DateBox, Title, Button,
    PageNation, PageArrowButton, PageNumText, PageNumberButton, PageText,
    RegistButton,
    CheckText, MailView, CheckBox, CheckMark
}
    from '../commons/WHComponent'
import { GrayHr } from '../home/HomeWrapperPro'
import styled from 'styled-components'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getMailReceive, getUserSession, updateMailReceiveImpToggle, updateMailReceiveLockToggle, updateMailWaste } from '../api'
import Toast from '../commons/Toast'
import { useToastStore } from '../commons/modalStore'

const MailContainer = styled.div`
    width: 100%;
    height: 65px;
    margin-top: 9px;
    background-color: ${props => props.unread ? '#fff' : '#fbfbfb'};
    padding: 14px 22px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
`
const MailTitle = styled.span`
    display: block;
    font-size: 14px;
    color: ${props => props.unread ? '#212121' : '#999'};
    font-weight: 500;
    white-space: nowrap;       /* 한 줄로 만들기 */
    overflow: hidden;          /* 넘치는 내용 숨기기 */
    text-overflow: ellipsis;   /* ...으로 표시 */
`

const BoxButton = styled.input`
    width: 22px;
    height: 22px;
    border: 1px solid #aaa;
    border-radius: 3px;
    background-color: #fff;
    background-image: url(${allSelect});
    background-size: 60%;
    background-repeat: no-repeat;
    background-position: center;
    outline: none;
`
const RadioButton = styled.input`
    display: none;
`
const RadioMark = styled.span`
    width: 13px;
    height: 13px;
    cursor: pointer;
    border: 1px solid #bbb;
    border-radius:8px;
    background-color: white;
    display: block;
    margin-top: 2px;
    

    ${RadioButton}:checked + &{
        background-color: #fff;
        background-image: url(${radioCheck});
        background-size: 65%;
        background-repeat: no-repeat;
        background-position: center;
    }
`

function MailReceive() {
    const [checked, setChecked] = useState("");
    const [boxChecked, setBoxChecked] = useState([]);
    const [data, setData] = useState({ receiveMailList: [] });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const query = useQuery();
    const memId = query.get("memId");
    const user = getUserSession();
    const [pageMaker, setPageMaker] = useState({
        page: 1,
        perPageNum: 3,
        displayPageNum: 10,
        totalCount: 0,
        startPage: 1,
        endPage: 1,
        realEndPage: 1,
        prev: false,
        next: false
    });
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToastStore();

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }


    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const yy = String(date.getFullYear()).slice(-2); // 연도 뒤 2자리
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월 0~11이므로 +1
        const dd = String(date.getDate()).padStart(2, '0'); // 일
        return `${yy}-${mm}-${dd}`;
    };

    const filteredList = data?.receiveMailList?.filter(rml => {
        const matchesSearch =
            rml.mail_name.includes(searchTerm) ||      // 제목 검색
            rml.sender_name.includes(searchTerm) ||   // 보낸 사람 검색
            rml.mail_sender.includes(searchTerm);     // 이메일 주소 검색

        if (!matchesSearch) return false;

        if (checked === "") return true;
        if (checked === "read") return rml.mail_rread === 0;
        if (checked === "imp") return rml.mail_rimp == 1;
        if (checked === "lock") return rml.mail_rlock == 1;
        return true;
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get("page")) || 1;
        const keyword = params.get("keyword") || "";
        const filter = params.get("filter") || "";

        setChecked(filter);
        setSearchTerm(keyword);

        getMailReceiveList(page, filter, keyword);
    }, [location.search])

    async function getMailReceiveList(page = 1, filter = "", keyword = "") {

        try {
            let response = await getMailReceive(page, filter, keyword);
            const resData = response.data;
            setData(resData);
            console.log(response);
            setPageMaker(resData.pageMaker);
            setLoading(false);
        } catch (e) {
            console.log(e);
            alert("데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.")
        }
    }


    //url 파라미터
    const handlePageChange = (newPage) => {
        if (!pageMaker) return;
        if (newPage < 1 || newPage > pageMaker.realEndPage) return;
        const params = new URLSearchParams(location.search);
        const filter = params.get("filter") || "";
        const keyword = params.get("keyword") || "";

        params.set("memId", user.mem_id);
        params.set("page", newPage);
        params.set("keyword", keyword);
        params.set("perPageNum", 10);
        params.set("filter", filter);

        navigate(`${location.pathname}?${params.toString()}`);
    }


    // 서치바
    const handleSearch = (keyword) => {
        setSearchTerm(keyword);
        const params = new URLSearchParams(location.search);
        params.set("keyword", keyword);

        navigate(`${location.pathname}?${params.toString()}`);
    }

    // 라디오 버튼 필터
    const handleFilterChange = (newFilter) => {
        const params = new URLSearchParams(location.search);
        params.set("page", 1); // 필터 바꾸면 1페이지로
        params.set("filter", newFilter);

        navigate(`${location.pathname}?${params.toString()}`);
        // getMailReceiveList는 useEffect에서 호출
        setChecked(newFilter);
    };

    // 초기화
    const handleReset = () => {
        const params = new URLSearchParams();
        params.set("page", 1);       // 1페이지로
        params.set("filter", "");    // 필터 초기화
        params.set("keyword", "")

        navigate(`/mail/receive?memId=${user.mem_id}`); // URL 초기화

        setChecked("");               // 라디오 버튼 초기화
        setBoxChecked([]);            // 선택된 체크박스 초기화
        getMailReceiveList(1);        // 데이터 다시 불러오기
        setSearchTerm("");
    };

    // 체크박스 선택
    const handleCheckboxChange = (e) => {
        const value = parseInt(e.target.value, 10);

        if (boxChecked.includes(value)) {
            setBoxChecked(boxChecked.filter((v) => v != value));
        } else {
            setBoxChecked([...boxChecked, value])
        }
    }


    // 체크박스 전체 선택 
    const handleSelectAll = () => {
        if (!data?.receiveMailList) return;

        if (boxChecked.length === data.receiveMailList.length) {
            setBoxChecked([]);
        } else {
            const allIds = data.receiveMailList.map((rml) => rml.mail_id);
            setBoxChecked(allIds);
        }
    }

    // 잠금 토글
    const handleToggleLock = async (mail_id) => {
        // 1. 클라이언트에서 즉시 UI 변경
        setData(prev => {
            const updated = { ...prev };
            updated.receiveMailList = updated.receiveMailList.map(mail =>
                mail.mail_id === mail_id ? { ...mail, mail_rlock: mail.mail_rlock === 0 ? 1 : 0 } : mail);
            return updated;
        });

        try {
            const res = await updateMailReceiveLockToggle(mail_id);

            if (!res.data.success) {
                // 실패 시 롤백
                setData(prev => {
                    const updated = { ...prev };
                    updated.receiveMailList = updated.receiveMailList.map(mail =>
                        mail.mail_id === mail_id ? { ...mail, mail_rlock: mail.mail_rlock === 0 ? 1 : 0 } : mail);
                    return updated;
                });
            }
        } catch (e) {
            console.error(e);
            // 실패 시 롤백
            setData(prev => {
                const updated = { ...prev };
                updated.receiveMailList = updated.receiveMailList.map(mail =>
                    mail.mail_id === mail_id ? { ...mail, mail_rlock: mail.mail_rlock === 0 ? 1 : 0 } : mail);
                return updated;
            });
        }
    };


    // 중요 토글
    const handleToggleImp = async (mail_id) => {
        // 1. 클라이언트에서 즉시 UI 변경
        setData(prev => {
            const updated = { ...prev };
            updated.receiveMailList = updated.receiveMailList.map(mail =>
                mail.mail_id === mail_id ? { ...mail, mail_rimp: mail.mail_rimp === 0 ? 1 : 0 } : mail);
            return updated;
        });

        try {
            const res = await updateMailReceiveImpToggle(mail_id);

            if (!res.data.success) {
                // 실패 시 롤백
                setData(prev => {
                    const updated = { ...prev };
                    updated.receiveMailList = updated.receiveMailList.map(mail =>
                        mail.mail_id === mail_id ? { ...mail, mail_rimp: mail.mail_rimp === 0 ? 1 : 0 } : mail);
                    return updated;
                });
            }
        } catch (e) {
            console.error(e);
            // 실패 시 롤백
            setData(prev => {
                const updated = { ...prev };
                updated.receiveMailList = updated.receiveMailList.map(mail =>
                    mail.mail_id === mail_id ? { ...mail, mail_rimp: mail.mail_rimp === 0 ? 1 : 0 } : mail);
                return updated;
            });
        }
    };

    // 휴지통 보내기
    const handleWaste = async () => {

        if (boxChecked.length === 0) {
            showToast("메일을 선택하세요");
            return;
        }

        const mailsToDelete = data.receiveMailList
            .filter(mail => boxChecked.includes(mail.mail_id) && mail.mail_rlock === 0)
            .map(mail => mail.mail_id);

        if (mailsToDelete.length === 0) {
            showToast("잠긴 메일은 삭제할 수 없습니다.");
            setBoxChecked([]);
            return;
        }

        try {
            const mailIdStr = mailsToDelete.join(",");
            const res = await updateMailWaste(mailIdStr);

            if (res.data.success) {
                showToast("휴지통으로 이동했습니다.");
                // 실패 시 롤백
                setBoxChecked([]);

                // 현재 페이지, 필터, 검색어를 유지하며 다시 조회
                const params = new URLSearchParams(location.search);
                const page = parseInt(params.get("page")) || 1;
                const filter = params.get("filter") || "";
                const keyword = params.get("keyword") || "";

                getMailReceiveList(page, filter, keyword);
            } else {
                showToast("휴지통으로 이동을 실패했습니다.");
            }
        } catch (e) {
            console.error(e);
            showToast("에러가 발생했습니다.");
        }
    };

    return (
        <>
            <div style={{ backgroundColor: "#f7f7f7", minHeight: '100vh' }}>
                <ListHeader style={{ height: '97px', padding: '13px 25px' }}>
                    <FlexDiv style={{ justifyContent: 'center' }}>
                        <SearchBar style={{ marginTop: '3px', marginLeft: '0px', width: '378px', justifyContent: 'flex-start' }}>
                            <img src={searchIcon} style={{ width: '15px', height: '16px', marginBottom: "8px" }}></img>
                            <SearchText placeholder='검색어를 입력해 주세요.' style={{ width: '310px' }} value={searchTerm} onChange={(e) => handleSearch(e.target.value)}></SearchText>
                        </SearchBar>
                    </FlexDiv>
                    <FlexDiv style={{ marginTop: '10px' }}>
                        <FlexDiv style={{ width: '150px', justifyContent: 'start', gap: '8px' }}>
                            <BoxButton type='button' style={{ cursor: 'pointer' }} onClick={handleSelectAll}></BoxButton>
                            <BoxButton type='button' style={{ backgroundImage: `url(${trash})`, cursor: 'pointer' }} onClick={handleWaste}></BoxButton>
                            <BoxButton type='button' style={{ backgroundImage: `url(${replace})`, cursor: 'pointer' }} onClick={handleReset}></BoxButton>
                        </FlexDiv>
                        <FlexDiv style={{ width: '307px', justifyContent: 'end', marginTop: '3px' }}>
                            <label style={{ display: 'flex', marginRight: '10px' }}>
                                <RadioButton type='radio' name="mail" value="unread" checked={checked === "unread"} onChange={(e) => handleFilterChange("unread")} />
                                <RadioMark />
                                <CheckText style={{ display: 'block', color: '#707070', marginBottom: '5px' }}>안 읽은 메일</CheckText>
                            </label>
                            <label style={{ display: 'flex', marginRight: '10px' }}>
                                <RadioButton type='radio' name="mail" value="imp" checked={checked === "imp"} onChange={(e) => handleFilterChange("imp")} />
                                <RadioMark />
                                <CheckText style={{ color: '#707070' }}>중요 메일</CheckText>
                            </label>
                            <label style={{ display: 'flex' }}>
                                <RadioButton type='radio' name="mail" value="lock" checked={checked === "lock"} onChange={(e) => handleFilterChange("lock")} />
                                <RadioMark />
                                <CheckText style={{ color: '#707070' }}>잠긴 메일</CheckText>
                            </label>
                        </FlexDiv>
                    </FlexDiv>
                </ListHeader>

                <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                    {loading ? null : (
                        filteredList.length === 0 ? (
                            <div style={{ height: '100%', textAlign: "center", color: "#ccc", lineHeight: '500px', fontSize: '25px', fontWeight: '600' }}>
                                받은 메일함이 비었습니다
                            </div>
                        ) : (
                            filteredList.map((rml) =>

                                <MailContainer key={rml.mail_id} unread={rml.mail_rread === 0}>
                                    <MailView>
                                        <img src={rml.mail_rlock === 0 ? unLock : lock} style={{ height: '20px', marginTop: '8px', cursor: 'pointer' }} onClick={() => handleToggleLock(rml.mail_id)}></img>
                                    </MailView>
                                    <FlexDiv>
                                        <label style={{ display: "flex", justifyContent: 'end', marginLeft: '10px' }}>
                                            <CheckBox type='checkbox' name="check" value={rml.mail_id} checked={boxChecked.includes(rml.mail_id)} onChange={handleCheckboxChange} />
                                            <CheckMark />
                                        </label>
                                        <div style={{ width: '240px' }}>
                                            <Link to={`/mail/detail/${rml.mail_id}?memId=${user.mem_id}`}>
                                                <FlexDiv>
                                                    <MailTitle style={{ marginLeft: '10px', marginTop: '-2px' }} unread={rml.mail_rread === 0}>{rml.sender_name}</MailTitle>
                                                    <DateBox style={{ marginLeft: '10px' }}>{rml.mail_sender}</DateBox>
                                                </FlexDiv>
                                                <FlexDiv>
                                                    <MailTitle style={{ maxWidth: '223px', marginLeft: '10px', marginTop: '3px', fontWeight: '400' }} unread={rml.mail_rread === 0}>
                                                        {rml.mail_name}
                                                    </MailTitle>
                                                    {rml.mailFileList.length > 0 && (
                                                        <img src={clip} style={{ width: '13px', height: '13px', marginLeft: '7px', marginTop: '7px' }} alt="첨부파일" />
                                                    )}
                                                </FlexDiv>
                                            </Link>
                                        </div>
                                    </FlexDiv>
                                    <div style={{ marginLeft: 'auto', marginTop: '-2px' }}>
                                        <DateBox>{formatDate(rml.mail_rdate)}</DateBox>
                                        <div>
                                            <img src={rml.mail_rimp === 0 ? unImp : imp} style={{ width: '18px', height: '18px', marginLeft: '32px', cursor: 'pointer' }} onClick={() => handleToggleImp(rml.mail_id)}></img>
                                        </div>
                                    </div>
                                </MailContainer>

                            ))
                    )
                    }
                </div>

                {pageMaker && filteredList.length > 0 && (
                    <nav>
                        <PageNation>
                            {/* 처음 페이지 */}
                            <PageArrowButton disabled={pageMaker.page === 1} onClick={() => handlePageChange(1)}>
                                <PageText>
                                    <img src={pageArrow1} style={{ width: "13px", height: "10px", marginLeft: '6px' }} alt="first" />
                                </PageText>
                            </PageArrowButton>

                            {/* 이전 블록 */}
                            <PageArrowButton disabled={!pageMaker.prev} onClick={() => handlePageChange(pageMaker.startPage - 1)}>
                                <PageText>
                                    <img src={pageArrow2} style={{ width: "6px", height: "10px", marginLeft: '10px' }} alt="prev-block" />
                                </PageText>
                            </PageArrowButton>

                            {/* 페이지 번호 */}
                            {Array.from({ length: pageMaker.endPage - pageMaker.startPage + 1 }, (_, i) => {
                                const page = pageMaker.startPage + i;
                                if (page > pageMaker.realEndPage) return null; // 존재하지 않는 페이지는 렌더링 안함
                                return (
                                    <PageNumberButton key={page} active={page === pageMaker.page} onClick={() => handlePageChange(page)}>
                                        <PageNumText key={page} active={page === pageMaker.page} style={{ fontWeight: page === pageMaker.page ? 'bold' : 'normal' }}>
                                            {page}
                                        </PageNumText>
                                    </PageNumberButton>
                                );
                            })}

                            {/* 다음 블록 */}
                            <PageArrowButton disabled={!pageMaker.next} onClick={() => handlePageChange(pageMaker.endPage + 1)}>
                                <PageText>
                                    <img src={pageArrow3} style={{ width: "6px", height: "10px", marginLeft: '10px' }} alt="next-block" />
                                </PageText>
                            </PageArrowButton>

                            {/* 마지막 페이지 */}
                            <PageArrowButton disabled={pageMaker.page === pageMaker.realEndPage} onClick={() => handlePageChange(pageMaker.realEndPage)}>
                                <PageText>
                                    <img src={pageArrow4} style={{ width: "13px", height: "10px", marginLeft: '6px' }} alt="last" />
                                </PageText>
                            </PageArrowButton>
                        </PageNation>
                    </nav>
                )}
            </div >
        </>
    )
}

export default MailReceive