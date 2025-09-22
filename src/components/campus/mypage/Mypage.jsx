import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Cancle, pictureMdfBtn, user11 } from '../img';
import { CatTitle, FlexDiv, RegistButton } from '../commons/WHComponent';
import { ContentBox, Header, HeadText } from '../home/HomeWrapper';
import { GreenBox } from '../proObject/ProjectObjectProjectList';
import { Hr } from '../menu/SideMenu';
import { useMypageModalStore, usePasswordModalStore } from '../commons/modalStore';
import Toast from '../commons/Toast';
import { getMypage, uploadProfile } from '../api';
import ChangePasswordModal from "./ChangePasswordModal";

// ================== 날짜 포맷 함수 ==================
function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value; // 변환 실패시 원본 반환
  return date.toISOString().split("T")[0];
}

// ================== 모달 기본 ==================
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: #fff;
  width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 12px;
  position: relative;
`;

// ================== 내부 스타일 ==================
const PictureContainer = styled.div`
  width: 100%;
  height: 234px;
  display: flex;
  text-align: center;
  margin-top: 8px;
  align-items: center;
  background-color: #f7f7f7;
  justify-content: center;
`;
const Picture = styled.div`
  width: 114px;
  height: 114px;
  border-radius: 100px;
  position: relative;
  margin-top: 20px;
`;
const PictureModifyBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  padding: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  right: 0;
`;

const Table = styled.table`
  font-size: 14px;
  width: 372px;
  margin: 0 auto;
`;
const TableTitle = styled.td`
  min-width: 77px;
  border-right: 1px solid #aaa;
  border-bottom: 1px solid #aaa;
`;
const TitleText = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
  margin-top: 7px;
`;
const TableOverView = styled.td`
  width: 295px;
  border-bottom: 1px solid #aaa;
  max-width: 295px;
  line-height: 2;
`;
const TableText = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin: 8px 12px 8px 18px;
  line-height: 1.8;
`;
const Wrap = styled.div`
  width: 100%;
  background-color: #f7f7f7;
  padding-bottom: 20px;
`;
const MyTitleText = styled.h3`
  font-size: 14px;
  font-weight: 700;
  margin: 0;
`;

const ExitButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`;

// ================== 메인 컴포넌트 ==================
function Mypage() {
  const { showModal } = usePasswordModalStore();
  const { visible, hideModal } = useMypageModalStore();

  const [toastMsg, setToastMsg] = useState("");
  const [imgSrc, setImgSrc] = useState(user11);
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [mypageData, setMypageData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      getMypage(parsed.mem_id)
        .then(res => {
          if (res.data.ok) {
            setMypageData(res.data);
            if (res.data.member.picture) {
              setImgSrc(`/api/member/getPicture?memId=${parsed.mem_id}&v=${Date.now()}`);
            }
          }
        })
        .catch(err => console.error("마이페이지 로드 실패:", err));
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImgSrc(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!selectedFile || !user) {
      setToastMsg("변경된 사진이 없습니다.");
      return;
    }
    try {
      const res = await uploadProfile(user.mem_id, selectedFile);
      if (res.data.ok) {
        // ✅ 프로필 즉시 반영
        const newUrl = `/api/member/getPicture?memId=${user.mem_id}&v=${Date.now()}`;
        setImgSrc(newUrl);

        // ✅ sessionStorage 갱신
        const updatedUser = { ...user, picture: res.data.file };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        // ✅ SideMenu에 알림
        window.dispatchEvent(new Event("userUpdated"));

        setToastMsg("저장되었습니다!");
        setSelectedFile(null);
      }
    } catch (err) {
      console.error(err);
      setToastMsg("업로드 실패");
    }
  };

  const openModal = () => {
    showModal("비밀번호를 변경", (form) => {
      console.log("확인 클릭됨:", form);
    });
  };

  if (!visible || !user) return null;
  if (!mypageData) return <div>Loading...</div>;

  const member = mypageData.member;
  const academic = mypageData.academic || {};

  return (
    <>
      <ModalOverlay onClick={hideModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
            <div style={{padding: '20px'}}>
          <FlexDiv style={{ position: 'relative', justifyContent: 'center', alignItems: 'center'}}>
            <ExitButton onClick={hideModal}>
              <img src={Cancle} alt="닫기" style={{ width: '19px', height: '19px' }} />
            </ExitButton>

            <CatTitle style={{ textAlign: 'center' }}>마이페이지</CatTitle>

            <RegistButton 
              style={{ 
                width: '48px', 
                height: '26px',
                position: 'absolute',
                right: 0
              }} 
              onClick={handleSave}
            >
              저장
            </RegistButton>
          </FlexDiv>
          </div>

          {/* 프로필 사진 */}
          <PictureContainer>
            <div>
              <Picture>
                <img src={imgSrc} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%',display:'block'}}/>
                <PictureModifyBtn onClick={() => fileInputRef.current.click()}>
                  <img src={pictureMdfBtn} style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                </PictureModifyBtn>
                <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} />
              </Picture>
              <HeadText style={{marginTop:'12px', marginBottom:'2px'}}>{member.mem_id}</HeadText>
              <HeadText style={{marginTop:0}}>{member.mem_name}</HeadText>
            </div>
          </PictureContainer>

          <Wrap>
            
            <ContentBox style={{height:'auto', marginBottom:'10px'}}>
              <Header style={{paddingTop:'20px', alignItems:'center',paddingLeft:'20px', paddingRight:'20px'}}>
                <MyTitleText>기본정보</MyTitleText>
                <GreenBox style={{width:'97px', height:'26px', lineHeight:'23px', marginLeft:'auto'}} onClick={openModal}>
                  비밀번호 변경
                </GreenBox>
              </Header>
              <Hr style={{width:'372px', margin:'0 auto'}}/>
              <Table>
                <tbody>
                  <tr><TableTitle><TitleText>이름</TitleText></TableTitle><TableOverView><TableText>{member.mem_name}</TableText></TableOverView></tr>
                  <tr><TableTitle><TitleText>번호</TitleText></TableTitle><TableOverView><TableText>{member.mem_id}</TableText></TableOverView></tr>
                  <tr><TableTitle><TitleText>직위</TitleText></TableTitle><TableOverView><TableText>
                    {member.mem_auth && member.mem_auth.includes("ROLE01") ? "학생" :
                     member.mem_auth && member.mem_auth.includes("ROLE02") ? "교수" : "-"}
                  </TableText></TableOverView></tr>
                  <tr><TableTitle><TitleText>생년월일</TitleText></TableTitle><TableOverView><TableText>{formatDate(member.birthDate)}</TableText></TableOverView></tr>
                  <tr><TableTitle><TitleText>이메일</TitleText></TableTitle><TableOverView><TableText>{member.mem_email}</TableText></TableOverView></tr>
                  <tr><TableTitle><TitleText>연락처</TitleText></TableTitle><TableOverView><TableText>{member.mem_phone}</TableText></TableOverView></tr>
                  <tr><TableTitle><TitleText>주소</TitleText></TableTitle><TableOverView><TableText>{member.mem_add}</TableText></TableOverView></tr>
                </tbody>
              </Table>
            </ContentBox>
            

            {/* ✅ 학사정보 (학생일 경우만 렌더링) */}
            <div style={{marginTop:'20px'}}>
            {member.mem_auth && member.mem_auth.includes("ROLE01") && (
              <ContentBox style={{height:'auto', marginBottom:'10px'}}>
                <Header style={{paddingTop:'20px',paddingBottom:'10px', alignItems:'center',paddingLeft:'26px'}}>
                  <MyTitleText>학사정보</MyTitleText>
                </Header>
                <Hr style={{width:'372px', margin:'0 auto'}}/>
                <Table>
                  <tbody>
                    <tr><TableTitle><TitleText>입학대학</TitleText></TableTitle><TableOverView><TableText>{academic.college || "-"}</TableText></TableOverView></tr>
                    <tr><TableTitle><TitleText>전공</TitleText></TableTitle><TableOverView><TableText>{academic.major || "-"}</TableText></TableOverView></tr>
                    <tr><TableTitle><TitleText>부전공</TitleText></TableTitle><TableOverView><TableText>{academic.minor || "-"}</TableText></TableOverView></tr>
                    <tr><TableTitle><TitleText>입학학년</TitleText></TableTitle><TableOverView><TableText>{academic.entryGrade || "-"}</TableText></TableOverView></tr>
                    <tr><TableTitle><TitleText>입학년도</TitleText></TableTitle><TableOverView><TableText>{academic.entranceYear || "-"}</TableText></TableOverView></tr>
                    <tr><TableTitle><TitleText>입학일자</TitleText></TableTitle><TableOverView><TableText>{formatDate(academic.entranceDate)}</TableText></TableOverView></tr>
                    <tr><TableTitle><TitleText>졸업년도</TitleText></TableTitle><TableOverView><TableText>{academic.gradYear || "-"}</TableText></TableOverView></tr>
                    <tr><TableTitle><TitleText>졸업전공</TitleText></TableTitle><TableOverView><TableText>{academic.gradMajor || "-"}</TableText></TableOverView></tr>
                    <tr><TableTitle><TitleText>졸업학과</TitleText></TableTitle><TableOverView><TableText>{academic.gradDept || "-"}</TableText></TableOverView></tr>
                    <tr><TableTitle><TitleText>졸업일자</TitleText></TableTitle><TableOverView><TableText>{formatDate(academic.gradDate)}</TableText></TableOverView></tr>
                    <tr><TableTitle><TitleText>이수학기수</TitleText></TableTitle><TableOverView><TableText>{academic.semesters || "-"}</TableText></TableOverView></tr>
                  </tbody>
                </Table>
              </ContentBox>
            )}
            </div>
          </Wrap>
        </ModalContent>
      </ModalOverlay>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
        <ChangePasswordModal />
    </>
  );
}

export { Table, TableOverView, TableText, TableTitle, TitleText, Wrap, Picture, PictureContainer, PictureModifyBtn };
export default Mypage;