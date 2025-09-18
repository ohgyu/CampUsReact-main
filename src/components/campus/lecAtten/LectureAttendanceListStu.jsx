import React from 'react'
import styled from 'styled-components'
import { pageArrow1, pageArrow2, pageArrow3, pageArrow4 } from '../img'
import { 
    ListHeader, CatTitle, FlexDiv,
    WHContainer, DateBox, Title, Button, NumberContainer,
    AttenBox, AttenText, AttenChangeIng, AttenChange, AttenPass,
    PageNation, PageArrowButton, PageNumText, PageNumberButton, PageText }
    from '../commons/WHComponent'
import { useNavigate } from "react-router-dom";
import { useAttendanceChangeStore, useAttendanceModalStore } from "../commons/modalStore";

const AttenDate = styled.div`
    font-size: 12px;
    text-align: center;
    margin-top: 3.2px;
`
const NumberInput = styled.input`
    width: 319px;
    height: 37px;
    border: 2px solid #2EC4B6;
    border-radius: 0px;
    outline: none;
    text-align: center;
    font-size: 14px;
    margin-left: 23px;
    margin-top: 12px;
`


function LectureAttendanceList() {
    const navigate = useNavigate();
    const { viewModal } = useAttendanceModalStore();
    const { show } = useAttendanceChangeStore();

  return (
    <>
        <div style={{width:"100%", minHeight:"731px", backgroundColor:"#f7f7f7"}}>
            <ListHeader style={{height:'56px'}}>
                <FlexDiv>
                    <CatTitle>출결</CatTitle>
                </FlexDiv>
            </ListHeader>
            <NumberContainer>
                <Title style={{textAlign:'center', marginTop:'13px'}}>09-26 7주차 출석</Title>
                <NumberInput placeholder='숫자를 입력해주세요'></NumberInput>
                <Button style={{width:'84px', height:'30px', lineHeight:'20px', marginLeft:'142px', marginTop:'10px'}}>출석하기</Button>
            </NumberContainer>
            <WHContainer style={{height:'76px'}}>
                <div>
                    <FlexDiv>
                        <Title>6주차</Title>
                        <DateBox style={{marginLeft:'10px', marginTop:'1px'}}>(09-22 ~ 09-26)</DateBox>
                    </FlexDiv>
                </div>
                <AttenBox>
                    <AttenDate>09-22 (월)</AttenDate>
                    <AttenText>출석</AttenText>
                </AttenBox>
                <AttenBox>
                    <AttenDate>09-24 (수)</AttenDate>
                    <AttenText>출석</AttenText>
                </AttenBox>
            </WHContainer>
            <WHContainer style={{height:'76px'}}>
                <div>
                    <FlexDiv>
                        <Title>5주차</Title>
                        <DateBox style={{marginLeft:'10px', marginTop:'1px'}}>(09-15 ~ 09-19)</DateBox>
                    </FlexDiv>
                </div>
                <AttenBox>
                    <AttenDate>09-15 (월)</AttenDate>
                    <AttenText>출석</AttenText>
                </AttenBox>
                <AttenBox>
                    <AttenDate>03-17 (수)</AttenDate>
                    <AttenText>출석</AttenText>
                </AttenBox>
            </WHContainer>
            <WHContainer style={{height:'76px'}}>
                <div>
                    <FlexDiv>
                        <Title>4주차</Title>
                        <DateBox style={{marginLeft:'10px', marginTop:'1px'}}>(09-08 ~ 09-12)</DateBox>
                    </FlexDiv>
                    <AttenChange onClick={() => show()}>이의신청</AttenChange>
                </div>
                <AttenBox>
                    <AttenDate>09-08 (월)</AttenDate>
                    <AttenText>출석</AttenText>
                </AttenBox>
                <AttenBox style={{backgroundColor:'#FFF2B7'}}>
                    <AttenDate>09-10 (수)</AttenDate>
                    <AttenText>지각</AttenText>
                </AttenBox>
            </WHContainer>
            <WHContainer style={{height:'76px'}}>
                <div>
                    <FlexDiv>
                        <Title>3주차</Title>
                        <DateBox style={{marginLeft:'10px', marginTop:'1px'}}>(09-01 ~ 09-05)</DateBox>
                    </FlexDiv>
                </div>
                <AttenBox>
                    <AttenDate>09-01 (월)</AttenDate>
                    <AttenText>출석</AttenText>
                </AttenBox>
                <AttenBox>
                    <AttenDate>09-03 (수)</AttenDate>
                    <AttenText>출석</AttenText>
                </AttenBox>
            </WHContainer>
            <WHContainer style={{height:'76px'}}>
                <div>
                    <FlexDiv>
                        <Title>2주차</Title>
                        <DateBox style={{marginLeft:'10px', marginTop:'1px'}}>(08-25 ~ 08-29)</DateBox>
                    </FlexDiv>
                    <FlexDiv>
                        <AttenChange onClick={() => show()}>이의신청</AttenChange>
                        <AttenPass onClick={() => viewModal("이의 신청이 반려되었습니다.")}/>
                    </FlexDiv>
                </div>
                <AttenBox style={{backgroundColor:'#FFB8B8'}}>
                    <AttenDate>08-25 (월)</AttenDate>
                    <AttenText>결석</AttenText>
                </AttenBox>
                <AttenBox>
                    <AttenDate>08-27 (수)</AttenDate>
                    <AttenText>출석</AttenText>
                </AttenBox>
            </WHContainer>
            <WHContainer style={{height:'76px'}}>
                <div>
                    <FlexDiv>
                        <Title>1주차</Title>
                        <DateBox style={{marginLeft:'10px', marginTop:'1px'}}>(08-18 ~ 08-22)</DateBox>
                    </FlexDiv>
                    <AttenChangeIng>대기중</AttenChangeIng>
                </div>
                <AttenBox style={{backgroundColor:'#FFB8B8'}}>
                    <AttenDate>08-18 (월)</AttenDate>
                    <AttenText>결석</AttenText>
                </AttenBox>
                <AttenBox>
                    <AttenDate>08-20 (수)</AttenDate>
                    <AttenText>출석</AttenText>
                </AttenBox>
            </WHContainer>
            <nav>
                <PageNation>
                    <PageArrowButton>
                        <PageText href="#">
                            <img src={pageArrow1} style={{width:"13px", height:"10px", marginLeft:'6px'}}></img>
                        </PageText>
                    </PageArrowButton>
                    <PageArrowButton>
                        <PageText href="#">
                            <img src={pageArrow2} style={{width:"6px", height:"10px", marginLeft:'10px'}}></img>
                        </PageText>
                    </PageArrowButton>
                    <PageNumberButton>
                        <PageNumText href="#">1</PageNumText>
                    </PageNumberButton>
                    <PageArrowButton>
                        <PageText href="#">
                            <img src={pageArrow3} style={{width:"6px", height:"10px", marginLeft:'10px'}}></img>
                        </PageText>
                    </PageArrowButton>
                    <PageArrowButton>
                        <PageText href="#">
                            <img src={pageArrow4} style={{width:"13px", height:"10px", marginLeft:'6px'}}></img>
                        </PageText>
                    </PageArrowButton>
                </PageNation>
            </nav>
        </div>

    </>
  )
}

export default LectureAttendanceList