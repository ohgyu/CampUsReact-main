import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { menuBar, logoRow, mail } from '../img'
import { Nonebutton, StyledLink } from '../menu/SideMenu';
import { useAuthStore, useMailModalStore, useSideMenuStore } from '../commons/modalStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStudent, getUserSession, logoutUser } from '../api';

export const Container = styled.div`
  width: 100%;
  height: 70px;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap:95px;
  padding: 22px 26px 18px 26px;
  box-sizing: border-box;
`
export const Menu = styled.div`
    width: 20px;
    height: 20px;
`

function TopNav() {
  const toggleMenu = useSideMenuStore((state) => state.toggleMenu);
  const user = getUserSession();


    return (
      <Container>
        <Nonebutton style={{ width: "27px", height: "18px" }} onClick={toggleMenu}>
          <img src={menuBar} style={{ width: "27px", height: "18px", marginTop: "5px" }} />
        </Nonebutton>
  
        <StyledLink to={`/?memId=${user.mem_id}`}>
          <img src={logoRow} style={{ width: "116px", height: "27px" }} />
        </StyledLink>
  
        <StyledLink to={`/mail?memId=${user.mem_id}`}>
          <img src={mail} style={{ width: "27px", height: "18px", marginTop: "5px", cursor: 'pointer' }} />
        </StyledLink>
      </Container>
    )
  }

  export default TopNav