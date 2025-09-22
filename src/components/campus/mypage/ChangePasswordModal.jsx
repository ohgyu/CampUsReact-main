// ChangePasswordModal.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { usePasswordModalStore } from "../commons/modalStore";
import useModalStore from "../commons/modalStore";   // ✅ ConfirmModal용 zustand store
import Toast from "../commons/Toast";
import axios from "axios";
import ConfirmModal from "../commons/ConfirmModal";

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 3000;
`;

const ModalBox = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 346px;
  text-align: center;
  margin-bottom: 50px;
`;

const Button = styled.button`
  border: none;
  font-size: 12px;
  font-weight: bold;
  background-color: #fff;
  cursor: pointer;
`;

const Line = styled.div`
  width: 1px;
  height: 26px;
  background-color: #aaa;
`;

const Label = styled.p`
  font-size: 12px;
  text-align: left;
  margin: 10px 0 4px;
`;

const ConfirmInput = styled.input`
  width: 100%;
  border-radius: 3px;
  height: 27px;
  font-size: 13px;
  border: 1px solid #aaa;
  &:focus {
    outline: none;
    border-color: #2ec4b6;
  }
`;

const Information = styled.span`
  color: #aaa;
  font-size: 12px;
`;

function ChangePasswordModal() {
  const { visible, message, hideModal } = usePasswordModalStore();
  const { showConfirm } = useModalStore();  // ✅ confirm 모달 store
  const [toastMsg, setToastMsg] = useState("");
  const [form, setForm] = useState({ currentPw: "", newPw: "", confirmPw: "" });

  if (!visible) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 실제 비밀번호 변경 처리
  const doChangePassword = async () => {
    const pwPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;

    if (!pwPattern.test(form.newPw)) {
      setToastMsg("비밀번호는 영문 + 숫자 조합, 8~16자여야 합니다.");
      return;
    }
    if (form.newPw !== form.confirmPw) {
      setToastMsg("새 비밀번호와 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user) {
        setToastMsg("로그인이 필요합니다.");
        return;
      }

      const res = await axios.post(
        `/api/member/change-password?memId=${user.mem_id}`,
        {
          currentPw: form.currentPw,
          newPw: form.newPw,
        }
      );

      if (res.data.success) {
        setToastMsg("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
        sessionStorage.clear();
        setTimeout(() => {
          window.location.href = "/login"; // 로그인 페이지 경로 맞게 수정
        }, 1500);
      } else {
        setToastMsg(res.data.message || "비밀번호 변경 실패");
      }
    } catch (err) {
      console.error(err);
      setToastMsg("서버 오류 발생");
    }
  };

  // 확인 버튼 → confirm 모달 띄움
  const handleConfirm = () => {
    showConfirm("비밀번호를 변경하시겠습니까?", doChangePassword);
  };

  const handleCancel = () => {
    hideModal();
  };

  return (
    <>
      <Overlay>
        <ModalBox>
          {message && <p>{message}</p>}

          <Label>현재 비밀번호</Label>
          <ConfirmInput
            type="password"
            name="currentPw"
            value={form.currentPw}
            onChange={handleChange}
          />

          <Label>새 비밀번호</Label>
          <ConfirmInput
            type="password"
            name="newPw"
            value={form.newPw}
            onChange={handleChange}
          />
          <Information>
            비밀번호는 영문 + 숫자 조합, 8 ~ 16자 입력 해주세요.
          </Information>

          <Label>새 비밀번호 확인</Label>
          <ConfirmInput
            type="password"
            name="confirmPw"
            value={form.confirmPw}
            onChange={handleChange}
          />

          <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-evenly" }}>
            <Button onClick={handleCancel}>취소</Button>
            <Line />
            <Button onClick={handleConfirm}>확인</Button>
          </div>
        </ModalBox>
      </Overlay>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
    </>
  );
}

export default ChangePasswordModal;