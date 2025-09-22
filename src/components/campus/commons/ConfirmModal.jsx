// ConfirmModal.js
import React from "react";
import styled from "styled-components";
import useModalStore from "./modalStore";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.2);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 4000;

`;

const ModalBox = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 350px;
  text-align: center;
  margin-bottom: 50px;
`;
const Button = styled.button`
    border: none;
    font-size: 12px;
    font-weight: bold;
    background-color: #fff;
`
const Line = styled.div`
    width: 1px;
    height: 26px;
    background-color: #aaa;
`
 const ConfirmText = styled.p`
    font-size: 14px;
    text-align: left;
    line-height: 25px;
 `
function ConfirmModal() {
  const { confirmVisible, confirmMessage, onConfirm, hideConfirm } = useModalStore();

  if (!confirmVisible) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    hideConfirm(); // 필요 없을 수도 있음, showConfirm 내부에서 이미 false로 설정됨
  };

  return (
    <Overlay>
      <ModalBox>
        <ConfirmText style={{marginTop:'-5px'}}>{confirmMessage}</ConfirmText>
        <div style={{ marginTop: "30px" ,display:'flex',justifyContent:'center', gap:'75px', marginBottom:'-10px'}}>
          <Button onClick={hideConfirm}>취소</Button>
          <Line />
          <Button onClick={handleConfirm}>확인</Button>
        </div>
      </ModalBox>
    </Overlay>
  );
}

export default ConfirmModal;