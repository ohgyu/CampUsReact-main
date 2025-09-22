import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Hr } from '../menu/SideMenu';
import { go } from '../img';
import { getHomeWrapperStu } from '../api';
import { useLocation } from 'react-router-dom';

export const Container = styled.div`
    margin: 0 auto;
    padding: 4px 21px 20px 21px;
    background-color: #f7f7f7;
    height: 100%;
    min-height: 100vh; 
`
export const ContentBox = styled.div`
    width: 100%;
    height: 209px;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 5px;
    &:last-child {
    margin-bottom: 0; 
  }
`
export const Header = styled.div`
    width: 100%;
    height: 48px;
    padding: 13px 21px 17px 21px;
 
    display: flex;
`
export const HeadText = styled.h3`
    font-size: 18px;
    font-weight: bold;
    line-height: 29px;
`
export const Contents = styled.div`
    padding: 19px 24px 0 24px; 
`
export const Content = styled.div`
    width: 100%;
    height: 11px;
    display: flex;
`
export const CirCle = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 8px;
    background-color: #2ec4b6;
    margin-top: 2px;
`
export const Days = styled.div`
    width: 52px;
    height: 14px;
    margin-left: 18px;
`
export const Day = styled.h3`
    color: #ef4141;
    font-size: 13px;
    font-weight: 700;
`
export const LecText = styled.h3`
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
    color: #212121;
`
export const Times = styled.div`
    width: 68px;
    height: 14px;
`
export const Lecture = styled.div`
    height: 14px;
`
export const IconBox = styled.div`
    width: 20px;
    height: 20px;
    margin-left: auto;
    line-height: 23px;
`
const Gauge = styled.div`
    border-radius: 8px;
    width: 335px;
    height: 20px;
    background-color: #d9d9d9;
    margin-bottom: -2px;
`
const Status = styled.div`
    width: 3px;
    height: 36px;
    background-color: #2ec4b6;
`
function HomeWrapper() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    const query = useQuery();
    const memId = query.get("memId");
    useEffect(() => {
        getDashBoard();
    }, [])

    async function getDashBoard() {
        try {
            let response = await getHomeWrapperStu();
            setData(response.data);
            console.log(response);
            setLoading(false);
        } catch (e) {
            console.log(e);
            alert("데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.")
        }
    }

    return (
        <Container>
            <ContentBox style={{ marginTop: '15px' }}>
                <Header>
                    <HeadText>예정 강의</HeadText>
                </Header>
                <Hr style={{ margin: '0 auto', width: '344px' }}></Hr>
                <Contents style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', height: '140px', width: '370px' }}>
                    {loading ? (<p>로딩 중...</p>) : (
                        data?.comingleclist?.map((cl, idx) =>
                            <Content key={idx}>
                                <CirCle style={{ backgroundColor: cl.d_day === 0 ? undefined : "#aaa" }}></CirCle>
                                <Days style={{ marginLeft: '15px' }}>
                                    <Day style={{ color: cl.d_day === 0 ? undefined : "#777" }}>
                                        {cl.d_day === 0 ? "D - Day" : `D - ${cl.d_day}`}
                                    </Day>
                                </Days>
                                <Lecture style={{ marginLeft: '10px', width: '160px', textAlign: 'center' }}>
                                    <LecText style={{ color: cl.d_day === 0 ? undefined : "#777" }}>
                                        {cl.lec_name}
                                    </LecText>
                                </Lecture>
                                <Lecture style={{ marginLeft: 'auto', marginRight: '10px' }}>
                                    <LecText style={{ color: cl.d_day === 0 ? undefined : "#777" }}>
                                        {cl.mem_name}
                                    </LecText>
                                </Lecture>
                            </Content>
                        ))
                    }
                </Contents>
            </ContentBox>

            <ContentBox style={{ height: '247px' }}>
                <Header>
                    <HeadText>
                        금주의 출결
                    </HeadText>
                </Header>
                <Hr style={{ margin: '0 auto', width: '344px' }}></Hr>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '17px', marginBottom: '21px' }}>
                    {loading ? (<p>로딩 중...</p>) : (
                        data?.attendencePercent?.map((ap, idx) =>
                            <Gauge key={idx} style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
                                <Gauge style={{ width: `${ap.rate_ok}%`, backgroundColor: '#43CABE', borderRadius: '0px', textAlign: 'center', lineHeight: '22px', fontSize: '13px' }}>{ap.rate_ok}%</Gauge>
                                <Gauge style={{ width: `${ap.rate_late}%`, backgroundColor: '#FFE99A', borderRadius: '0px', textAlign: 'center', lineHeight: '22px', fontSize: '13px' }}>{ap.rate_late}%</Gauge>
                                <Gauge style={{ width: `${ap.rate_no}%`, backgroundColor: '#EF7C7C', borderRadius: '0px', textAlign: 'center', lineHeight: '22px', fontSize: '13px' }}>{ap.rate_no}%</Gauge>
                                <Gauge style={{ width: `${ap.rate_none}%`, backgroundColor: '#D9D9D9', borderRadius: '0px', textAlign: 'center', lineHeight: '22px', fontSize: '13px' }}></Gauge>
                            </Gauge>
                        ))
                    }
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', height: '130px', padding: '0 30px' }}>
                    {loading ? (<p>로딩 중...</p>) : (
                        data?.attendenceList?.map((al, idx) =>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} key={idx}>
                                <div style={{ textAlign: 'left', width: '120px' }}>
                                    <LecText style={{ fontWeight: '500' }}>{al.classDateStr}</LecText>
                                </div>
                                <div style={{ textAlign: 'center', width: '190px' }}>
                                    <LecText>{al.subjectName}</LecText>
                                </div>
                                <div style={{ textAlign: 'left', width: '90px' }}>
                                    <LecText>{al.professorName}</LecText>
                                </div>
                                <div>
                                    <CirCle style={{
                                        width: '16px', height: '16px', marginTop: '-7px',
                                        backgroundColor: al.attendanceStatus === "출석" ? undefined :
                                            al.attendanceStatus === "지각" ? "#FFE99A" :
                                                al.attendanceStatus === "결석" ? "#EF7C7C" : "#D9D9D9"
                                    }}>

                                    </CirCle>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </ContentBox>
            <ContentBox style={{ height: '288px' }}>
                <Header>
                    <HeadText>
                        미제출 과제
                    </HeadText>
                </Header>
                <Hr style={{ margin: '0 auto', width: '344px' }}></Hr>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', height: '200px', padding: '0 25px', marginTop: '15px' }}>
                    {loading ? (<p>로딩 중...</p>) : (
                        data?.unsubmithwList?.map((ul, idx) =>
                            <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                                <Status style={{ backgroundColor: ul.d_day === 0 ? undefined : "#aaa" }}></Status>
                                <Day style={{ margin: 0, width: '73px', textAlign: 'center', color: ul.d_day === 0 ? undefined : "#777" }}>
                                    {ul.d_day === 0 ? "D - Day" : `D - ${ul.d_day}`}
                                </Day>
                                <div style={{ margin: 0 }}>
                                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                        {ul.hw_name}
                                    </span>
                                    <LecText style={{ fontSize: '12px', color: '#aaa', margin: 0 }}>
                                        {ul.lec_name}
                                    </LecText>
                                </div>
                                <div style={{ width: '71px', marginLeft: 'auto' }}>
                                    <LecText style={{ fontSize: '12px', color: '#aaa', textAlign: 'right', margin: 0 }}>{ul.hw_enddateStr}</LecText>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </ContentBox>
        </Container>

    )
}

export default HomeWrapper