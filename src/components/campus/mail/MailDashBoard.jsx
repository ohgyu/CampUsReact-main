import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Content, ContentBox, Contents, Header, HeadText, IconBox, LecText } from '../home/HomeWrapper'
import { Flex, GrayHr } from '../home/HomeWrapperPro'
import { Hr } from '../menu/SideMenu'
import { unRead, read, go, Cancle } from '../img'
import { useMailModalStore } from '../commons/modalStore'
import { Button, MailDashBox, RegistButton } from '../commons/WHComponent'
import { Container } from '../topNav/TopNav'
import MailNavBar from './MailNavBar'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { getMailDash, getUserSession } from '../api'

export const MainContainer = styled.div`
  margin: 0 auto;
    padding: 4px 21px 20px 21px;
    background-color: #f7f7f7;
    height: 100%;
`

const MiniIconBox = styled.div`
    width: 22px;
    height: 17px;
    line-height: 20px;
`
const Post = styled.div`
    position: absolute;
    width: 84px;
    height: 84px;
    border-radius: 80px;
    background-color: #2ec4b6;
    bottom: 87px;
    right: 26px;
    display: flex;               
    justify-content: center;      
    align-items: center; 
`
function MailDashBoard() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = getUserSession();

    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    const query = useQuery();
    const memId = query.get("memId");

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const yy = String(date.getFullYear()).slice(-2); // 연도 뒤 2자리
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월 0~11이므로 +1
        const dd = String(date.getDate()).padStart(2, '0'); // 일
        return `${yy}-${mm}-${dd}`;
    };

    useEffect(() => {
        getMailDashBoard();
    }, [])

    async function getMailDashBoard() {
        try {
            let response = await getMailDash();
            setData(response.data);
            console.log(response);
            setLoading(false);
        } catch (e) {
            console.log(e);
            alert("데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.")
        }
    }

    return (
        <>
            <MainContainer>
                <MailDashBox style={{ marginTop: '15px', height: '335px', marginBottom: '0' }}>
                    <Header onClick={() => navigate(`/mail/receive?memId=${user.mem_id}`)}>
                        <HeadText>
                            받은 메일함
                        </HeadText>
                        <IconBox>
                            <img src={go} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </IconBox>
                    </Header>
                    <Hr style={{ margin: '0 auto', width: '344px' }}></Hr>

                    <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '275px', width: '370px' }}>
                        {loading ? (<p>로딩 중...</p>) : (
                            data?.receiveList?.map((rl, idx) =>
                                <Contents key={idx} style={{ marginTop: '-1px' }}>
                                    <Link to={`/mail/detail/${rl.mail_id}?memId=${user.mem_id}`}>
                                        <Content>
                                            <MiniIconBox>
                                                <img src={rl.mail_rread === 0 ? unRead : read} style={{ width: "100%", objectFit: "cover", marginTop: '4px' }} />
                                            </MiniIconBox>
                                            <div style={{ marginLeft: '12px' }}>
                                                <LecText>{rl.sender_name}</LecText>
                                            </div>
                                            <div style={{ marginLeft: '10px' }}>
                                                <LecText style={{ fontSize: '12px', color: '#aaa' }}>{rl.mail_sender}</LecText>
                                            </div>
                                            <div style={{ marginLeft: 'auto' }}>
                                                <LecText style={{ fontSize: '12px', color: '#aaa' }}>{formatDate(rl.mail_rdate)}</LecText>
                                            </div>
                                        </Content>
                                    </Link>
                                    <div style={{ marginLeft: '34px', marginTop: '10px' }}>
                                        <LecText style={{ marginBottom: '10px' }}>{rl.mail_name}</LecText>
                                    </div>
                                    {idx !== data.receiveList.length - 1 && (<GrayHr style={{ margin: '0 auto' }} />)}
                                </Contents>
                            ))
                        }
                    </div>
                </MailDashBox>

                <MailDashBox style={{ marginTop: '20px', height: '335px', marginBottom: '0' }}>
                    <Header onClick={() => navigate(`/mail/send?memId=${user.mem_id}`)}>
                        <HeadText>
                            보낸 메일함
                        </HeadText>
                        <IconBox>
                            <img src={go} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </IconBox>
                    </Header>
                    <Hr style={{ margin: '0 auto', width: '344px' }}></Hr>

                    <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '275px', width: '370px' }}>
                        {loading ? (<p>로딩 중...</p>) : (
                            data?.sendList?.map((sl, idx) =>
                                <Link to={`/mail/detail/${sl.mail_id}?memId=${user.mem_id}`}>
                                    <Contents key={idx} style={{ paddingTop: '13px', height:'60px'}}>
                                        <Content>
                                            <div>
                                                <LecText>{sl.receiver_name}</LecText>
                                            </div>
                                            <div style={{ marginLeft: '10px' }}>
                                                <LecText style={{ fontSize: '12px', color: '#aaa' }}>{sl.mail_receiver}</LecText>
                                            </div>
                                            <div style={{ marginLeft: 'auto' }}>
                                                <LecText style={{ fontSize: '12px', color: '#aaa' }}>{formatDate(sl.mail_sdate)}</LecText>
                                            </div>
                                        </Content>
                                        <div style={{ marginTop: '10px' }}>
                                            <LecText style={{ marginBottom: '10px' }}>{sl.mail_name}</LecText>
                                        </div>
                                        {idx !== data.receiveList.length - 1 && (<GrayHr style={{ margin: '0 auto' }} />)}
                                    </Contents>
                                </Link>
                            ))
                        }
                    </div>
                </MailDashBox>
            </MainContainer>
        </>

    )
}

export default MailDashBoard