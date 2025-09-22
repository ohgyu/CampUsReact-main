import React, { useEffect, useState } from 'react'
import TopNav from './topNav/TopNav'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useMatch, useNavigate, useParams } from 'react-router-dom'

import SideMenu from './menu/SideMenu'

import Mypage from './mypage/Mypage'
import MypagePro from './mypage/MypagePro'
import ChangePasswordModal from './mypage/ChangePasswordModal'

import MailDashBoard from './mail/MailDashBoard'
import MailDetail from './mail/MailDetail'
import MailNavBar from './mail/MailNavBar'
import MailNavItem from './mail/MailNavItem'
import MailReceive from './mail/MailReceive'
import MailSend from './mail/MailSend'
import MailWaste from './mail/MailWaste'
import MailWasteDetail from './mail/MailWasteDetail'
import MailWrapper from './mail/MailWrapper'
import MailWrite from './mail/MailWrite'

import HomeWrapper from './home/HomeWrapper'
import HomeWrapperPro from './home/HomeWrapperPro'

import LectureNoticeWrapper from './lecNotice/LectureNoticeWrapper'
import LectureNoticeDetail from './lecNotice/LectureNoticeDetail'
import LectureNoticeRegist from './lecNotice/LectureNoticeRegist'
import LectureNoticeList from './lecNotice/LectureNoticeList'
import LectureNoticeModify from './lecNotice/LectureNoticeModify'

import LectureOnlineWrapper from './lecOnline/LectureOnlineWrapper'
import LectureOnlineDetail from './lecOnline/LectureOnlineDetail'
import LectureOnlineModify from './lecOnline/LectureOnlineModify'
import LectureOnlineList from './lecOnline/LectureOnlineList'
import LectureOnlineRegist from './lecOnline/LectureOnlineRegist'

import LecturePlanWrapper from './lecPlan/LecturePlanWrapper'
import LecturePlanModify from './lecPlan/LecturePlanModify'
import LecturePlanDetail from './lecPlan/LecturePlanDetail'
import LecturePlanDetailPro from './lecPlan/LecturePlanDetailPro'
import LecturePlanRegist from './lecPlan/LecturePlanRegist'
import LecturePlanNoneData from './lecPlan/LecturePlanNoneData'
import LecturePlanNoneDataPro from './lecPlan/LecturePlanNoneDataPro'

import LectureHomeworkList from './lecHomework/LectureHomeworkList'
import LectureHomeworkProDetail from './lecHomework/LectureHomeworkProDetail'
import LectureHomeworkRegist from './lecHomework/LectureHomeworkRegist'
import LectureHomeworkStuDetail from './lecHomework/LectureHomeworkStuDetail'
import LectureHomeworkSubmit from './lecHomework/LectureHomeworkSubmit'
import LectureHomeworkWrapper from './lecHomework/LectureHomeworkWrapper'
import LectureHomeworkDetail from './lecHomework/LectureHomeworkDetail';

import LecturePdsWrapper from './lecPds/LecturePdsWrapper'
import LecturePdsDetail from './lecPds/LecturePdsDetail'
import LecturePdsList from './lecPds/LecturePdsList'
import LecturePdsRegist from './lecPds/LecturePdsRegist'
import LecturePdsModify from './lecPds/LecturePdsModify'

import LectureAttendanceWrapper from './lecAtten/LectureAttendanceWrapper'
import LectureAttendanceChange from './lecAtten/LectureAttendanceChange'
import LectureAttendanceListPro from './lecAtten/LectureAttendanceListPro'
import LectureAttendanceListStu from './lecAtten/LectureAttendanceListStu'
import LectureAttendanceModify from './lecAtten/LectureAttendanceModify'

import ProjectObjectList from './proObject/ProjectObjectList'
import ProjectObjectWrapper from './proObject/ProjectObjectWrapper'
import ProjectObjectDetailFeedback from './proObject/ProjectObjectDetailFeedback'
import ProjectObjectFeedback from './proObject/ProjectObjectFeedback'
import ProjectObjectProjectList from './proObject/ProjectObjectProjectList'
import ProjectObjectRegist from './proObject/ProjectObjectRegist'

import ProjectTeamWrapper from './proTeam/ProjectTeamWrapper'
import ProjectTeamDetail from './proTeam/ProjectTeamDetail'
import ProjectTeamList from './proTeam/ProjectTeamList'
import ProjectTeamListPro from './proTeam/ProjectTeamListPro'
import ProjectTeamModify from './proTeam/ProjectTeamModify'
import ProjectTeamModifyCheck from './proTeam/ProjectTeamModifyCheck'
import ProjectTeamRegist from './proTeam/ProjectTeamRegist'
import TeamSearch from './proTeam/TeamSearch'
import TeamMemberSearch from './proTeam/TeamMemberSearch'
import ProfessorSearch from './proTeam/ProfessorSearch'

import BoardWrapper from './board/BoardWrapper'
import BoardDetail from './board/BoardDetail'
import BoardList from './board/BoardList'
import BoardModify from './board/BoardModify'
import BoardRegist from './board/BoardRegist'
import styled from 'styled-components'
import { useAuthStore, useToastStore } from './commons/modalStore'
import Loading from './commons/Loading'
import Login from './commons/Login'
import { RedirectAfterLogin } from './home/RedirectAfterLogin'
import Toast from './commons/Toast'
import ConfirmModal from './commons/ConfirmModal';
import ProjectObjectFeedbackModify from './proObject/ProjectObjectFeedbackModify'
import ProjectObjectDetail from './proObject/ProjectObjectDetail'


// /lecture → /notice 로 리다이렉트 (쿼리 유지)
function LectureAliasRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/notice${search}`} replace />;
}

function CampusMain() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const login = useAuthStore(state => state.login);
  const logout = useAuthStore(state => state.logout);
  const [checkingSession, setCheckingSession] = useState(true);
  const user = useAuthStore(state => state.user);
  const location = useLocation();
  const { message, hideToast } = useToastStore();

  const hideTopNav =
    useMatch('/homework/stu/:submitId');


  useEffect(() => {
    // 세션 스토리지에 로그인 정보가 있으면 로그인 처리
    const userData = sessionStorage.getItem('user');
    if (userData) {
      login(JSON.parse(userData));
    } else {
      logout();
    }
    setCheckingSession(false);
  }, []);

  if (checkingSession) return <Loading />;



  return (
    <>
      {!isLoggedIn ? (<Login />
      ) : (
        <>
          <RedirectAfterLogin />
          {!hideTopNav && <TopNav />}
          {location.pathname.startsWith('/mail') && !location.pathname.includes('/detail') ? <MailNavBar /> : null}
          <SideMenu />

          <Routes>
            <Route path='/' element={user.mem_auth === "ROLE01" ? <HomeWrapper /> : <HomeWrapperPro />}></Route>
            <Route path='/plan' element={<LecturePlanWrapper />}>
              <Route index element={user.mem_auth === "ROLE01" ? <LecturePlanNoneData /> : <LecturePlanNoneDataPro />}></Route>
            </Route>
            <Route path='/notice' element={<LectureNoticeWrapper />}>
              <Route index element={<LectureNoticeList />}></Route>
              <Route path=':id' element={<LectureNoticeDetail />}></Route>
            </Route>
            <Route path='/course/:lecId/online' element={<LectureOnlineWrapper />}>
          <Route index element={<LectureOnlineList />} />
          <Route path=':lecvid_id' element={<LectureOnlineDetail />} />
        </Route>
        <Route path='/online' element={<LectureOnlineWrapper />}>
          <Route index element={<LectureOnlineList />} />
          <Route path=':lecvid_id' element={<LectureOnlineDetail />} />
          <Route path=':lecvid_id/modify' element={<LectureOnlineModify />} />
            </Route>
            <Route path="/attendance/professor" element={<LectureAttendanceListPro />} />
            <Route path="/attendance/student" element={<LectureAttendanceListStu />} />
            <Route path='/homework' element={<LectureHomeworkWrapper />}>
              <Route index element={<LectureHomeworkList />}></Route>
              <Route path=':hwNo/:stuId' element={<LectureHomeworkDetail />}></Route>
              <Route path='pro/:hwNo' element={<LectureHomeworkProDetail />} />
              <Route path='stu/:submitId' element={<LectureHomeworkStuDetail />} />
            </Route>
            <Route path='/pds' element={<LecturePdsWrapper />}>
              <Route index element={<LecturePdsList />}></Route>
              <Route path=':cf_no' element={<LecturePdsDetail />}></Route>
            </Route>
            <Route path='/project/team' element={<ProjectTeamWrapper />}>
              <Route index element={user.mem_auth === "ROLE01" ? <ProjectTeamList /> : <ProjectTeamListPro />}
              />
              <Route path=':team_id' element={<ProjectTeamDetail />}></Route>
            </Route>
            <Route path='/project/object' element={<ProjectObjectWrapper />}>
          <Route index element={<ProjectObjectProjectList />}></Route>
          <Route path=':project_id/list' element={<ProjectObjectList />}></Route>
            <Route path=':project_id/list/:rm_id/detail' element={<ProjectObjectDetail/>}></Route> 
          
        </Route>
            <Route path="/board" element={<BoardWrapper />}>
              <Route index element={<BoardList />} />
              <Route path="detail/:id" element={<BoardDetail />} />
              <Route path="modify/:id" element={<BoardModify />} />
              <Route path="write" element={<BoardRegist />} />
            </Route>

            <Route path='/mail' element={<MailWrapper />}>
              <Route index element={<MailDashBoard />}></Route>
              <Route path='receive' element={<MailReceive />}></Route>
              <Route path='send' element={<MailSend />}></Route>
              <Route path='waste' element={<MailWaste />}></Route>
              <Route path='detail/:mail_id' element={<MailDetail />}></Route>
              <Route path='detail/wasted/:mail_id' element={<MailWasteDetail />}></Route>
            </Route>
            <Route path='/mypage' element={user.mem_auth.includes("ROLE01") ? <Mypage /> : <MypagePro />} />
          </Routes>

          <ConfirmModal />
          <Mypage />

          <MailWrite />
          <ChangePasswordModal />
          <ProjectTeamRegist />
          <ProjectTeamDetail />
          <ProjectTeamModify />
          <TeamSearch />
          <TeamMemberSearch />
          <ProfessorSearch />
          <ProjectTeamModifyCheck />
          <LectureHomeworkRegist />
           <ProjectObjectFeedback/>
           <ProjectObjectFeedbackModify/>
          <LecturePlanRegist />
          {message && <Toast message={message} onClose={hideToast} />}
        </>
      )}


      {/* 
      <LecturePlanModify />
      <LecturePlanRegist/>
      <LecturePlanRegist/>
      <LectureOnlineRegist/>
      <LectureOnlineModify/>
      <LectureAttendanceChange/>
      <LectureAttendanceModify/>
      <ProjectObjectFeedback/>
      <ProjectObjectRegist/>
      */}

    </>
  )
}

export default CampusMain