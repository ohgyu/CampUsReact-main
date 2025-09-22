import React, { useEffect, useState } from 'react'
import MailNavBar from './MailNavBar'
import { Container } from '../topNav/TopNav'
import {
    searchIcon, pageArrow1, pageArrow2, pageArrow3,
    pageArrow4, allSelect, radioCheck, replace, read, unRead, unImp, imp,
    unLock, lock, Cancle,
    clip
} from '../img'
import {
    ListHeader, FlexDiv, SearchBar, SearchText,
    DateBox, Title, Button,
    PageNation, PageArrowButton, PageNumText, PageNumberButton, PageText,
    WHContainer, RegistButton,
    CheckBox, CheckMark
}
    from '../commons/WHComponent'
import { GrayHr } from '../home/HomeWrapperPro'
import styled from 'styled-components'
import { deleteMail, deleteMailAll, getMailWaste, getUserSession, updateMailWasteBack } from '../api'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Toast from '../commons/Toast'
import useModalStore, { useToastStore } from '../commons/modalStore'
import ConfirmModal from '../commons/ConfirmModal'

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

function MailWaste() {
    const [checked, setChecked] = useState("");
    const [boxChecked, setBoxChecked] = useState([]);
    const [data, setData] = useState({ wasteList: [] });
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

    // 필터
    const filteredList = data?.wasteList?.filter(wl => {
        const matchesSearch =
            wl.mail_name.includes(searchTerm) ||      // 제목 검색
            wl.sender_name.includes(searchTerm) ||   // 보낸 사람 검색
            wl.receiver_name.includes(searchTerm) ||   // 보낸 사람 검색
            wl.mail_sender.includes(searchTerm) ||   // 보낸 사람 검색
            wl.mail_receiver.includes(searchTerm);     // 이메일 주소 검색

        if (!matchesSearch) return false;
        return true;
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get("page")) || 1;
        const keyword = params.get("keyword") || "";

        setSearchTerm(keyword);

        getMailWasteList(page, keyword);
    }, [location.search])

    async function getMailWasteList(page = 1, keyword = "") {

        try {
            let response = await getMailWaste(page, keyword);
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
        const keyword = params.get("keyword") || "";

        params.set("memId", user.mem_id);
        params.set("page", newPage);
        params.set("keyword", keyword);
        params.set("perPageNum", 10);

        navigate(`${location.pathname}?${params.toString()}`);
    }

    // 서치바
    const handleSearch = (keyword) => {
        setSearchTerm(keyword);
        const params = new URLSearchParams(location.search);
        params.set("keyword", keyword);

        navigate(`${location.pathname}?${params.toString()}`);
    }

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
        if (!data?.wasteList) return;

        if (boxChecked.length === data.wasteList.length) {
            setBoxChecked([]);
        } else {
            const allIds = data.wasteList.map((rml) => rml.mail_id);
            setBoxChecked(allIds);
        }
    }

    // 초기화
    const handleReset = () => {
        const params = new URLSearchParams();
        params.set("page", 1);       // 1페이지로
        params.set("keyword", "")

        navigate(`/mail/waste?memId=${user.mem_id}`); // URL 초기화

        setBoxChecked([]);            // 선택된 체크박스 초기화
        getMailWasteList(1);        // 데이터 다시 불러오기
        setSearchTerm("");
    };

    // 복구
    const handleWasteBack = async () => {

        if (boxChecked.length === 0) {
            showToast("메일을 선택하세요.");
            return;
        }

        const mailsToRecover = data.wasteList
            .filter(mail => boxChecked.includes(mail.mail_id))
            .map(mail => mail.mail_id);

        if (mailsToRecover.length === 0) {
            showToast("메일을 선택해주세요");
            setBoxChecked([]);
            return;
        }

        try {
            const mailIdStr = mailsToRecover.join(",");
            const res = await updateMailWasteBack(mailIdStr);

            if (res.data.success) {
                showToast("메일을 복구했습니다.");
                // 실패 시 롤백
                setBoxChecked([]);

                // 현재 페이지, 필터, 검색어를 유지하며 다시 조회
                const params = new URLSearchParams(location.search);
                const page = parseInt(params.get("page")) || 1;
                const keyword = params.get("keyword") || "";

                getMailWasteList(page, keyword);
            } else {
                showToast("복구를 실패했습니다.");
            }
        } catch (e) {
            console.error(e);
            showToast("에러가 발생했습니다.");
        }
    };

    // 삭제
    const handleDelete = async () => {

        if (boxChecked.length === 0) {
            showToast("메일을 선택하세요.");
            return;
        }

        const mailsToDelete = data.wasteList
            .filter(mail => boxChecked.includes(mail.mail_id))
            .map(mail => mail.mail_id);

        if (mailsToDelete.length === 0) {
            showToast("메일을 선택해주세요");
            setBoxChecked([]);
            return;
        }

        useModalStore.getState().showConfirm(
            "복구가 불가능합니다. 정말로 삭제하시겠습니까?",
            async () => {

                try {
                    const mailIdStr = mailsToDelete.join(",");
                    const res = await deleteMail(mailIdStr);

                    if (res.data.success) {
                        showToast("메일을 삭제했습니다.");
                        // 실패 시 롤백
                        setBoxChecked([]);

                        // 현재 페이지, 필터, 검색어를 유지하며 다시 조회
                        const params = new URLSearchParams(location.search);
                        const page = parseInt(params.get("page")) || 1;
                        const keyword = params.get("keyword") || "";

                        getMailWasteList(page, keyword);
                    } else {
                        showToast("삭제를 실패했습니다.");
                    }
                } catch (e) {
                    console.error(e);
                    showToast("에러가 발생했습니다.");
                }
            }
        );
    };

    // 비우기 (전체 삭제)
    const handleDeleteAll = async () => {

        useModalStore.getState().showConfirm(
            "모든 메일이 삭제됩니다. 정말 비우시겠습니까?",
            async () => {

                try {
                    const res = await deleteMailAll();

                    if (res.data.success) {
                        showToast("휴지통을 비웠습니다.");
                        // 실패 시 롤백
                        setBoxChecked([]);

                        // 현재 페이지, 필터, 검색어를 유지하며 다시 조회
                        const params = new URLSearchParams(location.search);
                        const page = parseInt(params.get("page")) || 1;
                        const keyword = params.get("keyword") || "";

                        getMailWasteList(page, keyword);
                    } else {
                        showToast("비우기를 실패했습니다.");
                    }
                } catch (e) {
                    console.error(e);
                    showToast("에러가 발생했습니다.");
                }
            }
        );
    };

    return (
        <>
            <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#f7f7f7" }}>
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
                            <BoxButton style={{ backgroundImage: `url(${replace})`, cursor: 'pointer' }} onClick={handleReset}></BoxButton>
                        </FlexDiv>
                        <FlexDiv style={{ width: '340px', justifyContent: 'end', marginTop: '-2px' }}>
                            <Button style={{ marginTop: '2px', fontSize: '13px', height: '24px', marginLeft: '0', backgroundColor: '#fff', border: '1px solid #aaa', color: '#212121', width: '40px' }} onClick={handleWasteBack}>복구</Button>
                            <Button style={{ marginTop: '2px', height: '24px', marginLeft: '10px', backgroundColor: '#fff', border: '1px solid #aaa', color: '#212121', width: '60px' }} onClick={handleDelete}>영구삭제</Button>
                            <Button style={{ marginTop: '2px', height: '24px', marginLeft: '10px', backgroundColor: '#fff', border: '1px solid #aaa', color: '#212121', width: '50px' }} onClick={handleDeleteAll}>비우기</Button>
                        </FlexDiv>
                    </FlexDiv>
                </ListHeader>

                <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                    {loading ? null : (
                        filteredList.length === 0 ? (
                            <div style={{ height: '100%', textAlign: "center", color: "#ccc", lineHeight: '500px', fontSize: '25px', fontWeight: '600' }}>
                                휴지통이 비었습니다
                            </div>
                        ) : (
                            filteredList.map((wl) =>
                                <MailContainer key={wl.mail_id} unread={(wl.mail_rread === 0) && (wl.mail_sread === 0)}>
                                    <div>
                                        <FlexDiv>
                                            <label style={{ display: "flex", justifyContent: 'end' }}>
                                                <CheckBox type='checkbox' name="check" value={wl.mail_id} checked={boxChecked.includes(wl.mail_id)} onChange={handleCheckboxChange} />
                                                <CheckMark />
                                            </label>
                                            <div style={{ width: '270px' }}>
                                                <Link to={`/mail/detail/wasted/${wl.mail_id}?memId=${user.mem_id}`} >
                                                    <FlexDiv>
                                                        <Title style={{ marginLeft: '10px', marginTop: '-2px' }}>{wl.mail_sender === user.mem_id ? wl.receiver_name : wl.sender_name}</Title>
                                                        <DateBox style={{ marginLeft: '10px' }}>{wl.mail_sender === user.mem_id ? wl.mail_receiver : wl.mail_sender}</DateBox>
                                                    </FlexDiv>
                                                    <FlexDiv>
                                                        <Title style={{ maxWidth: '223px', marginLeft: '10px', marginTop: '3px', fontWeight: '400' }}>{wl.mail_name}</Title>
                                                        {wl.mailFileList.length > 0 && (
                                                            <img src={clip} style={{ width: '13px', height: '13px', marginLeft: '7px', marginTop: '7px' }} alt="첨부파일" />
                                                        )}
                                                    </FlexDiv>
                                                </Link>
                                            </div>
                                        </FlexDiv>
                                    </div>
                                    <div style={{ marginLeft: 'auto', marginTop: '-2px' }}>
                                        <DateBox>{formatDate(wl.mail_ddate)}</DateBox>
                                        <DateBox style={{ marginTop: '5px' }}>{wl.mail_sender === user.mem_id ? "[받은 메일]" : "[보낸 메일]"}</DateBox>
                                    </div>
                                </MailContainer>
                            )
                        )
                    )}
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
            </div>
            <ConfirmModal />
        </>
    )
}

export default MailWaste