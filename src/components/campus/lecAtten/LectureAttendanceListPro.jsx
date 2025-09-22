import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { 
    ListHeader, CatTitle, FlexDiv, Profile,
    WHContainer, DateBox, Title, Button, SearchDrop, DropHeader, DropList, DropOption,
    AttenBox, AttenText, AttenChange, NumberContainer,
    PageNation, PageArrowButton, PageNumText, PageNumberButton, PageText,
    CheckContainer, CheckBox, CheckMark, CheckText }
    from '../commons/WHComponent'
import { dropdownArrow, pageArrow1, pageArrow2, pageArrow3, pageArrow4 } from '../img'
import LectureAttendanceModify from "./LectureAttendanceModify";
import { useAttendanceModifyStore } from '../commons/modalStore';
import profile2 from "../img/profile/2.jfif";
import profile3 from "../img/profile/3.jfif";
import profile4 from "../img/profile/4.jfif";
import profile5 from "../img/profile/5.jfif";
import profile6 from "../img/profile/6.jfif";
import profile7 from "../img/profile/7.jfif";
import profile8 from "../img/profile/8.jfif";
import profile9 from "../img/profile/9.jfif";
import profile10 from "../img/profile/10.jfif";
import profile11 from "../img/profile/11.jfif";
import profile12 from "../img/profile/12.jfif";
import profile13 from "../img/profile/13.jfif";
import profile14 from "../img/profile/14.jfif";
import profile15 from "../img/profile/15.jfif";
import profile19 from "../img/profile/19.jpg";
import profile17 from "../img/profile/17.jfif";
import profile18 from "../img/profile/18.jfif";

const AttenNum = styled.div`
    font-size: 60px;
    font-weight: 700;
    color: #2EC4B6;
    text-align: center;
    line-height: 80px;
`
const Count = styled.div`
    font-size: 20px;
    text-align: center;
`
const Circle = styled.div`
    width: 14px;
    height: 14px;
    background-color: #C2E8B7;
    border-radius: 7px;
    margin-top: 4px;
    margin-right: 10px;
`

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * 900) + 100;
}

function LectureAttendanceList() {
    const [dropOpen, setDropOpen] = useState(false);
    const [dropSelected, setDropSelected] = useState("2025-09-24");
    const [isOpen, setIsOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600);
    const [randomNumber, setRandomNumber] = useState(null);
    const [checked, setChecked] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // === 모달 스토어 상태 ===
    const { visible, show, hide } = useAttendanceModifyStore();

    const toggleOpen = () => setDropOpen(!dropOpen);

    const handleDropSelect = (value) => {
        setDropSelected(value);
        setDropOpen(false);
    }

    // 옵션 선택
    const handleSelect = () => {
        const rand = getRandomNumber(1, 500);
        setRandomNumber(rand);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setTimeLeft(600);
        setRandomNumber(null);
    };

    useEffect(() => {
        let timer;
        if (isOpen && timeLeft > 0) {
          timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
          }, 1000);
        } else if (timeLeft === 0) {
          setIsOpen(false);
        }
        return () => clearInterval(timer);
    }, [isOpen, timeLeft]);

    // === 학생 리스트 배열 ===
    const students = [
        { profile: profile2, text: "20211222 김민주", status: "출석" },
        { profile: profile3, text: "20159282 이민성", status: "출석" },
        { profile: profile4, text: "20171426 권오규", status: "지각", appeal: true },
        { profile: profile5, text: "20182292 장요한", status: "출석" },
        { profile: profile6, text: "20172182 박동성", status: "출석" },
        { profile: profile7, text: "20192711 김지욱", status: "출석" },
        { profile: profile8, text: "20172111 신정훈", status: "출석" },
        { profile: profile9, text: "20191111 김동희", status: "출석" },
        { profile: profile10, text: "20171125 이강석", status: "지각", appeal: true },
        { profile: profile11, text: "20181982 안제영", status: "출석" },
        { profile: profile12, text: "20182115 박상호", status: "출석" },
        { profile: profile13, text: "20181922 윤서현", status: "출석" },
        { profile: profile18, text: "20172511 이나경", status: "출석", date: "2025-05-09 수정" },
        { profile: profile19, text: "20192182 민유빈", status: "결석", appeal: true },
        { profile: profile14, text: "20191282 성주혜", status: "출석" },
        { profile: profile15, text: "20191396 김원희", status: "출석" },
        { profile: profile17, text: "20125674 김선범", status: "출석" }
    ];

    // 이의신청 있는 학생만 필터
    const appealStudents = students.filter(s => s.appeal);

    // 보여줄 리스트 (체크 여부에 따라 변경)
    const displayStudents = checked ? appealStudents : students;

    // 페이지네이션 계산
    const studentsPerPage = 10;
    const totalPages = Math.ceil(displayStudents.length / studentsPerPage);
    const indexOfLast = currentPage * studentsPerPage;
    const indexOfFirst = indexOfLast - studentsPerPage;
    const currentStudents = displayStudents.slice(indexOfFirst, indexOfLast);

  return (
    <>
        <div style={{width:"100%", minHeight:"731px", backgroundColor:"#f7f7f7"}}>
            <ListHeader style={{height:'84px'}}>
                <div>
                    <FlexDiv>
                        <CatTitle>출결</CatTitle>
                        <SearchDrop style={{marginTop:'-9px', marginLeft:'75px'}}>
                            <DropHeader style={{width:'131px', height:'27px', borderTop: '1px solid #ccc', borderRadius:'5px', fontSize:'13px', lineHeight:'16px'}} onClick={toggleOpen}>
                                {dropSelected}
                                <img src={dropdownArrow} style={{width:"13px", height:"8px", marginLeft:'auto', display:'block', marginTop:'4px'}}></img>
                            </DropHeader>
                            {dropOpen && (
                                <DropList style={{width:'131px'}}>
                                    <DropOption style={{padding:'8px 10px', fontSize:'13px'}} onClick={() => handleDropSelect("2025-09-24")}>2025-09-24</DropOption>
                                    <DropOption style={{padding:'8px 10px', fontSize:'13px'}} onClick={() => handleDropSelect("2025-09-22")}>2025-09-22</DropOption>
                                    <DropOption style={{padding:'8px 10px', fontSize:'13px'}} onClick={() => handleDropSelect("2025-09-17")}>2025-09-17</DropOption>
                                    <DropOption style={{padding:'8px 10px', fontSize:'13px'}} onClick={() => handleDropSelect("2025-09-15")}>2025-09-15</DropOption>
                                    <DropOption style={{padding:'8px 10px', fontSize:'13px'}} onClick={() => handleDropSelect("2025-09-10")}>2025-09-10</DropOption>
                                    <DropOption style={{padding:'8px 10px', fontSize:'13px'}} onClick={() => handleDropSelect("2025-09-08")}>2025-09-08</DropOption>
                                    <DropOption style={{padding:'8px 10px', fontSize:'13px'}} onClick={() => handleDropSelect("2025-09-03")}>2025-09-03</DropOption>
                                    <DropOption style={{padding:'8px 10px', fontSize:'13px'}} onClick={() => handleDropSelect("2025-09-01")}>2025-09-01</DropOption>
                                </DropList>
                            )}
                        </SearchDrop>
                        {!isOpen ? (
                            <Button onClick={handleSelect}>시작</Button>
                        ) : (
                            <Button onClick={handleClose}>닫기</Button>
                        )}
                    </FlexDiv>
                </div>
                <FlexDiv style={{marginTop:'10px', justifyContent:'center'}}>
                    <FlexDiv style={{marginRight:'10px'}}>
                        <Circle />
                        <DateBox style={{color:'#777', fontSize:'13px'}}>출석 : 14</DateBox>
                    </FlexDiv>
                    <FlexDiv style={{marginRight:'10px'}}>
                        <Circle style={{backgroundColor:'#FFF2B7'}}/>
                        <DateBox style={{color:'#777', fontSize:'13px'}}>지각 : 2</DateBox>
                    </FlexDiv>
                    <FlexDiv>
                        <Circle style={{backgroundColor:'#FFB8B8'}}/>
                        <DateBox style={{color:'#777', fontSize:'13px'}}>결석 : 1</DateBox>
                    </FlexDiv>
                </FlexDiv>
            </ListHeader>

            {isOpen && (
                <NumberContainer style={{height:'159px'}}>
                    <Title style={{textAlign:'center', marginTop:'16px'}}>05-01 8주차 출석</Title>
                    <AttenNum>{randomNumber}</AttenNum>
                    <Count>
                        {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
                        {String(timeLeft % 60).padStart(2, '0')}
                    </Count>
                </NumberContainer>
            )}

            {/* === 이의신청 필터 === */}
            <CheckContainer>
                <label style={{display: "flex", justifyContent:'end', marginRight:'14px'}}>
                    <CheckBox 
                        type='checkbox' 
                        checked={checked} 
                        onChange={(e) => {
                            setChecked(e.target.checked);
                            setCurrentPage(1);
                        }}
                    />
                    <CheckMark/>
                    <CheckText>이의신청 ({appealStudents.length})</CheckText>
                </label>
            </CheckContainer>

            {/* 학생 리스트 */}
            {currentStudents.map((stu, idx) => (
                <WHContainer key={idx} style={{padding:'12px 22px'}}>
                    <Profile as="img" src={stu.profile}></Profile>
                    <Title style={{lineHeight:'40px', marginLeft:'15px'}}>{stu.text}</Title>
                    {stu.appeal && (
                        <AttenChange style={{marginLeft:'65px', marginTop:'9px'}} onClick={show}>이의신청</AttenChange>
                    )}
                    {stu.date && (
                        <DateBox style={{marginLeft:'40px', marginTop:'11px'}}>{stu.date}</DateBox>
                    )}
                    <AttenBox style={{
                        backgroundColor: stu.status === "출석" ? '#C2E8B7' : stu.status === "지각" ? '#FFF2B7' : '#FFB8B8',
                        marginTop:'6px', width:'73px', height:'29px'
                    }}>
                        <AttenText style={{marginTop:'4px', fontWeight:'500'}}>{stu.status}</AttenText>
                    </AttenBox>
                </WHContainer>
            ))}

            {/* 페이지네이션 */}
            <nav>
                <PageNation>
                    <PageArrowButton disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                        <PageText href="#"><img src={pageArrow1} style={{width:"13px", height:"10px", marginLeft:'6px'}}/></PageText>
                    </PageArrowButton>
                    <PageArrowButton disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                        <PageText href="#"><img src={pageArrow2} style={{width:"6px", height:"10px", marginLeft:'10px'}}/></PageText>
                    </PageArrowButton>

                    {[...Array(totalPages)].map((_, i) => (
                        <PageNumberButton key={i} onClick={() => setCurrentPage(i+1)}>
                            <PageNumText href="#" style={{fontWeight: currentPage === i+1 ? 'bold' : 'normal'}}>{i+1}</PageNumText>
                        </PageNumberButton>
                    ))}

                    <PageArrowButton disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                        <PageText href="#"><img src={pageArrow3} style={{width:"6px", height:"10px", marginLeft:'10px'}}/></PageText>
                    </PageArrowButton>
                    <PageArrowButton disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
                        <PageText href="#"><img src={pageArrow4} style={{width:"13px", height:"10px", marginLeft:'6px'}}/></PageText>
                    </PageArrowButton>
                </PageNation>
            </nav>
        </div>

        {/* === 교수 이의신청 모달 === */}
        {visible && (
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
          >
            <LectureAttendanceModify
              onClose={hide}
              onSubmit={(payload) => {
                console.log("교수 처리 결과:", payload);
                hide();
              }}
            />
          </div>
        )}
    </>
  )
}

export default LectureAttendanceList