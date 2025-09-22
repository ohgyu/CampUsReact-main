import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Cancle, clip } from "../img";
import { Container } from "../topNav/TopNav";
import { deleteMail, getMailDetail, getUserSession, updateMailWasteBack } from "../api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../commons/WHComponent";
import ConfirmModal from "../commons/ConfirmModal";
import useModalStore, { useToastStore } from "../commons/modalStore";

const MobileShell = styled.div`
  width: 100vw;
  background: #fff;
`;

const SubHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 0 10px;
  font-size: 12px;
  color: #98a1a8;
  gap: 8px;
  margin-right: 10px;
`;
const TimeText = styled.div`
  font-size: 12px;
  flex: 1;
  margin-left: 10px;
`;
const PageDivider = styled.div`
  height: 2px;
  background: #2ec4b6;
  opacity: .6;
  border-radius: 2px;
  margin-bottom: 14px;
`;

const Card = styled.div`
  background: #fff;
`;
const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;
const MailTitle = styled.h3`
  flex: 1;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 16px;
  line-height: 1.4;
  margin-left: 10px;
  
`;
const CardHr = styled.div`
  width: 372px;
  height: 1px;
  background: #D9D9D9;
  border: 0;
  margin: 16px 0 16px;
`;

const Meta = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr;
  row-gap: 8px;
  column-gap: 8px;
`;
const MetaLabel = styled.div`
  font-size: 14px;
  line-height: 28px;
  margin-left: 10px;
`;
const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;
const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: #DFFCF9;
  border: 1px solid #e0e7ec;
  font-size: 12px;
  color: #1f2937;
`;
const ChipName = styled.span`
  font-weight: 600;
`;
const ChipEmail = styled.span`
`;

const BodyText = styled.div`
  min-height: 220px;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
  margin-top: 14px;
  margin-left: 10px;
`;

const Attachment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  margin-left: 10px;
`;

const AttachmentIcon = styled.img`
  display: block;
  width: 14px;
  height: 14px;
  background: #fff;
  object-fit: contain;
`;

const AttachmentName = styled.a`
  font-size: 13px;
  color: #707070;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: 'none';
`;

/* ===== Footer ===== */
const CardFooter = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
// const ListButton = styled.button`
//   height: 28px;
//   padding: 0 12px;
//   font-size: 12px;
//   border: 1px solid #ccc;
//   background: #fff;
//   color: #59636b;
//   border-radius: 5px;
//   cursor: pointer;
//   margin-right: 10px;
// `;

export default function MailWasteDetail() {
  const [loading, setLoading] = useState(true);
  const user = getUserSession();
  const [data, setData] = useState(null);
  const query = useQuery();
  const location = useLocation();
  const { mail_id } = useParams(); // 경로에서 mail_id 가져오기
  const params = new URLSearchParams(useLocation().search);
  const memId = params.get("memId"); // 쿼리에서 memId 가져오기
  const navigate = useNavigate();
  const { showToast } = useToastStore();
  const stripHtmlTags = (html) => html?.replace(/<\/?[^>]+(>|$)/g, "") || "";


  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const yy = String(date.getFullYear()).slice(-2); // 연도 뒤 2자리
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월 0~11이므로 +1
    const dd = String(date.getDate()).padStart(2, '0'); // 일
    const hh = String(date.getHours()).padStart(2, '0'); // 시
    const min = String(date.getMinutes()).padStart(2, '0'); // 분
    return `${yy}-${mm}-${dd} ${hh}:${min}`;
  };

  useEffect(() => {
    if (!mail_id || !memId) return;  // 둘 다 없으면 실행하지 않음

    const mailIdNum = parseInt(mail_id, 10); // NaN 방지
    getMailDetailPage(mailIdNum, memId);
  }, [mail_id, memId]);

  async function getMailDetailPage(mail_id, memId) {
    try {
      let response = await getMailDetail(mail_id, memId);
      setData(response.data);
      console.log(response);
      setLoading(false);
    } catch (e) {
      console.log(e);
      alert("데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  // 복구
  const handleWasteBack = async () => {

    try {
      const res = await updateMailWasteBack(mail_id);

      if (res.data.success) {
        showToast("복구했습니다.");
        // 실패 시 롤백
        navigate(-1);
      } else {
        showToast("휴지통 이동 실패");
      }
    } catch (e) {
      console.error(e);
      showToast("에러가 발생했습니다.");
    }
  };

  // 삭제
  const handleDelete = async () => {

    useModalStore.getState().showConfirm(
      "복구가 불가능합니다. 정말 삭제하시겠습니까?",
      async () => {
        try {
          const res = await deleteMail(mail_id);

          if (res.data.success) {
            showToast("삭제했습니다.");
            // 실패 시 롤백
            navigate(-1);
          } else {
            showToast("삭제 실패");
          }
        } catch (e) {
          console.error(e);
          showToast("에러가 발생했습니다.");
        }
      })
  };

  return (
    <>
      <MobileShell>
        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {!loading && data &&
            data.detail &&
            <div style={{ padding: '5px 20px 24px' }}>
              <SubHeader>
                <TimeText>{formatDate(data.detail.mail_ddate)}</TimeText>
                <Button style={{ marginTop: '2px', fontSize: '13px', height: '24px', marginLeft: '0', backgroundColor: '#fff', border: '1px solid #aaa', color: '#aaa', width: '40px' }} onClick={handleWasteBack}>복구</Button>
                <Button style={{ marginTop: '2px', height: '24px', marginLeft: '1px', backgroundColor: '#fff', border: '1px solid #aaa', color: '#aaa', width: '60px' }} onClick={handleDelete}>영구삭제</Button>
              </SubHeader>

              <PageDivider />

              <Card>
                <TitleRow>
                  <div>
                    <MailTitle>{data.detail.mail_name}</MailTitle>
                  </div>
                </TitleRow>

                <Meta>
                  <MetaLabel>보낸 사람</MetaLabel>
                  <ChipRow>
                    <Chip>
                      <ChipName>{data.detail.sender_name}</ChipName>
                      <ChipEmail>{data.detail.sender_email}</ChipEmail>
                    </Chip>
                  </ChipRow>

                  <MetaLabel>받는 사람</MetaLabel>
                  <ChipRow>
                    <Chip>
                      <ChipName>{data.detail.receiver_name}</ChipName>
                      <ChipEmail>{data.detail.receiver_email}</ChipEmail>
                    </Chip>
                  </ChipRow>
                </Meta>
                <CardHr />
                <BodyText>{stripHtmlTags(data.detail.mail_desc)}</BodyText>

                {data.detail.mailFileList?.length > 0 && (
                  <Attachment>
                    <AttachmentIcon src={clip} />
                    <AttachmentName href={`/api/message/getFile?mafile_no=${data.detail.mailFileList[0].mafile_no}`}
                      fileName={data.detail.mailFileList[0].mafile_name.split('$$')[1]} onMouseDown={(e) => e.preventDefault()}>
                      {data.detail.mailFileList[0].mafile_name.split('$$')[1]}
                    </AttachmentName>
                  </Attachment>
                )}

                <CardHr />
                <CardFooter>
                  <Button onClick={() => navigate(-1)}>목록</Button>
                </CardFooter>
              </Card>
            </div>
          }
        </div>
      </MobileShell>
      <ConfirmModal />
    </>
  );
}