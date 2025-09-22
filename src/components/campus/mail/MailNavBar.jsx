import React from 'react'
import { GrayHr } from '../home/HomeWrapperPro'
import styled from 'styled-components'
import { Link, NavLink } from 'react-router-dom'
import MailNavItem from '../mail/MailNavItem'
import { Button } from '../commons/WHComponent'
import { Cancle, mailWrite } from '../img'
import { Container } from '../topNav/TopNav'
import { getUserSession } from '../api'
import { useMailWriteModalStore } from '../commons/modalStore'

const NavContainer = styled.div`
    height: 48px;
    display: flex;
    justify-content: center;
    background-color: #fff;
    gap: 40px;
`

const StyleLink = styled(NavLink)`
    text-decoration: none;
    color: #aaa;
    border-bottom: 2px solid transparent;

    &:hover{
        color: #2ec4b6;
        border-bottom: 2px solid #2ec4b6;
    }
    &.active {
        color: #2ec4b6;
        border-bottom: 2px solid #2ec4b6;
  }
`

const WriteBox = styled.div`
    width: 55px;
    height: 55px;
    background-color: #2ec4b6;
    border-radius: 30px;
    position: absolute;
    top: 680px;
    left: 330px;
    position: fixed;
    padding: 11px;
`
const WriteIcon = styled.img`
    width: 32px;
    height: 32px;
`

function MailNavBar() {
    const user = getUserSession();
    const showModal = useMailWriteModalStore((state) => state.showModal);

    return (
        <>
            <GrayHr style={{ margin: 0, backgroundColor: '#ddd' }} />
            <NavContainer style={{ alignItems: 'center' }}>
                <StyleLink to={`/mail?memId=${user.mem_id}`} end>
                    {({ isActive }) => <MailNavItem name='전체 메일' active={isActive} />}
                </StyleLink>
                <StyleLink to={`/mail/receive?memId=${user.mem_id}`}>
                    {({ isActive }) => <MailNavItem name='받은 메일함' active={isActive} />}
                </StyleLink>
                <StyleLink to={`/mail/send?memId=${user.mem_id}`}>
                    {({ isActive }) => <MailNavItem name='보낸 메일함' active={isActive} />}
                </StyleLink>
                <StyleLink to={`/mail/waste?memId=${user.mem_id}`}>
                    {({ isActive }) => <MailNavItem name='휴지통' active={isActive} />}
                </StyleLink>
            </NavContainer>
            <GrayHr style={{ margin: 0, backgroundColor: '#ddd' }} />

            <div onClick={showModal}>
                <WriteBox >
                    <WriteIcon src={mailWrite} />
                </WriteBox>
            </div>
        </>
    )
}

export default MailNavBar